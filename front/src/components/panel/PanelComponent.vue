<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUiStore } from 'stores/ui.store.js';
import CodeExec from 'components/code-exec/CodeExec.vue';
import EventBus from 'components/event-bus/EventBus.vue';
import { UiPanelType } from 'src/schemas/ui-panel.schema.js';
import HeadlessComponent from 'components/headless/HeadlessComponent.vue';
import SplitterComponent from 'components/panel/SplitterComponent.vue';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const ui = useUiStore();

const panel = computed<UiPanelType>(() => ui.panels[props.id]);
</script>

<template>
  <div class="relative border-[0px] border-red-500 h-full">
    <div v-if="panel.type === 'empty'">
      <div>Empty panel</div>
    </div>
    <div v-else-if="panel.type === 'splitter'" class="h-full">
      <SplitterComponent :panel="ui.panels[id]" />
    </div>
    <div v-else-if="panel.type==='code-exec'">
      <CodeExec />
    </div>
    <div v-else-if="panel.type==='event-bus'">
      <EventBus />
    </div>
    <div v-else-if="panel.type==='headless'">
      <HeadlessComponent />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
