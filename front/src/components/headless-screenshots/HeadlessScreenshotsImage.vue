<script setup lang="ts">
import { socket } from '~/socket-io.js';
import { headlessClient } from '~/client/headless.client.js';

const screenshot = ref('');
const screenshotImg = ref<HTMLImageElement>();
socket.on('update-screenshot', data => {
  screenshot.value = 'data:image/png;base64, ' + data;
  showingScreenshotIndicator.value = true;
  setTimeout(() => {
    showingScreenshotIndicator.value = false;
  }, 200);
});
const onScreenshotClick = (ev: PointerEvent) => {
  if (!screenshotImg.value) {
    return;
  }
  const img = screenshotImg.value;
  headlessClient.screenshotClick(
      ev.offsetX / img?.clientWidth * img?.naturalWidth,
      ev.offsetY / img?.clientHeight * img?.naturalHeight,
  );
};
const onScreenshotType = (ev: KeyboardEvent) => {
  headlessClient.screenshotType(ev.key, ev.code);
};
const showingScreenshotIndicator = ref(false);
</script>

<template>
  <div class="relative overflow-y-scroll ml-[12px] mr-[12px]">
    <img
        :src="screenshot"
        alt=""
        ref="screenshotImg"
        @click="onScreenshotClick"
        @keyup="onScreenshotType"
        tabindex="0"
        class="border-[1px] border-black"
    />
    <div class="absolute top-[5px] right-[5px] w-[20px] h-[20px] bg-blue-400 rounded-[50%]"
         v-show="showingScreenshotIndicator"></div>
  </div>
</template>
