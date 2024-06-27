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
