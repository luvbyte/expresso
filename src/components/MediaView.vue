<template>
  <div
    class="fixed inset-0 z-60 bg-black/80 p-4 flex flex-col gap-4 md:place-items-center overflow-y-auto"
    @click="emit('close')"
  >
    <!-- Info Card -->
    <div
      class="max-w-6xl w-full rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 text-white"
    >
      <h1
        v-if="selected.title"
        class="text-xl md:text-2xl font-bold tracking-tight max-h-16 overflow-y-auto"
      >
        {{ selected.title }}
      </h1>

      <p class="text-sm text-white/80 mt-1">
        by
        <span class="font-medium text-cyan-300">
          {{ selected.author || "Anonymous" }}
        </span>
      </p>

      <div v-if="selected.tags?.length" class="flex gap-2 mt-3 overflow-x-auto">
        <span
          v-for="tag in selected.tags"
          :key="tag"
          class="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/20 hover:bg-white/20 transition"
        >
          #{{ tag }}
        </span>
      </div>
    </div>

    <div class="max-w-6xl w-full flex justify-center" @click.stop>
      <!-- Image -->
      <img
        :src="selected.file_url"
        :alt="selected.title"
        class="max-h-[60vh] max-w-full rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] object-contain"
      />
    </div>

    <div class="flex justify-center gap-2">
      <button
        @click="emit('close')"
        class="btn btn-sm bg-error text-white border-none shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
          />
        </svg>
      </button>
      <button
        @click="shareMedia"
        class="btn btn-sm bg-info text-white border-none shadow-lg"
      >
        Share
      </button>

      <button
        @click="downloadMedia"
        class="btn btn-sm bg-success text-white border-none shadow-lg"
      >
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
