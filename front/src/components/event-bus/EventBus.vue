<script setup lang="ts">
import { bus } from '~/bus.js';
import EventsTable from '~/components/event-bus/EventsTable.vue';
import EventSendForm from '~/components/event-bus/EventSendForm.vue';

const parsingInProgress = ref(true);
const { $request } = useClient();

const sendRerun = () => {
  // bus.emit('parsing-rerun');
  // $request.post('/restart');
  // bus.emit('parsing-resume');
};

bus.on('parsing-step-finished', () => {
  parsingInProgress.value = false;
});

const paused = ref(false);
const sendPause = () => {
  paused.value = true;
  parsingInProgress.value = true;
  bus.emit('parsing.pause');
};
const sendPlay = () => {
  paused.value = false;
  parsingInProgress.value = true;
  bus.emit('parsing.play');
};
const sendStep = () => {
  parsingInProgress.value = true;
  bus.emit('parsing.step');
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
            @click="sendPause()"
            icon="pi pi-pause"
        >
        </Button>
        <Button
            @click="sendPlay()"
            icon="pi pi-play"
            class="ml-2"
        >
        </Button>
        <Button
            @click="sendStep()"
            icon="pi pi-step-forward"
            class="ml-2"
        >
        </Button>
<!--        <div v-if="parsingInProgress">in progress</div>-->
      </div>
    </div>
    <EventSendForm />
    <EventsTable />
  </div>
</template>

<style scoped lang="scss">

</style>
