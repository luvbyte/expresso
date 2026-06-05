import { supabase } from "@/utils/supabase";

/**
 * First load
 */
export async function getRecentMedia(limit = 20) {
  const { data, error } = await supabase
    .from("uploads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return {
    items: data,
    cursor: data.length ? data[data.length - 1].created_at : null,
    hasMore: data.length === limit
  };
}

/**
 * Load more
 */
export async function loadMoreMedia(cursor, limit = 20) {
  if (!cursor) {
    return {
      items: [],
      cursor: null,
      hasMore: false
    };
  }

  const { data, error } = await supabase
    .from("uploads")
    .select("*")
    .lt("created_at", cursor)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return {
    items: data,
    cursor: data.length ? data[data.length - 1].created_at : null,
    hasMore: data.length === limit
  };
}

/**
 * Search media by title, author, tags, or type
 */
export async function searchMedia({
  query = "",
  type = null,
  limit = 50
} = {}) {
  let request = supabase
    .from("uploads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (type) {
    request = request.eq("type", type);
  }

  if (query.trim()) {
    const q = `%${query.trim()}%`;

    request = request.or(
      `title.ilike.${q},author.ilike.${q}`
    );
  }

  const { data, error } = await request;

  if (error) throw error;

  if (!query.trim()) return data;

  const search = query.toLowerCase();

  return data.filter(item =>
    item.title?.toLowerCase().includes(search) ||
    item.author?.toLowerCase().includes(search) ||
    item.tags?.some(tag =>
      tag.toLowerCase().includes(search)
    )
  );
}

/**
 * Upload file + create DB record
 */
export async function uploadMedia({ file, title, author, tags = [] }) {
  if (!file) {
    throw new Error("File is required");
  }

  const extension = file.name.split(".").pop();

  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const typeMap = {
    png: "sticker",
    gif: "gif",
    webp: "webp"
  };

  const type = typeMap[extension];

  if (!type) {
    throw new Error(`Unsupported file type: .${extension}`);
  }

  const path = `${extension}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, file);

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from("media").getPublicUrl(path);

  const { data, error } = await supabase
    .from("uploads")
    .insert({
      title,
      author,
      type,
      tags,
      file_url: publicUrl,
      thumbnail_url: publicUrl
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}
