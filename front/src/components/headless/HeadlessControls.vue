<script setup lang="ts">
import Button from 'primevue/button';
import useClient from '~/composables/useClient.js';
import { useFrontStore } from '~/stores/front.store.js';

const client = useClient();
const { frontInitData } = useFrontStore();

const predefinedSites = reactive([
  ['yandex.ru', 'YandexRu'],
  ['google.com', 'GoogleCom'],
  ['yahoo.com', 'YahooCom'],
  ['http://2ust.arh.msudrf.ru', '2ust.arh.msudrf.ru'],
  ['http://32.sar.msudrf.ru', '32.sar.msudrf.ru'],
]);
const currentUrl = ref(frontInitData?.page.url);
const goto = (value: string) => {
  if (value.match(/^https?:\/\//)) {
    currentUrl.value = value;
  } else {
    currentUrl.value = 'https://' + value;
  }
  client.headless.goto(currentUrl.value);
};
const reloadPage = () => {
  client.headless.reloadPage();
};
</script>

<template>
  <div class="">
    <div class="mt-1">
      <div class="mx-3">
        <input
            type="text"
            v-model="currentUrl"
            @keydown.enter="goto(currentUrl)"
            class="w-full border border-slate-300 h-8 px-3"
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
              @click="goto(currentUrl)"
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
