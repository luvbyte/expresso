<template>
  <div
    class="fixed inset-0 z-60 bg-black/60 flex flex-col gap-3 items-center justify-center p-4"
    @click="emit('close')"
  >
    <div class="relative max-w-5xl max-h-full" @click.stop>
      <img
        :src="selected.file_url"
        :alt="selected.title"
        class="max-h-[90vh] max-w-full rounded-lg shadow-2xl"
      />

      <div
        class="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 rounded-b-lg"
      >
        <h2 v-if="selected.title.length > 0" class="font-bold">
          {{ selected.title }}
        </h2>
        <p class="text-sm opacity-80">
          by
          <span class="text-info">
            {{ selected.author.length > 0 ? selected.author : "Anonymous" }}
          </span>
        </p>

        <div class="flex flex-wrap gap-1 mt-2">
          <span
            v-for="tag in selected.tags"
            :key="tag"
            class="badge badge-outline badge-sm text-white"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </div>

    <div class="p-2 flex gap-2">
      <button @click="shareMedia" class="btn btn-sm btn-info">Share</button>
      <button @click="downloadMedia" class="btn btn-sm btn-primary">
        Download
      </button>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(["selected"]);
  const emit = defineEmits(["close"]);

  const downloadMedia = async () => {
    try {
      const response = await fetch(props.selected.file_url);

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = props.selected.title || "download";

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const shareMedia = async () => {
    try {
      const response = await fetch(props.selected.file_url);
      const blob = await response.blob();

      const extension = props.selected.file_url.split(".").pop();

      const file = new File([blob], `sticker.${extension}`, {
        type: blob.type
      });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: props.selected.title
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
</script>
