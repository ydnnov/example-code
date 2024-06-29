<script setup lang="ts">
import { computed, ref } from 'vue';
import { UiPanelType, useUiStore } from 'stores/ui.store.js';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
const ui = useUiStore();

const panel = computed<UiPanelType>(() => ui.panels[props.id]);

const allComponents = ref([
  {
    key: 'splitter',
  },
  {
    key: 'code-exec',
  },
  {
    key: 'event-bus',
  },
  {
    key: 'headless',
  },
]);
const clicked = (key: string) => {
  console.log({ panel, key });
};
</script>

<template>
  {{ panel }}
  <q-btn-dropdown stretch flat label="Dropdown">
    <q-list>
      <q-item-label header>Components</q-item-label>
      <q-item
        v-for="c in allComponents"
        :key="c.key"
        clickable
        v-close-popup
        tabindex="0"
        @click="clicked(c.key)"
      >
        <q-item-section avatar>
          <q-avatar icon="folder" color="secondary" text-color="white" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ c.key }}</q-item-label>
          <q-item-label caption>{{ c }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="info" />
        </q-item-section>
      </q-item>
      <q-separator inset spaced />
      <q-item-label header>Files</q-item-label>
      <q-item clickable v-close-popup tabindex="0">
        <q-item-section avatar>
          <q-avatar icon="close" color="red" text-color="white" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Close</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="info" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<style scoped lang="scss">

</style>
