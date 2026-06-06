<script setup>
  import { ref } from "vue";
  import { uploadMedia } from "@/api";

  const emit = defineEmits(["close"]);

  const uploading = ref(false);

  const form = ref({
    title: "",
    author: "",
    tags: [],
    file: null
  });

  const errors = ref({
    title: ""
  });

  const tagInput = ref("");

  const addTag = () => {
    tagInput.value
      .split(",")
      .map(tag => tag.trim().toLowerCase())
      .filter(Boolean)
      .forEach(tag => {
        if (!form.value.tags.includes(tag)) {
          form.value.tags.push(tag);
        }
      });

    tagInput.value = "";
  };

  const removeTag = index => {
    form.value.tags.splice(index, 1);
  };

  const preview = ref(null);

  const allowedTypes = ["image/png", "image/gif", "image/webp"];

  const handleFile = e => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      errors.value.title = "Only PNG, GIF, and WEBP files are allowed";
      e.target.value = "";
      return;
    }

    form.value.file = file;
    preview.value = URL.createObjectURL(file);
  };

  const uploadFile = async () => {
    errors.value.title = "";

    if (!form.value.title.trim()) {
      errors.value.title = "Title is required";
      return;
    }

    if (!form.value.file) {
      errors.value.title = "Please select a file";
      return;
    }

    try {
      uploading.value = true;

      await uploadMedia({
        file: form.value.file,
        title: form.value.title,
        author: form.value.author,
        tags: form.value.tags
      });

      location.reload();
    } catch (err) {
      console.error(err);
      errors.value.title = err.message || "Upload failed";
    } finally {
      uploading.value = false;
    }
  };

  const resetFile = () => {
    if (preview.value) {
      URL.revokeObjectURL(preview.value);
    }

    form.value.file = null;
    preview.value = null;
  };
</script>

<template>
  <div
    class="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    @click="emit('close')"
  >
    <div
      class="card bg-base-100 w-full max-w-xl shadow-2xl overflow-y-auto"
      @click.stop
    >
      <div class="card-body p-6 md:p-8">
        <div class="space-y-2">
          <!-- Title -->
          <div>
            <label class="label">
              <span class="label-text font-medium"> Title * </span>
            </label>

            <input
              v-model="form.title"
              type="text"
              maxlength="100"
              class="input input-bordered w-full focus:outline-none placeholder:opacity-60"
              placeholder="Funny Cat Meme"
            />

            <label class="label">
              <span class="label-text-alt opacity-60">
                {{ form.title.length }}/100
              </span>
            </label>
          </div>

          <!-- Author + Tags -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label class="label">
                <span class="label-text"> Author </span>
              </label>

              <input
                v-model="form.author"
                type="text"
                class="input input-bordered w-full focus:outline-none placeholder:opacity-60"
                placeholder="Your name"
              />
            </div>

            <div class="space-y-2">
              <!-- Tags -->
              <div v-if="form.tags.length" class="flex flex-wrap gap-2">
                <div
                  v-for="(tag, index) in form.tags"
                  :key="tag"
                  class="badge badge-primary gap-2 py-3"
                >
                  {{ tag }}

                  <button type="button" @click="removeTag(index)">✕</button>
                </div>
              </div>

              <!-- Input + Add Button -->
              <div class="flex gap-2">
                <input
                  v-model="tagInput"
                  type="text"
                  class="input input-bordered flex-1 focus:outline-none"
                  placeholder="Add a tag"
                  @keydown.enter.prevent="addTag"
                />

                <button
                  type="button"
                  class="btn btn-primary"
                  :disabled="!tagInput.trim()"
                  @click="addTag"
                >
                  Add
                </button>
              </div>

              <p class="text-xs opacity-60">Press Enter or tap Add</p>
            </div>
          </div>

          <!-- Upload Area -->
          <div v-if="!preview" class="pt-2">
            <label
              class="border-2 border-dashed border-base-content/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-base-200/50 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-12 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              <div class="text-center">
                <p class="font-semibold">Click to upload</p>

                <p class="text-sm opacity-60">PNG, GIF or WEBP</p>
                <p class="text-sm opacity-40">3 MB Max Size</p>
              </div>

              <input
                type="file"
                class="hidden"
                accept=".png,.gif,.webp,image/png,image/gif,image/webp"
                @change="handleFile"
              />
            </label>
          </div>

          <!-- Preview -->
          <div
            v-if="preview"
            class="pt-2 relative card bg-base-200 border overflow-hidden"
          >
            <!-- Remove Button -->
            <button
              class="btn btn-circle btn-sm btn-error absolute top-3 right-3 z-10"
              @click="resetFile"
            >
              ✕
            </button>

            <figure class="p-4">
              <img
                :src="preview"
                alt="Preview"
                class="rounded-xl max-h-80 object-contain"
              />
            </figure>

            <div class="px-4 pb-4 text-center">
              <p class="font-medium truncate">
                {{ form.file?.name }}
              </p>

              <p class="text-xs opacity-60">
                {{ (form.file?.size / 1024).toFixed(1) }} KB
              </p>
            </div>
          </div>

          <!-- Error -->
          <div v-if="errors.title" class="alert alert-error">
            <span>{{ errors.title }}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-actions justify-end mt-6">
          <button class="btn btn-ghost" @click="emit('close')">Cancel</button>

          <button
            class="btn btn-primary min-w-36"
            :disabled="uploading"
            @click="uploadFile"
          >
            <svg
              v-if="uploading"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="currentColor"
                d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                opacity=".5"
              />
              <path
                fill="currentColor"
                d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
              >
                <animateTransform
                  attributeName="transform"
                  dur="1s"
                  from="0 12 12"
                  repeatCount="indefinite"
                  to="360 12 12"
                  type="rotate"
                />
              </path>
            </svg>

            {{ uploading ? "Uploading..." : "Upload" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
