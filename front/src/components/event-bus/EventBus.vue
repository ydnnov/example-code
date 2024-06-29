<script setup lang="ts">
import EventsTable from './EventsTable.vue';
import EventSendForm from './EventSendForm.vue';
import ParsingControls from '../parsing/ParsingControls.vue';
</script>

<template>
  <div class="absolute flex flex-col inset-0 pl-[15px]">
    <div class="my-[5px] text-lg">
      Events
    </div>
    <div class="mb-[10px]">
      <ParsingControls />
    </div>
    <EventSendForm />
    <EventsTable />
  </div>
</template>

<style scoped lang="scss">

</style>
