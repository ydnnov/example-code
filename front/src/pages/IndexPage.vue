<script setup lang="ts">
import PanelComponent from 'components/panel/PanelComponent.vue';

defineOptions({
  name: 'IndexPage',
});
</script>

<template>
  <div class="w-[100vw] h-[100vh]">
    <PanelComponent :id="1" />
  </div>
</template>
