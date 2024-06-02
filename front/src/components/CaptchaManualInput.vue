<script setup lang="ts">
import { bus } from '~/bus.js';
import type { AppEvent } from '~/shared/classes/app-event.js';

const emit = defineEmits(['image-received']);

const imageBase64 = ref<string>('');
const answer = ref<string>('');

bus.on('captcha:create-answer-request:success', (appEvent: AppEvent<any>) => {
  imageBase64.value = appEvent.payload.ansreqEnt.image.base64;
});

const sendCaptchaAnswer = () => {
  bus.emit('captcha.answer-received', answer.value);
};
</script>

<template>
  <div class="flex"
       v-if="imageBase64.length > 0 || true"
  >
    <img :src="imageBase64" />
    <div class="flex flex-col mx-[12px]">
      <InputText type="text" v-model="answer" class="h-[40px]" />
      <Button
          label="Отправить"
          class="mt-[12px]"
          @click="sendCaptchaAnswer" />
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>