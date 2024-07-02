<script setup lang="ts">
import { ref, computed } from 'vue';
import { bus } from 'boot/bus.js';
import {
  fasPause as pauseIcon,
  fasPlay as playIcon,
  fasForwardStep as stepIcon,
  fasArrowRotateLeft as restartIcon,
  fasCloudArrowDown as loadRucaptchaIcon,
} from '@quasar/extras/fontawesome-v6';

const paused = ref(false);
const sendPause = () => {
  paused.value = true;
  bus.emit('parsing.pause');
};
const sendPlay = () => {
  paused.value = false;
  bus.emit('parsing.play');
};
const sendStep = () => {
  bus.emit('parsing.step');
};
const sendRestart = () => {
  bus.emit('parsing.restart');
};
const sendLoadFromRuCaptchaCom = () => {
  bus.emit('parsing.load-from-rucaptcha');
};
</script>

<template>
  <div class="flex items-center my-[10px]">
    <div class="mr-[25px]">
      Parsing:
    </div>
    <div class="">
      <q-btn
        @click="sendPause()"
        color="primary"
        round
        :icon="pauseIcon"
        class="text-[10px]"
        v-if="true"
      />
      <q-btn
        @click="sendPlay()"
        color="primary"
        round
        :icon="playIcon"
        class="ml-[15px] text-[10px]"
        v-if="true"
      />
      <q-btn
        @click="sendStep()"
        color="primary"
        round
        :icon="stepIcon"
        class="ml-[15px] text-[10px]"
      />
      <q-btn
        @click="sendRestart()"
        color="primary"
        round
        :icon="restartIcon"
        class="ml-[15px] text-[10px]"
      />
      <q-btn
        @click="sendLoadFromRuCaptchaCom()"
        color="primary"
        round
        :icon="loadRucaptchaIcon"
        class="ml-[15px] text-[10px]"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
