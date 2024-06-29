<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { useQuasar } from 'quasar';
import { useUiStore } from 'stores/ui.store.js';

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
    class="text-[14px]"
  >
    <template #default-header="{node}">
      <div v-if="node.type === 'splitter'">
        {{ node.type }} [{{ node.id }}],
        {{ node.horizontal ? 'horizontal' : 'vertical' }},
        at {{ Math.round(node.position) }}%
      </div>
      <div v-else>
        {{ node.type }} [{{ node.id }}]
      </div>
    </template>
  </q-tree>
</template>

<style scoped lang="scss">

</style>
