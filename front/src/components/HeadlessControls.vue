<script setup lang="ts">
import Button from 'primevue/button';
import { headlessClient } from '~/client/headless.client.js';

const predefinedSites = reactive([
  ['yandex.ru', 'YandexRu'],
  ['google.com', 'GoogleCom'],
  ['yahoo.com', 'YahooCom'],
  ['2ust.arh.msudrf.ru', '2ust.arh.msudrf.ru'],
  ['32.sar.msudrf.ru', '32.sar.msudrf.ru'],
]);
const url = ref('https://google.com');
const goto = (value: string) => {
  console.log({ value });
  if (value.match(/^https?:\/\//)) {
    url.value = value;
  } else {
    url.value = 'https://' + value;
  }
  headlessClient.goto(url.value);
};
const reloadPage = () => {
  headlessClient.reloadPage();
};
</script>

<template>
  <div class="">
    <div class="mt-1">
      <div class="mx-3">
        <input
            type="text"
            v-model="url"
            @keydown.enter="goto(url)"
            class="w-full border-2 border-slate-300 h-8 px-3"
        />
      </div>
      <div class="flex mt-2 justify-between">
        <div class="ml-3">
          <Button
              @click="reloadPage()"
              class="w-8 h-8 mr-1 mb-1"
              icon="pi pi-refresh"
          />
          <Button
              @click="goto(url)"
              class="text-sm h-8 mr-1 mb-1"
              label="Go"
          />
          <Button
              v-for="(site, index) in predefinedSites"
              :key="index"
              @click="goto(site[0])"
              class="text-sm h-8 mr-1 mb-1"
              :label="site[1]"
          />
        </div>
        <div>
          <HeadlessScreenshotsControls />
        </div>
      </div>
    </div>
    <div class="mt-2">
      <HeadlessScreenshotsImage />
    </div>
  </div>
</template>
