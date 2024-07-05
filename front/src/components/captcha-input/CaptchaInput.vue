<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { bus } from 'boot/bus.js';
import type { AppEvent } from 'src/shared/classes/app-event.js';

const emit = defineEmits(['image-received']);

const imageBase64 = ref<string>('');
const answer = ref<string>('');

bus.on('captcha.create-answer-request.success', (appEvent: AppEvent<any>) => {
  imageBase64.value = appEvent.payload.ansreqEnt.image.base64;
});

const sendCaptchaAnswer = () => {
  bus.emit('captcha.provide-answer', answer.value);
};
const requestRucaptchaComAnswer = () => {
  bus.emit('captcha.request-rucaptcha', answer.value);
};
</script>

<template>
  <div
    class="px-[10px] py-[10px]"
    v-if="imageBase64.length > 0 || true"
  >
    <img
      :src="imageBase64"
      alt="Captcha image"
      class="w-[100px] h-[50px] mb-[10px]"
      @keyup.enter="sendCaptchaAnswer"
    />
    <q-input
      outlined
      dense
      type="text"
      v-model="answer"
      class="h-[40px]"
    />
    <q-btn
      label="Отправить"
      color="primary"
      class="mt-[12px] mb-[10px]"
      @click="sendCaptchaAnswer"
    />
    <q-btn
      label="Rucaptcha"
      color="primary"
      class="mt-[12px] mb-[10px] ml-[20px]"
      @click="requestRucaptchaComAnswer"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
