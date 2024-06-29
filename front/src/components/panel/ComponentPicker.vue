<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { useUiStore } from 'stores/ui.store.js';
import { useQuasar } from 'quasar';
import { UiPanelType, UiPanelTypeNameType } from 'src/schemas/ui-panel.schema.js';
import {
  fasTableColumns as splitterIcon,
  fasCode as codeExecIcon,
  fasListUl as eventBusIcon,
  fabChrome as headlessIcon,
  farFile as emptyIcon,
} from '@quasar/extras/fontawesome-v6';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
const $q = useQuasar();
const ui = useUiStore();

const panel = computed<UiPanelType>(() => ui.panels[props.id]);

const componentClicked = (key: UiPanelTypeNameType) => {
  if (panel.value.type === key) {
    $q.notify({
      message: `same component "${key}"`,
      classes: 'text-[24px]',
    });
    return;
  }
  ui.setPanel(props.id, key);
};
</script>

<template>
  <q-btn :icon="emptyIcon"    @click="componentClicked('empty')"></q-btn>
  <q-btn :icon="splitterIcon" @click="componentClicked('splitter')"></q-btn>
  <q-btn :icon="codeExecIcon" @click="componentClicked('code-exec')"></q-btn>
  <q-btn :icon="eventBusIcon" @click="componentClicked('event-bus')"></q-btn>
  <q-btn :icon="headlessIcon" @click="componentClicked('headless')"></q-btn>

  <!--
    <q-btn-dropdown stretch flat :label="panel.type">
      <q-list>
        <q-item-label header>Components</q-item-label>
        <q-item
          v-for="c in allComponents"
          :key="c.key"
          clickable
          v-close-popup
          tabindex="0"
          @click="componentClicked(c.key)"
        >
          <q-item-section avatar>
            <q-avatar icon="folder" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ c.key }}</q-item-label>
            &lt;!&ndash;          <q-item-label caption>{{ c }}</q-item-label>&ndash;&gt;
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" />
          </q-item-section>
        </q-item>
        <q-separator inset spaced />
        <q-item-label header>Misc</q-item-label>
        <q-item
          clickable
          v-close-popup
          tabindex="0"
          @click="componentClicked(emptyComponent.key)"
        >
          <q-item-section avatar>
            <q-avatar icon="close" class="bg-[#bbb]" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>empty</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn @click="componentClicked('splitter')"
    >Wrap
    </q-btn>
  -->
</template>

<style scoped lang="scss">

</style>
