<script setup lang="ts">
import { ref, computed } from 'vue';
import { UiPanelType, useUiStore } from 'stores/ui.store.js';
import CodeExec from 'components/code-exec/CodeExec.vue';
import EventBus from 'components/event-bus/EventBus.vue';

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
    <!--    <div class="absolute right-0">{{ panel }}</div>-->
    <!--
        <hr class="h-[20px] mb-[20px] border-b-[3px] border-red-500" />
        {{ props.id }}
        <hr class="h-[20px] mb-[20px] border-b-[3px] border-red-500" />
        {{ ui.panels }}
    -->
    <div v-if="panel.type === 'splitter'"
         class="h-full"
    >
      <q-splitter
        v-model="panel.position"
        :horizontal="panel.horizontal"
        class="h-full"
      >
        <template v-slot:before>
          <PanelComponent :id="panel.children[panel.swapped ? 1 : 0]" />
        </template>
        <template v-slot:after>
          <PanelComponent :id="panel.children[panel.swapped ? 0 : 1]" />
        </template>
      </q-splitter>
    </div>
    <div v-else-if="panel.type==='code-exec'">
<!--      <KeepAlive>-->
        <CodeExec />
<!--      </KeepAlive>-->
    </div>
    <div v-else-if="panel.type==='event-bus'">
      <EventBus />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
