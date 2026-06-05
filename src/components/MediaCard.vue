<template>
  <div
    class="card bg-base-100 shadow-lg border-2 border-base-content/10"
    @click="emit('select', file)"
  >
    <figure>
      <img
        :src="file.thumbnail_url"
        :alt="file.title"
        class="h-40 w-full object-cover"
      />
    </figure>

    <div class="card-body p-3">
      <h2 v-if="file.title.length > 0" class="font-bold">{{ file.title }}</h2>
      <p class="text-sm opacity-70">
        by
        <span class="text-info">
          {{ file.author.length > 0 ? file.author : "Anonymous" }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(["file"]);
  const emit = defineEmits(["select"]);
</script>
