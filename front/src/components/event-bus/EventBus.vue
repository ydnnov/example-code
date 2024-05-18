<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { socket } from '~/socket-io.js';
import { useEventBusStore } from '~/stores/event-bus.store.js';
import { bus } from '~/bus.js';
import { client } from '~/client/client.js';

const eventBusStore = useEventBusStore();
const toast = useToast();

const send = (side: 'front' | 'back') => {

  if (!eventBusStore.form.eventName.length) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please, enter event name',
      life: 3000,
    });
    return;
  }

  if (side === 'back') {
    client.eventBus.emit(eventBusStore.form.eventName, eventBusStore.form.payload);
  } else if (side === 'front') {
    console.log('qwe', { side });
  } else {
    console.log('wrong side dude :-D');
  }
  // bus.emit(eventBusStore.form.eventName, eventBusStore.form.payload);
  // socket.emit(eventBusStore.form.eventName, eventBusStore.form.payload);
  toast.add({
    severity: 'secondary',
    summary: eventBusStore.form.eventName,
    detail: eventBusStore.form.payload,
    life: 3000,
  });
};
</script>

<template>
  <div class="absolute flex flex-col inset-0 pl-[15px]">
    <div class="my-[5px] text-lg">
      Events
    </div>
    <div class="mb-[10px]">
      <div>
        <InputText
            class="w-full"
            v-model="eventBusStore.form.eventName"
        />
      </div>
      <div>
        <Textarea
            class="block w-full mt-[10px]"
            v-model="eventBusStore.form.payload"
        />
      </div>
      <div class="w-full my-[10px]">
        <Button
            @click="send('front')"
            label="send front"
        >send front
        </Button>
        <Button
            class="ml-2"
            @click="send('back')"
            label="send back"
        >send back
        </Button>
      </div>
    </div>
    <div class="flex-grow relative">
      <div class="absolute inset-0">
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
          <Column field="eventName" header="Event" style="width: 35%"></Column>
          <Column field="payload" header="Payload"></Column>
        </DataTable>
        <!--
              <table class="w-full">
                <tr
                    class="border-t-[1px] last:border-b-[1px]"
                >
                  <th class="border-l-[1px] px-2 w-[25%]">eventName</th>
                  <th class="border-x-[1px] px-2">payload</th>
                  <th class="border-x-[1px] w-[35px]">
                    <Button
                        @click="eventBusStore.events.splice(0)"
                        icon="pi pi-times"
                        severity="danger"
                        class="w-[30px] h-[30px]"
                    />
                  </th>
                </tr>
                <tr
                    class="border-t-[1px] last:border-b-[1px]"
                    v-for="(event, i) in eventBusStore.events.slice().reverse()"
                    :key="i"
                >
                  <td class="border-l-[1px] px-2 w-[25%]">{{ event.eventName }}</td>
                  <td class="border-x-[1px] px-2">{{ event.payload }}</td>
                  <td class="border-x-[1px] w-[35px] text-center">
                    <Button
                        @click="eventBusStore.events.splice(eventBusStore.events.length - i - 1, 1)"
                        icon="pi pi-times"
                        severity="danger"
                        class="w-[30px] h-[30px]"
                    />
                  </td>
                </tr>
              </table>
        -->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
