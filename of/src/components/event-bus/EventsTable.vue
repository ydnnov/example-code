<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useEventBusStore } from '~/stores/event-bus.store.js';
import useClient from '~/composables/useClient.js';
import Button from 'primevue/button';

const eventBusStore = useEventBusStore();
const toast = useToast();
const client = useClient();

</script>

<template>
  <div class="flex-grow relative">
    <div class="absolute inset-0">
      <Button
          @click="eventBusStore.events.splice(0)"
          label="clear"
          severity="danger"
          class="absolute z-[999] right-[30px] h-[40px]"
      />
      <DataTable
          :value="eventBusStore.events.slice().reverse()"
          paginator
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          :rows="50"
          :rowsPerPageOptions="[5, 10, 20, 50, 100, 200]"
          scrollable
          scroll-height="flex"
      >
        <Column field="eventName"
                header="Event"
                style="width: 35%"
        >
          <template #body="{data}">
            <div :style="data['eventName'].includes('.error.') ? 'color: red' : ''">
              {{ data['eventName'] }}
            </div>
          </template>
        </Column>
        <Column field="payload" header="Payload"></Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
