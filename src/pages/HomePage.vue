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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="3"
                  d="M17.58 9.71a6 6 0 0 0-7.16 3.58m7.16-3.58A6 6 0 1 1 12 19.972M17.58 9.71a6 6 0 1 0-11.16 0m4 3.58A6 6 0 0 0 10 15.5c0 1.777.773 3.374 2 4.472m-1.58-6.682a6.01 6.01 0 0 1-4-3.58m0 0A6 6 0 1 0 12 19.972"
                />
              </svg>
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
    <div class="relative">
      <input
        v-model="search"
        class="w-full input input-sm rounded focus:outline-none placeholder:opacity-60"
        placeholder="Search by user / tag / title"
      />
      <div
        v-if="search.length > 0"
        @click="search = ''"
        class="absolute right-2 top-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
          />
        </svg>
      </div>
    </div>
    <!-- Media Grid -->
    <div class="flex-1 overflow-y-auto" ref="scrollContainer">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <MediaCard
          v-for="file in files"
          :key="file.id"
          :file="file"
          @select="file => (selected = file)"
          @search="text => (search = text)"
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
    <div
      class="fixed inset-0 z-20 full overflow-hidden"
      @click.self="showSidebar = false"
      :class="{ 'pointer-events-none -z-20': !showSidebar }"
    >
      <!-- SIDEBAR -->
      <Transition name="slide-right">
        <div v-show="showSidebar" class="relative h-full w-3/4 sm:w-1/2 glass">
          <Sidebar />
        </div>
      </Transition>
    </div>
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

  const selected = ref(null);
  const uploader = ref(false);

  const sentinel = ref();

  const files = ref([]);
  const cursor = ref(null);
  const hasMore = ref(true);
  const loading = ref(false);

  const search = ref("");

  let observer;
  // debounce timer
  let searchTimeout;

  async function handleSearch(query) {
    files.value = [];
    cursor.value = null;
    hasMore.value = true;

    if (!query) {
      await loadInitial();
      return;
    }

    loading.value = true;

    try {
      const result = await searchMedia({
        query
      });

      files.value = result.items;
      cursor.value = result.cursor;
      hasMore.value = result.hasMore;
    } finally {
      loading.value = false;
    }
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

    loading.value = true;

    try {
      let result;

      if (search.value.trim()) {
        result = await searchMedia({
          query: search.value.trim(),
          cursor: cursor.value
        });
      } else {
        result = await loadMoreMedia(cursor.value);
      }

      files.value.push(...result.items);
      cursor.value = result.cursor;
      hasMore.value = result.hasMore;
    } finally {
      loading.value = false;
    }
  }

  // let observer;

  onMounted(() => {
    loadInitial();

    observer = new IntersectionObserver(
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

  onUnmounted(() => {
    observer?.disconnect();
  });
</script>
