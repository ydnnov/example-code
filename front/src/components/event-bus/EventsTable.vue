<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { useEventBusStore } from 'src/stores/event-bus.store.js';

const eventBusStore = useEventBusStore();
const columns = ref([
  {
    label: 'id',
    field: 'id',
  },
  {
    label: 'eventName',
    field: 'eventName',
  },
  {
    label: 'payload',
    field: 'payload',
  },
  {
    label: 'from',
    field: row => row.app.name,
  },
  {
    label: 'createdAt',
    field: 'createdAt',
  },
]);
</script>

<template>
  <div class="flex-grow relative">
    <div class="absolute inset-0">
      <q-btn
        @click="eventBusStore.events.splice(0)"
        label="clear"
        color="red"
        class="absolute z-[999] right-[5px] h-[35px] top-[-50px] text-[10px]"
      />

      <q-table
        :rows="eventBusStore.events.slice().reverse()"
        :columns="columns"
        row-key="id"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
