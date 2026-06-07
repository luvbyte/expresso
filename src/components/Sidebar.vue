<script setup lang="ts">
  import { ref, onMounted, onBeforeMount } from "vue";
  import { getTheme, applyTheme, VERSION } from "@/api/config";

  import { usePWAInstall } from "@/composables/usePWAInstall";
  const { installPWA, isInstallable } = usePWAInstall();

  // Daisyui themes
  const themes = [
    "cupcake",
    "corporate",
    "dim",
    "valentine",
    "dracula",
    "light",
    "dark",
    "coffee",
    "black",
    "retro",
    "halloween",
    "bumblebee",
    "synthwave",
    "emerald",
    "forest",
    "caramellatte",
    "luxury",
    "garden",
    "sunset",
    "lofi",
    "business",
    "pastel",
    "night",
    "fantasy",
    "abyss",
    "wireframe",
    "cmyk",
    "autumn",
    "acid",
    "lemonade",
    "winter",
    "nord",
    "silk"
  ];

  const currentTheme = ref(getTheme());

  function setTheme(name) {
    applyTheme(name);
    currentTheme.value = name;
  }

  onMounted(async () => {
    applyTheme(currentTheme.value);
  });
</script>

<template>
  <div class="p-2 fscreen glass flex flex-col py-4">
    <div class="relative flex-1 flex flex-col gap-2">
      <!-- Top -->
      <div class="w-full flex flex-col gap-2 justify-center items-center">
        <div>
          <!-- Cat Icon -->
          <img class="w-42 rounded-lg" src="/images/banner.gif" />
        </div>
        <h1>Expresso 彡 {{ VERSION }}</h1>
      </div>

      <!-- PWA Install button -->
      <div
        v-if="isInstallable"
        @click="installPWA"
        class="flex justify-between items-center bg-primary text-primary-content glass rounded-lg shadow-primary/50 p-2 gap-2"
      >
        <h1>Install App</h1>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M4 16h4v4H4V16z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin=".2"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M10 16h4v4h-4V16z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin=".4"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M16 16h4v4h-4V16z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin=".6"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M4 10h4v4H4V10z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin=".8"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M10 10h4v4h-4V10z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin="1"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M16 10h4v4h-4V10z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin="1.2"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M4 4h4v4H4V4z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin="1.4"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M10 4h4v4h-4V4z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin="1.6"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M16 4h4v4h-4V4z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin="1.8"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
          </svg>
        </span>
      </div>

      <!-- themes -->
      <div class="flex flex-col overflow-hidden text-xs">
        <h1 class="divider m-0 uppercase">Theme ☷ {{ currentTheme }}</h1>
        <div
          class="rounded py-1 grid grid-rows-2 grid-flow-col space-x-1 space-y-1 overflow-x-auto scrollbar-hide"
        >
          <div
            v-for="theme in themes"
            :data-theme="theme"
            @click="setTheme(theme)"
            class="w-12 h-12 border-2 shrink-0 rounded-full base-border flex items-center justify-center gap-1 p-1 active:border-base-content"
            :class="
              currentTheme === theme
                ? 'border-base-content'
                : 'border-base-content/20'
            "
          >
            <div class="w-1 h-4 bg-primary rounded"></div>
            <div class="w-1 h-4 bg-secondary rounded"></div>
            <div class="w-1 h-4 bg-info rounded"></div>
            <div class="w-1 h-4 bg-primary rounded"></div>
          </div>
        </div>
        <div class="divider m-0"></div>
      </div>
    </div>

    <!-- footer -->
    <pre class="flex justify-center items-center text-xs">
        
♡  ∩_∩
 （„• ֊ •„)♡
┏ • UU • - • - • - • - • - • - • ღ❦ღ┓</pre
    >
    <div
      class="divider m-0 text-sm flex items-center gap-1 justify-center my-4"
    >
      <span class="badge badge-sm badge-primary font-semibold font-heading"
        >Expresso</span
      >
      ツ
      <span class="badge badge-sm badge-secondary font-semibold font-heading"
        >luvbyte ᥫ᭡</span
      >
    </div>
    <pre class="flex justify-center items-center text-xs">
┗ღ❦ღ • - • - • - • - • - • -- •- •  ┛
      </pre
    >
    <!-- Social Links -->
    <div class="pb-3 px-1 flex items-center justify-center gap-2">
      <!-- Instagram -->
      <a href="https://instagram.com/4b_49_4b_4b_55" target="_blank">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
        >
          <g fill="none" stroke="currentColor" stroke-width="1.5">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
            />
            <path
              d="M3 16V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m17.5 6.51l.01-.011"
            />
          </g>
        </svg>
      </a>
      <!-- Github -->
      <a href="https://github.com/luvbyte/expresso" target="_blank">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
          />
        </svg>
      </a>
      <!-- Portfolio -->
      <a href="https://kikku.vercel.app" target="_blank">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 48 48"
        >
          <g fill="none" stroke="currentColor" stroke-width="3">
            <path
              stroke-linejoin="round"
              d="M3.539 39.743c.208 2.555 2.163 4.51 4.718 4.718C11.485 44.723 16.636 45 24 45s12.515-.277 15.743-.539c2.555-.208 4.51-2.163 4.718-4.718C44.723 36.515 45 31.364 45 24s-.277-12.515-.539-15.743c-.208-2.555-2.163-4.51-4.718-4.718C36.515 3.277 31.364 3 24 3s-12.515.277-15.743.539c-2.555.208-4.51 2.163-4.718 4.718C3.277 11.485 3 16.636 3 24s.277 12.515.539 15.743Z"
            />
            <path stroke-linecap="round" d="M3.5 13.5h41" />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 8.5h2m6 0h2"
            />
          </g>
        </svg>
      </a>
    </div>
  </div>
</template>
