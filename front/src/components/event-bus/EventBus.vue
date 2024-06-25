<script setup lang="ts">
import { bus } from '~/bus.js';
import EventsTable from '~/components/event-bus/EventsTable.vue';
import EventSendForm from '~/components/event-bus/EventSendForm.vue';

const sendRerun = () => {
  bus.emit('parsing-rerun');
};

const sendStep = () => {
  bus.emit('parsing-step');
};
</script>

<template>
  <div class="absolute flex flex-col inset-0 pl-[15px]">
    <div class="my-[5px] text-lg">
      Events
    </div>
    <div class="mb-[10px]">

      <div class="w-full my-[10px]">
        <Button
            @click="sendRerun()"
        >
          Rerun
        </Button>
        <Button
            @click="sendStep()"
            class="ml-5"
        >
          Step
        </Button>
      </div>
    </div>
    <EventSendForm />
    <EventsTable />
  </div>
</template>

<style scoped lang="scss">

</style>
