<script setup lang="ts">
import { useEventBusStore } from 'stores/event-bus.store.js';
import { useQuasar } from 'quasar';
import client from 'src/client/client.js';
import { bus } from 'boot/bus.js';

const $q = useQuasar();

const eventBusStore = useEventBusStore();

const send = (side: 'front' | 'back') => {
  if (!eventBusStore.form.eventName.length) {
    $q.notify({
      message: `Empty event name`,
      classes: 'text-[24px]',
    });
    return;
  }

  if (side === 'back') {
    client.eventBus.emit(eventBusStore.form.eventName, eventBusStore.form.payload);
  } else if (side === 'front') {
    bus.emit(eventBusStore.form.eventName, eventBusStore.form.payload);
  } else {
    console.log(`Wrong side: "${side}"`);
  }
};
</script>

<template>
  <div class="mb-[10px]">
    <div>
      <q-input v-model="eventBusStore.form.eventName" label="Event name" />
    </div>
    <div class="mt-[10px]">
      <q-input
        class="block w-full"
        autogrow
        v-model="eventBusStore.form.payload"
        type="textarea"
        label="Event payload"
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
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
