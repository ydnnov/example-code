<script setup lang="ts">
import { socket } from '~/socket-io.js';

const emit = defineEmits(['image-received']);

const imageBase64 = ref<string>('');
const answer = ref<string>('');

socket.on('createAnswerRequest::success', (captchaRequestAnswer) => {
  imageBase64.value = captchaRequestAnswer.image.base64;
  console.log({ captchaRequestAnswer });
  // screenshot.value = 'data:image/png;base64, ' + data;
  // showingScreenshotIndicator.value = true;
  // setTimeout(() => {
  //   showingScreenshotIndicator.value = false;
  // }, 200);
});
</script>

<template>
  <div class="flex"
       v-if="imageBase64.length > 0 || true"
  >
    <img :src="imageBase64" />
    <div class="flex flex-col mx-[12px]">
      <InputText type="text" v-model="captchaAnswer" class="h-[40px]" />
      <Button label="Отправить" class="mt-[12px]"/>
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>