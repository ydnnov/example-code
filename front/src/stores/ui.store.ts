import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { Static, Type } from '@sinclair/typebox';

export const uiPanelSplitterSchema = Type.Object({
  type: Type.Literal('splitter'),
  swapped: Type.Boolean(),
  horizontal: Type.Boolean(),
  position: Type.Number(),
  children: Type.Object({
    0: Type.Number(),
    1: Type.Number(),
  }),
});

export const uiPanelCodeExecSchema = Type.Object({
  type: Type.Literal('code-exec'),
});

export const uiPanelEventBusSchema = Type.Object({
  type: Type.Literal('event-bus'),
});

export const uiPanelHeadlessSchema = Type.Object({
  type: Type.Literal('headless'),
});

export const anyPanelSchema = Type.Union([
  uiPanelSplitterSchema,
  uiPanelCodeExecSchema,
  uiPanelEventBusSchema,
  uiPanelHeadlessSchema,
]);

export const uiPanelSchema = Type.Intersect([
  anyPanelSchema,
  Type.Object({
    id: Type.Number(),
  }),
]);

export type UiPanelType = Static<typeof uiPanelSchema>

export const useUiStore = defineStore('ui', () => {

  const panels = reactive<{ [id: number]: UiPanelType }>({
    1: {
      id: 1,
      type: 'splitter',
      swapped: false,
      horizontal: true,
      position: 50,
      children: [2, 3],
    },
    2: {
      id: 2,
      type: 'event-bus',
    },
    3: {
      id: 3,
      type: 'splitter',
      swapped: false,
      horizontal: false,
      position: 50,
      children: [4, 5],
    },
    4: {
      id: 4,
      type: 'code-exec',
    },
    5: {
      id: 5,
      type: 'headless',
    },
  });

  return { panels };
}, {
  persist: false,
});
