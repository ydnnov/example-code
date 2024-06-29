<script setup lang="ts">
import { ref } from 'vue';
// import CodeExec from 'components/code-exec/CodeExec.vue';
import PanelComponent from 'components/panel/PanelComponent.vue';

defineOptions({
  name: 'IndexPage',
});

// const mainSplitterModel = ref(50);

</script>

<template>
  <q-page>
    <div class="h-[calc(100vh-50px)]">
      <PanelComponent :id="1" />
    </div>
  </q-page>
</template>
