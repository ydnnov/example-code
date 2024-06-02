<script setup lang="ts">
import useClient from '~/composables/useClient.js';

const client = useClient();

const searchText = ref<string>('');

const run = async () => {
  const result = await client.parser.run('msudrf/sud-delo', {
    searchText: searchText.value,
  });
  console.log({ result });
};
</script>

<template>
  <div class="mx-4 my-4">
    <InputText type="text" v-model="searchText" class="mr-2" />
    <Button @click="run" label="Run" />
  </div>
</template>

<style scoped lang="scss">

</style>