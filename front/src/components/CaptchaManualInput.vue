<script setup lang="ts">
import { socket } from '~/socket-io.js';

const emit = defineEmits(['image-received']);

const imageBase64 = ref<string>('');
const answer = ref<string>('');

socket.on('captcha:create-answer-request:success', (mgr, captchaRequestAnswer) => {
  imageBase64.value = captchaRequestAnswer.image.base64;
});

const sendCaptchaAnswer = () => {
  socket.emit('captcha:answer-received', answer.value);
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