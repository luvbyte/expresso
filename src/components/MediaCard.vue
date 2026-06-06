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
      <h1 v-if="file.title.length > 0" class="font-bold truncate">
        {{ file.title }}
      </h1>
      <p class="text-sm opacity-70">
        by
        <span
          @click.stop="emit('search', file.author)"
          class="text-info truncate"
        >
          @{{ file.author.length > 0 ? file.author : "Anonymous" }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(["file"]);
  const emit = defineEmits(["select", "search"]);
</script>
