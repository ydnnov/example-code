<script setup lang="ts">
// import _ from 'lodash';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { headlessScreenshotsClient } from '~/client/headless-screenshots.client.js';
import { useDebounceFn } from '@vueuse/core';
import { useStorage } from '@vueuse/core';

const screenshotSendInterval = useStorage('screenshot-interval', '1000');
const screenshotSendIntervalValid = () => {
  return screenshotSendInterval.value.match(/^\d+$/) &&
      (Number(screenshotSendInterval.value) >= 100) &&
      (Number(screenshotSendInterval.value) <= 60000);
};
const startSendingScreenshots = () => {
  headlessScreenshotsClient.startSending();
};
const stopSendingScreenshots = () => {
  headlessScreenshotsClient.stopSending();
};
// const sendUpdateScreenshotInterval = _.debounce(() => {
const sendUpdateScreenshotInterval = useDebounceFn(() => {
  if (!screenshotSendIntervalValid()) return;
  headlessScreenshotsClient.setSendInterval(Number(screenshotSendInterval.value));
}, 500);
watch(screenshotSendInterval, (value) => {
  sendUpdateScreenshotInterval();
});
if (screenshotSendIntervalValid()) {
  headlessScreenshotsClient.setSendInterval(Number(screenshotSendInterval.value));
}
sendUpdateScreenshotInterval();
startSendingScreenshots();
</script>

<template>
  <div class="flex flex-col items-end mr-3">
    <div class="mb-2 flex">
      <Button @click="startSendingScreenshots" class="text-sm h-8 mr-1" label="on" />
      <Button @click="stopSendingScreenshots" class="text-sm h-8" label="off" />
    </div>
    <div>
      <InputText
          type="text"
          v-model="screenshotSendInterval"
          :class="{'p-invalid': !screenshotSendIntervalValid()}"
          class="w-24 h-10"
      />
    </div>
  </div>
</template>
