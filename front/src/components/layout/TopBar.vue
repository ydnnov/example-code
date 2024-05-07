<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import { useUserStore } from '~/stores/user.store.js';

const { user } = useUserStore();
const { ui } = useUiStore();

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
  },
  // {
  //   label: 'Features',
  //   icon: 'pi pi-star'
  // },
  // {
  //   label: 'Projects',
  //   icon: 'pi pi-search',
  //   items: [
  //     {
  //       label: 'Core',
  //       icon: 'pi pi-bolt',
  //       shortcut: '⌘+S'
  //     },
  //     {
  //       label: 'Blocks',
  //       icon: 'pi pi-server',
  //       shortcut: '⌘+B'
  //     },
  //     {
  //       label: 'UI Kit',
  //       icon: 'pi pi-pencil',
  //       shortcut: '⌘+U'
  //     },
  //     {
  //       separator: true
  //     },
  //     {
  //       label: 'Templates',
  //       icon: 'pi pi-palette',
  //       items: [
  //         {
  //           label: 'Apollo',
  //           icon: 'pi pi-palette',
  //           badge: 2
  //         },
  //         {
  //           label: 'Ultima',
  //           icon: 'pi pi-palette',
  //           badge: 3
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   label: 'Contact',
  //   icon: 'pi pi-envelope',
  //   badge: 3
  // }
]);
</script>

<template>
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
            <Button
                @click="ui.mainSplitter.panels[1] = 'msudrf-sud-delo'"
                icon="pi pi-microchip"
                class="w-[40px] h-[40px] ml-4"
            />
          </div>
          <div class="ml-2 mr-10 border-l-[3px] border-black-500">
            <Button
                @click=""
                icon="pi pi-asterisk"
                class="w-[40px] h-[40px] ml-4"
            />
            <Button
                @click=""
                icon="pi pi-asterisk"
                class="w-[40px] h-[40px] ml-2"
            />
          </div>

          <InputText placeholder="Search" type="text" class="" />

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
