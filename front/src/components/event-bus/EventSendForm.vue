<script setup lang="ts">
import { bus } from '../../bus.js';
import { useEventBusStore } from 'stores/event-bus.store.js';
// import useClient from 'composables/useClient.js';

const eventBusStore = useEventBusStore();
// const toast = useToast();
// const client = useClient();

const send = (side: 'front' | 'back') => {
  // if (!eventBusStore.form.eventName.length) {
  //   toast.add({
  //     severity: 'error',
  //     summary: 'Error',
  //     detail: 'Please, enter event name',
  //     life: 3000,
  //   });
  //   return;
  // }
  //
  // if (side === 'back') {
  //   client.eventBus.emit(eventBusStore.form.eventName, eventBusStore.form.payload);
  // } else if (side === 'front') {
  //   bus.emit(eventBusStore.form.eventName, eventBusStore.form.payload);
  // } else {
  //   console.log(`Wrong side: "${side}"`);
  // }
};
</script>

<template>
  <div class="mb-[10px]">
    <div>
      Event name:
      <q-input v-model="eventBusStore.form.eventName" label="Standard" />
<!--
      <InputText
          class="w-full"
          v-model="eventBusStore.form.eventName"
      />
-->
    </div>
    <div class="mt-[10px]">
      Event payload:
      <q-input
            class="block w-full"
            v-model="eventBusStore.form.payload"
            type="textarea"
        />
    </div>
    <div class="w-full my-[10px]">
      <q-btn
        color="primary"
        label="send front"
        @click="send('front')"
      />
      <q-btn
        color="primary"
        label="send back"
        @click="send('back')"
      />
<!--
      <Button
          @click="send('front')"
          label="send front"
      >Send to front
      </Button>
      <Button
          class="ml-2"
          @click="send('back')"
          label="send back"
      >Send to back
      </Button>
-->
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
