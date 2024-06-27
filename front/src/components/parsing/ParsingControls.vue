<script setup lang="ts">
import { bus } from '~/bus.js';

const parsingInProgress = ref(true);

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
  <div class="flex items-center my-[10px]">
    <div class="mr-[25px]">
      Parsing:
    </div>
    <div class="w-full">
      <Button
          @click="sendPause()"
          icon="pi pi-pause"
          v-if="true"
      >
      </Button>
      <Button
          @click="sendPlay()"
          icon="pi pi-play"
          class="ml-[15px]"
          v-if="true"
      >
      </Button>
      <Button
          @click="sendStep()"
          icon="pi pi-step-forward"
          class="ml-[15px]"
      >
      </Button>
      <!--        <div v-if="parsingInProgress">in progress</div>-->
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>