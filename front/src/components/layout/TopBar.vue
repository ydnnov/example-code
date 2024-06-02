<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import { useBagStore } from '~/stores/bag.store.js';
import { useUserStore } from '~/stores/user.store.js';
import { useUiStore } from '~/stores/ui.store.js';
import { useToast } from 'primevue/usetoast';
import useClient from '~/composables/useClient.js';

const { bag } = useBagStore();
const { user } = useUserStore();
const { ui } = useUiStore();
const toast = useToast();
const client = useClient();

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
  },
]);

const msudrfSudDeloStart = async () => {
  const response = await client.parser.run('msudrf/sudebnoye-deloproizvodstvo', {
    fio: bag['parserInputText'],
  });
  toast.add({
    severity: 'success',
    summary: 'Response',
    group: 'jsonResult',
    detail: response,
    life: 0,
  });
};

const msudrfTerrPodsStart = async () => {
  const response = await client.parser.run('msudrf/territorialnaya-podsudnost', {
    address: bag['parserInputText'],
  });
};

const someAction = async () => {
  client.headless.goto('https://bing.com');
  // toast.add({
  //   detail: config.public.backendUrl,
  // });
};
</script>

<template>
  <Toast position="bottom-left" group="jsonResult" style="width: calc(100% - 40px)">
    <template #message="{message}">
      <pre style="overflow-x: scroll">{{ message.detail }}</pre>
    </template>
  </Toast>
  <div class="card">
    <Menubar :model="items">
      <template #start>
        <div class="bg-amber-400 w-[40px] h-[40px] mr-[10px] rounded-[4px]"></div>
      </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <a v-ripple class="flex align-items-center" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
          <span v-if="item.shortcut"
                class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut }}</span>
          <i v-if="hasSubmenu"
             :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
        </a>
      </template>
      <template #end>
        <div class="flex align-items-center gap-2">
          <div class="">
            <Button
                @click="ui.mainSplitter.swapped = !ui.mainSplitter.swapped"
                :icon="`pi pi-arrows-${ui.mainSplitter.horizontal ? 'h' : 'v'}`"
                class="w-[40px] h-[40px] ml-4"
            />
            <Button
                @click="ui.mainSplitter.horizontal = !ui.mainSplitter.horizontal"
                icon="pi pi-desktop"
                class="w-[40px] h-[40px] ml-2"
                :class="ui.mainSplitter.horizontal ? '' : 'rotate-90'"
            />
          </div>
          <div class="ml-2 border-l-[3px] border-black-500">
            <Button
                @click="ui.mainSplitter.panels[1] = 'code-exec'"
                icon="pi pi-code"
                class="w-[40px] h-[40px] ml-4"
            />
            <Button
                @click="ui.mainSplitter.panels[1] = 'event-bus'"
                icon="pi pi-align-left"
                class="w-[40px] h-[40px] ml-2"
            />
          </div>
          <div class="ml-2 border-l-[3px] border-black-500">
            <InputText
                placeholder="Search"
                type="text"
                class="ml-4"
                v-model="bag['parserInputText']"
            />
          </div>
          <div class="ml-2">
            <Button
                @click="msudrfSudDeloStart"
                label="Судебное делопроизводство"
                class="h-[40px] mx-4"
            />
            <Button
                @click="msudrfTerrPodsStart"
                label="Территориальная подсудность"
                class="h-[40px] mx-4"
            />
          </div>

          <div class="ml-2 border-l-[3px] border-black-500">
            <Button
                @click="someAction"
                label="someAction"
                class="h-[40px] mx-4"
            />
          </div>

          <div class="mt-[7px] ml-10">{{ user.name }}</div>

          <Avatar
              image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
              shape="circle"
              size="large"
              class="size-[40px] ml-2"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>
