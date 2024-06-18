<script setup async lang="ts">
import useClient from '~/composables/useClient.js';

const toast = useToast();
const client = useClient();

const parserTasks = ref([]);
const tasksTotal = ref(0);
const perPage = ref(10);
const pageNum = ref(0);

const updateData = async () => {
  const result = await client.parserTask.getMany(
      perPage.value,
      pageNum.value * perPage.value,
  );
  if (result.success) {
    parserTasks.value = result.items;
    tasksTotal.value = result.total;
  }
};

const onPageChange = (ev) => {
  pageNum.value = ev.page;
  updateData();
};

const isDetailsVisible = ref(false);
const showingDetailsForId = ref(0);
const currentDetails = computed(() => {
  const item = parserTasks.value.find(
      x => x.id === showingDetailsForId.value,
  );
  if (item && item.result_data) {
    return item.result_data;
  }
  return 'Нет данных';
});
const showDetails = ({ data }) => {
  isDetailsVisible.value = true;
  showingDetailsForId.value = data.id;
};
const hideDetails = () => {
  isDetailsVisible.value = false;
  showingDetailsForId.value = 0;
};

onMounted(async () => {
  updateData();
});

const requestReparse = async (id: number) => {
  toast.add({
    summary: id,
  });
};
</script>

<template>
  <div>
    <Dialog
        v-model:visible="isDetailsVisible"
        modal
        dismissable-mask
        header="Результат"
        :style="{ width: 'calc(100% - 300px)' }"
    >
      <div class="flex flex-col justify-between">
        <div>
          <pre>{{ currentDetails }}</pre>
        </div>
        <div class="mt-[20px]">
          <Button
              type="button"
              label="Закрыть"
              @click="hideDetails"
          ></Button>
        </div>
      </div>
    </Dialog>
    <Button @click="updateData">Обновить</Button>
    <DataTable
        :value="parserTasks"
        paginator
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        :rows="perPage"
        :rowsPerPageOptions="[5, 10, 20, 50, 100, 200]"
        :totalRecords="tasksTotal"
        striped-rows
        lazy
        scrollable
        scroll-height="flex"
        @page="onPageChange"
        @row-click="showDetails"
    >
      <Column field="id" header="ID"></Column>
      <Column field="parser_name" header="Парсер"></Column>
      <Column field="status" header="Статус"></Column>
      <Column field="input_data" header="Данные запроса"></Column>
      <Column header="Действия"
              style="width: 200px"
      >
        <template #body="{data}">
          <Button @click="requestReparse(data.id)">Перепарсить</Button>
          <!--
                  <div :style="data['eventName'].includes('.error.') ? 'color: red' : ''">
                    {{ data['eventName'] }}
                  </div>
          -->
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">

</style>