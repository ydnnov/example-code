<script setup lang="ts">
import { socket } from '~/socket-io.js';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import { useEventBusStore } from '~/stores/event-bus.store.js';

const eventBusStore = useEventBusStore();
const toast = useToast();

const send = () => {
  if (!eventBusStore.form.eventName.length) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please, enter event name',
      life: 5000,
    });
    return;
  }
  socket.emit(eventBusStore.form.eventName, eventBusStore.form.payload);
  toast.add({
    severity: 'secondary',
    summary: eventBusStore.form.eventName,
    detail: eventBusStore.form.payload,
    life: 1000,
  });
};
</script>

<template>
  <div class="mx-[10px] my-[5px]">
    <div class="my-[5px] text-lg">
      Events
    </div>
    <div class="mb-[10px]">
      <div>
        <InputText
            class="w-full"
            v-model="eventBusStore.form.eventName"
        />
      </div>
      <div>
        <Textarea
            class="block w-full mt-[10px]"
            v-model="eventBusStore.form.payload"
        />
      </div>
      <div class="w-full my-[10px]">
        <Button @click="send">send</Button>
      </div>
    </div>
    <table class="w-full">
      <tr
          class="border-t-[1px] last:border-b-[1px]"
      >
        <th class="border-l-[1px] px-2 w-[25%]">eventName</th>
        <th class="border-x-[1px] px-2">payload</th>
        <th class="border-x-[1px] w-[35px]">
          <Button
              @click="eventBusStore.events.splice(0)"
              icon="pi pi-times"
              severity="danger"
              class="w-[30px] h-[30px]"
          />
        </th>
      </tr>
      <tr
          class="border-t-[1px] last:border-b-[1px]"
          v-for="(event, i) in eventBusStore.events.slice().reverse()"
          :key="i"
      >
        <td class="border-l-[1px] px-2 w-[25%]">{{ event.eventName }}</td>
        <td class="border-x-[1px] px-2">{{ event.payload }}</td>
        <td class="border-x-[1px] w-[35px] text-center">
          <Button
              @click="eventBusStore.events.splice(eventBusStore.events.length - i - 1, 1)"
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
