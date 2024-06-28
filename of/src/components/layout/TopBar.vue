<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import { useBagStore } from '~/stores/bag.store.js';
import { useMsudrfSudDeloStore } from '~/stores/msudrf-sud-delo.store.js';
import { useUserStore } from '~/stores/user.store.js';
import { useUiStore } from '~/stores/ui.store.js';
import { useToast } from 'primevue/usetoast';
import useClient from '~/composables/useClient.js';
import TopBarLayoutControls from '~/components/layout/top-bar/TopBarLayoutControls.vue';
import { useFsspStore } from '~/stores/fssp.store.js';
import ParserTaskList from '~/components/parser-tasks/ParserTaskList.vue';

const { bag } = useBagStore();
const msudrfSudDelo = useMsudrfSudDeloStore();
const { user } = useUserStore();
const { ui } = useUiStore();
const fssp = useFsspStore();
const toast = useToast();
const client = useClient();

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
  },
]);

const sudDeloParseManyInput = ref('');
const sudDeloParseManyDialogVisible = ref(false);
const sudDeloButtonItems = [
  {
    label: 'Загрузить много',
    command: () => {
      // toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
      sudDeloParseManyDialogVisible.value = true;
    },
  },
];
const msudrfSudDeloStartOne = async () => {
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
const msudrfSudDeloStartMany = async () => {
  await msudrfSudDelo.addItemsToImport(sudDeloParseManyInput.value);
};

const msudrfTerrPodsStart = async () => {
  const response = await client.parser.run('msudrf/territorialnaya-podsudnost', {
    address: bag['parserInputText'],
  });
};

const fsspStartMany = async () => {
  try {
    const data = JSON.parse(fssp.toImportText);
    const response = await client.parser.run('fssp/search-ext-fizicheskoe-lico', data);
    if (response.success) {
      console.log(response);
    } else {
      toast.add({
        detail: response.err,
        severity: 'error',
      });
      console.log(response);
    }
  } catch (err) {
    toast.add({
      detail: err,
      severity: 'error',
    });
  }
};

const someAction = async () => {
  toast.add({
    detail: 'someAction',
  });
};
</script>

<template>
  <Toast position="bottom-left" group="jsonResult" style="width: calc(100% - 40px)">
    <template #message="{message}">
      <pre style="overflow-x: scroll">{{ message.detail }}</pre>
    </template>
  </Toast>
  <Dialog
      v-model:visible="sudDeloParseManyDialogVisible"
      modal
      header="Edit Profile"
      :style="{ width: '800px' }"
  >
    <Textarea v-model="sudDeloParseManyInput" rows="20" cols="65" />

    <div class="flex justify-between">
      <Button
          type="button"
          label="Загрузить"
          @click="msudrfSudDeloStartMany"
      ></Button>
      <Button
          type="button"
          label="Отмена"
          severity="secondary"
          @click="sudDeloParseManyDialogVisible = false"
      ></Button>
    </div>
  </Dialog>
  <Dialog
      v-model:visible="fssp.importDialogVisible"
      modal
      header="Загрузить"
      :style="{ width: '800px' }"
  >
    <Textarea v-model="fssp.toImportText" rows="20" cols="65" />

    <div class="flex justify-between">
      <Button
          type="button"
          label="Загрузить"
          @click="fsspStartMany"
      ></Button>
      <Button
          type="button"
          label="Отмена"
          severity="secondary"
          @click="fssp.importDialogVisible = false"
      ></Button>
    </div>
  </Dialog>
  <Dialog
      v-model:visible="bag.parserTasksDialogVisible"
      modal
      dismissable-mask
      header="Задачи по парсингу"
      :style="{ width: 'calc(100% - 100px)', height: 'calc(100% - 100px)' }"
  >
    <ParserTaskList />

    <div class="flex justify-between">
      <Button
          type="button"
          label="Закрыть"
          @click="fssp.importDialogVisible = false"
      ></Button>
    </div>
  </Dialog>
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
          <TopBarLayoutControls />
          <div class="ml-2">
            <SplitButton
                @click="msudrfSudDeloStartOne"
                label="Судебное делопроизводство"
                :model="sudDeloButtonItems"
                class="h-[40px] mx-4"
            />
            <Button
                @click="msudrfTerrPodsStart"
                label="Территориальная подсудность"
                class="h-[40px] mx-4"
            />
            <Button
                @click="fssp.importDialogVisible = true"
                label="ФССП"
                class="h-[40px] mx-4"
            />
            <Button
                @click="bag.parserTasksDialogVisible = true"
                label="Задачи"
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
