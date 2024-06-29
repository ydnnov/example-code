<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { useUiStore } from 'stores/ui.store.js';
import { useQuasar } from 'quasar';
import { UiPanelType, UiPanelTypeNameType } from 'src/schemas/ui-panel.schema.js';
import {
  fasTableColumns as splitterIcon,
  fasCode as codeExecIcon,
  fasListUl as eventBusIcon,
  fabChrome as headlessIcon,
  farFile as emptyIcon,
} from '@quasar/extras/fontawesome-v6';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
const $q = useQuasar();
const ui = useUiStore();

const panel = computed<UiPanelType>(() => ui.panels[props.id]);

const componentClicked = (key: UiPanelTypeNameType) => {
  if (panel.value.type === key) {
    $q.notify({
      message: `same component "${key}"`,
      classes: 'text-[24px]',
    });
    return;
  }
  ui.setPanel(props.id, key);
};
</script>

<template>
  <div>
    <q-btn :icon="emptyIcon" round @click="componentClicked('empty')"></q-btn>
    <q-btn :icon="splitterIcon" round @click="componentClicked('splitter')"></q-btn>
    <q-btn :icon="codeExecIcon" round @click="componentClicked('code-exec')"></q-btn>
    <q-btn :icon="eventBusIcon" round @click="componentClicked('event-bus')"></q-btn>
    <q-btn :icon="headlessIcon" round @click="componentClicked('headless')"></q-btn>
  </div>
</template>

<style scoped lang="scss">

</style>
