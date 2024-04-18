<script setup lang="ts">
// import _ from 'lodash';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { headlessScreenshotsClient } from '~/client/headless-screenshots.client.js';
import { useDebounceFn } from "@vueuse/core";
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
  <Button @click="startSendingScreenshots" class="hlctl-scr-btn" label="on" />
  <Button @click="stopSendingScreenshots" class="hlctl-scr-btn" label="off" />
  <InputText
    type="text"
    v-model="screenshotSendInterval"
    :class="{'p-invalid': !screenshotSendIntervalValid()}"
    style="width: 100px; height: 32px;"
  />
</template>

<style scoped lang="scss">
.hlctl-scr-btn {
  font-size: 80%;
  height: 32px;
  margin: 0 2px 0 0;
}
</style>
