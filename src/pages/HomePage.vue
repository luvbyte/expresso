<template>
  <div class="flex-1 p-2 gap-3 flex flex-col overflow-hidden">
    <!-- Nav header -->
    <div class="bg-base-100 border-b border-base-300">
      <div class="max-w-7xl mx-auto px-2 py-3">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-extrabold">Expresso</h1>
            <p class="text-xs opacity-60">Stickers & GIFs</p>
          </div>

          <div class="flex gap-2">
            <button
              @click="showSidebar = true"
              class="btn btn-circle btn-outline btn-sm"
            >
              🎨
            </button>

            <button
              @click="uploader = true"
              class="btn btn-primary btn-sm px-5"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Search -->
    <div>
      <input
        v-model="search"
        class="w-full input input-sm rounded focus:outline-none placeholder:opacity-60"
        placeholder="Search by user / tag / title"
      />
    </div>
    <!-- Media Grid -->
    <div class="flex-1 overflow-y-auto" ref="scrollContainer">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <MediaCard
          v-for="file in files"
          :key="file.id"
          :file="file"
          @select="file => (selected = file)"
        />
      </div>

      <!-- Bottom sentinel -->
      <div ref="sentinel" class="h-10"></div>

      <div v-if="loading" class="p-2 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
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
      </div>
    </div>

    <!-- Media View -->
    <Transition name="fade-scale">
      <MediaView
        v-if="selected"
        :selected="selected"
        @close="selected = null"
      />
    </Transition>

    <!-- Upload Gif -->
    <Transition name="fade-scale">
      <UploadView v-if="uploader" @close="uploader = false" />
    </Transition>

    <!-- Sidebar -->
    <Transition name="slide-right">
      <div
        v-show="showSidebar"
        class="fixed fscreen z-90"
        @click.self="showSidebar = false"
      >
        <Sidebar />
      </div>
    </Transition>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, watch } from "vue";
  import { getRecentMedia, loadMoreMedia, searchMedia } from "@/api";

  import MediaCard from "@/components/MediaCard.vue";
  import MediaView from "@/components/MediaView.vue";
  import UploadView from "@/components/UploadView.vue";
  import Sidebar from "@/components/Sidebar.vue";

  const showSidebar = ref(false);

  let observer;
  const selected = ref(null);
  const uploader = ref(false);

  const sentinel = ref();

  const files = ref([]);
  const cursor = ref(null);
  const hasMore = ref(true);
  const loading = ref(false);

  const search = ref("");

  // debounce timer
  let searchTimeout;

  async function handleSearch(query) {
    if (!query) {
    files.value = [];
      await loadInitial();
      return;
    }

    files.value = [];
    loading.value = true;

    files.value = await searchMedia({
      query
    });

    loading.value = false;
  }

  watch(search, value => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      handleSearch(value.trim());
    }, 500); // 500ms debounce
  });

  async function loadInitial() {
    loading.value = true;

    const result = await getRecentMedia();

    files.value = result.items;
    cursor.value = result.cursor;
    hasMore.value = result.hasMore;

    loading.value = false;
  }

  async function loadMore() {
    if (loading.value) return;
    if (!hasMore.value) return;
    if (!cursor.value) return;

    loading.value = true;

    try {
      const result = await loadMoreMedia(cursor.value);

      files.value.push(...result.items);
      cursor.value = result.cursor;
      hasMore.value = result.hasMore;
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadInitial();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 0.1
      }
    );

    observer.observe(sentinel.value);
  });
</script>
