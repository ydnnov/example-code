<script setup lang="ts">
import Button from 'primevue/button';
import { headlessClient } from '~/client/headless.client.js';

const url = ref('https://google.com');
const goto = (value: string) => {
  url.value = 'https://' + value.replace(/^https:\/\//, '');
  headlessClient.goto(url.value);
};
const reloadPage = () => {
  headlessClient.reloadPage();
};
</script>

<template>
  <div class="goto-url">
    <input
      type="text"
      v-model="url"
      @keydown.enter="goto(url)"
      style="border: 1px solid black; width: 100%;"
    />
    <div style="display: flex; margin: 7px 0 0 0;">
      <div style="flex-grow: 1;">
        <Button @click="reloadPage()" class="hlctl-btn" style="width: 36px;" icon="pi pi-refresh" />
        <Button @click="goto(url)" class="hlctl-btn" label="Go" />
        <Button @click="goto('yandex.ru')" class="hlctl-btn" label="YandexRu" />
        <Button @click="goto('google.com')" class="hlctl-btn" label="GoogleCom" />
        <Button @click="goto('yahoo.com')" class="hlctl-btn" label="YahooCom" />
      </div>
      <div style="flex-grow: 0;">
        <HeadlessScreenshotsControls />
      </div>
    </div>
  </div>
  <div>
    <HeadlessScreenshotsImage />
  </div>
</template>

<style scoped lang="scss">
.hlctl-btn {
  font-size: 80%;
  height: 32px;
  margin: 0 4px 5px 0;
}
</style>
