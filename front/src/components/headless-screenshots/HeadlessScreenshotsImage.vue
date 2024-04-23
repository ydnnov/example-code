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
  headlessClient.screenshotType(ev.code);
};
const showingScreenshotIndicator = ref(false);
</script>

<template>
  <div style="position: relative; overflow-y: scroll">
    <img
      :src="screenshot"
      alt=""
      ref="screenshotImg"
      @click="onScreenshotClick"
      @keyup="onScreenshotType"
      tabindex="0"
      style="border: 1px solid black; width: 100%; height: 100%; -webkit-user-drag: none"
    />
    <div
      style="
          position: absolute;
          right: 5px;
          top: 5px;
          width: 15px;
          height: 15px;
          background: deepskyblue;
          border-radius: 50%;
      "
      v-show="showingScreenshotIndicator"
    ></div>
  </div>
</template>
