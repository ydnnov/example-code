<script setup lang="ts">
import PanelComponent from 'components/panel/PanelComponent.vue';
import PanelTree from 'components/panel/PanelTree.vue';

defineOptions({
  name: 'IndexPage',
});
</script>

<template>
  <div class="relative w-[100vw] h-[100vh]">
    <div class="absolute inset-y-0 left-0 w-[270px]">
      <PanelTree />
    </div>
    <div class="absolute inset-y-0 left-[270px] right-[0px] border-l-[3px] border-[#bbb]">
      <PanelComponent :id="1" />
    </div>
  </div>
  <!--
    <div class="w-[100vw] h-[100vh]">
      <PanelComponent :id="1" />
    </div>
  -->
</template>
