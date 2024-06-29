<script setup lang="ts">
import { computed, ref, unref } from 'vue';

const props = defineProps({
  node: <{}>{
    type: Object,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
});

const labelNestStyle = computed(() => {
  return {
    paddingLeft: (props.level * 30 - 20) + 'px',
  };
});

</script>

<template>
  <div class="w-full text-[20px]"
  >
    <div v-if="node.type === 'splitter'">
      <div
        class="w-full h-[60px] text-[20px] flex content-center align-middle px-[10px] py-[5px] border-b-[3px] border-[#999]"
        :style="labelNestStyle"
      >
        {{ node.type }} [{{ node.id }}], {{ node.horizontal ? 'horizontal' : 'vertical' }}, at {{ node.position }}%
      </div>
      <div class="pl-[0px]">
        <PanelTreeNode :node="node.childobj[0]" :level="props.level + 1" />
      </div>
      <div class="pl-[0px]">
        <PanelTreeNode :node="node.childobj[1]" :level="props.level + 1" />
      </div>
    </div>
    <div
      v-else
      class="w-full h-[60px] text-[20px] flex content-center px-[10px] py-[5px] border-b-[3px] border-[#999]"
      :style="labelNestStyle"
    >
      {{ node.type }} [{{ node.id }}]
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>
