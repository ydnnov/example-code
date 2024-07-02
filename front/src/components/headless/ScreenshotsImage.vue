<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { client } from 'src/client/client.js';
import { socket } from 'boot/websocket.js';

const screenshot = ref('');
const screenshotImg = ref<HTMLImageElement>();
const showingScreenshotIndicator = ref(false);
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
  client.headless.screenshotClick(
      ev.offsetX / img?.clientWidth * img?.naturalWidth,
      ev.offsetY / img?.clientHeight * img?.naturalHeight,
  );
};
const onScreenshotType = (ev: KeyboardEvent) => {
  client.headless.screenshotType(ev.key, ev.code);
};
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
