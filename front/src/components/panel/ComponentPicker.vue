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
const components = ref([
  ['empty', emptyIcon],
  ['splitter', splitterIcon],
  ['code-exec', codeExecIcon],
  ['event-bus', eventBusIcon],
  ['headless', headlessIcon],
]);
</script>

<template>
  <div>
    <q-btn
      :icon="c[1]"
      size="10px"
      round
      @click="componentClicked(c[0])"
      v-for="c in components"
      :key="c[0]"
    ></q-btn>
  </div>
</template>

<style scoped lang="scss">

</style>
