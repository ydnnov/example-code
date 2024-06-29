<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { useQuasar } from 'quasar';
import { useUiStore } from 'stores/ui.store.js';
import PanelTreeNode from 'components/panel/PanelTreeNode.vue';

const $q = useQuasar();
const ui = useUiStore();

const expanded = ref([]);

const go = () => {
  // $q.notify({
  //   message: JSON.stringify(ids),
  //   classes: 'text-[24px]',
  // });
};
</script>

<template>
  <q-tree
    :nodes="[ui.panelsTree]"
    node-key="id"
    label-key="type"
    v-model:expanded="expanded"
    default-expand-all
    class="text-[20px]"
  >
    <template #default-header="{node}">
      <div v-if="node.type === 'splitter'">
        {{ node.type }} [{{ node.id }}], {{ node.horizontal ? 'horizontal' : 'vertical' }}, at {{ node.position }}%
      </div>
      <div v-else>
        {{ node.type }} [{{ node.id }}]
      </div>
    </template>
  </q-tree>
  <!--
    <div
      class="w-full h-full text-[20px] px-[0px] py-[0px] border-[3px] border-[#999]"
    >
      <PanelTreeNode :node="panelsTree[1]" :level="1" />
    </div>
  -->
</template>

<style scoped lang="scss">

</style>
