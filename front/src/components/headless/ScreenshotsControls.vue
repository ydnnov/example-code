<script setup lang="ts">
// import _ from 'lodash';
import { useDebounceFn } from '@vueuse/core';
import { useStorage } from '@vueuse/core';
// import useClient from '~/composables/useClient.js';

// const client = useClient();

// const screenshotSendInterval = useStorage('screenshot-interval', '1000');
// const screenshotSendIntervalValid = () => {
//   return screenshotSendInterval.value.match(/^\d+$/) &&
//       (Number(screenshotSendInterval.value) >= 100) &&
//       (Number(screenshotSendInterval.value) <= 60000);
// };
// const startSendingScreenshots = () => {
//   client.headlessScreenshots.startSending();
// };
// const stopSendingScreenshots = () => {
//   client.headlessScreenshots.stopSending();
// };
// // const sendUpdateScreenshotInterval = _.debounce(() => {
// const sendUpdateScreenshotInterval = useDebounceFn(() => {
//   if (!screenshotSendIntervalValid()) return;
//   client.headlessScreenshots.setSendInterval(Number(screenshotSendInterval.value));
// }, 500);
// watch(screenshotSendInterval, (value) => {
//   sendUpdateScreenshotInterval();
// });
// if (screenshotSendIntervalValid()) {
//   client.headlessScreenshots.setSendInterval(Number(screenshotSendInterval.value));
// }
// sendUpdateScreenshotInterval();
// startSendingScreenshots();
</script>

<template>
  <div class="flex flex-col items-end mr-3">
<!--
    <div class="mb-2 flex">
      <q-btn @click="startSendingScreenshots" class="text-sm h-8 mr-1" label="on" />
      <q-btn @click="stopSendingScreenshots" class="text-sm h-8" label="off" />
    </div>
    <div>
      <q-input
          type="text"
          v-model="screenshotSendInterval"
          :class="{'p-invalid': !screenshotSendIntervalValid()}"
          class="w-24 h-10"
      />
    </div>
-->
  </div>
</template>
