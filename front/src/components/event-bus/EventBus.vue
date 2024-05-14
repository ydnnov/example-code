<script setup lang="ts">
import { useEventsStore } from '~/stores/events.store.js';
import Button from 'primevue/button';

const eventsStore = useEventsStore();
</script>

<template>
  <div class="mx-[10px] my-[5px]">
    <div class="my-[5px] text-lg">
      Events
    </div>
    <table class="w-full">
      <tr
          class="border-t-[1px] last:border-b-[1px]"
      >
        <th class="border-l-[1px] px-2 w-[25%]">eventName</th>
        <th class="border-x-[1px] px-2">payload</th>
        <th class="border-x-[1px] w-[35px]"></th>
      </tr>
      <tr
          class="border-t-[1px] last:border-b-[1px]"
          v-for="(event, i) in eventsStore.events.slice().reverse()"
          :key="i"
      >
        <td class="border-l-[1px] px-2 w-[25%]">{{ event.eventName }}</td>
        <td class="border-x-[1px] px-2">{{ event.payload }}</td>
        <td class="border-x-[1px] w-[35px] text-center">
          <Button
              @click="eventsStore.events.splice(eventsStore.events.length - i - 1, 1)"
              icon="pi pi-times"
              severity="danger"
              class="w-[30px] h-[30px]"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped lang="scss">

</style>
