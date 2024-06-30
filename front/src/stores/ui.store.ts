import { defineStore } from 'pinia';
import { computed, reactive, ref, unref } from 'vue';
import { UiPanelType, UiPanelTypeNameType } from 'src/schemas/ui-panel.schema.js';

const RESET_PANELS: { [id: number]: UiPanelType } = {
  1: {
    id: 1,
    type: 'splitter',
    horizontal: true,
    position: 50,
    children: [2, 3],
    isRoot: true,
  },
  2: {
    id: 2,
    type: 'splitter',
    horizontal: false,
    position: 50,
    children: [4, 5],
  },
  3: {
    id: 3,
    type: 'splitter',
    horizontal: false,
    position: 50,
    children: [6, 7],
  },
  4: {
    id: 4,
    type: 'code-exec',
  },
  5: {
    id: 5,
    type: 'headless',
  },
  6: {
    id: 6,
    type: 'event-bus',
  },
  7: {
    id: 7,
    type: 'empty',
  },
};

export const useUiStore = defineStore('ui', () => {

  const panels = reactive<{ [id: number]: UiPanelType }>(RESET_PANELS);

  const sidebar = reactive({
    visible: true,
    width: 25,
    panelTreeHeight: 35,
  });

  const nextPanelId = computed(() => {
    const keys = Object.keys(panels);
    if (!keys.length) {
      return 1;
    }
    const result = Number(keys[keys.length - 1]) + 1;
    return result;
  });

  const panelsTree = computed(() => {
    const result = JSON.parse(JSON.stringify(panels));
    const ids = Object.keys(result);
    for (let i = 0; i < ids.length; i++) {
      const panel = result[ids[i]];
      if (panel.type === 'splitter') {
        panel.children = [
          result[panel.children[0]],
          result[panel.children[1]],
        ];
      } else {
        panel.children = [];
      }
    }
    return result[1];
  });

  const wrapInSplitter = (id: number) => {
    const oldPanel = panels[id];
    if (oldPanel.type === 'splitter') {
      return;
    }
    const keys = Object.keys(oldPanel);
    const newPanel = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key === 'id') {
        continue;
      }
      newPanel[key] = oldPanel[key];
      delete oldPanel[key];
    }
    newPanel['id'] = unref(nextPanelId);
    panels[newPanel['id']] = newPanel;
    oldPanel.type = 'splitter';
    oldPanel['horizontal'] = false;
    oldPanel['position'] = 50;
    const emptyPanel = {
      id: unref(nextPanelId),
      type: 'empty',
    };
    panels[emptyPanel['id']] = emptyPanel;
    oldPanel['children'] = [newPanel['id'], emptyPanel['id']];
  };

  const findEmptyChild = (id: number) => {
    const panel = panels[id];
    if (panel.type !== 'splitter') {
      throw new Error(`Panel id=${id} is not a splitter`);
    }
    for (let i = 0; i < 2; i++) {
      const child = panels[panel.children[i]];
      if (child.type === 'empty') {
        return child;
      }
    }
    return null;
  };

  const findNonEmptyChild = (id: number) => {
    const panel = panels[id];
    if (panel.type !== 'splitter') {
      throw new Error(`Panel id=${id} is not a splitter`);
    }
    for (let i = 0; i < 2; i++) {
      const child = panels[panel.children[i]];
      if (child.type !== 'empty') {
        return child;
      }
    }
    return null;
  };

  const unwrapSplitter = (id: number) => {
    if (!findEmptyChild(id)) {
      return;
    }
    const panel = panels[id];
    const childrenIds = [panel.children[0], panel.children[1]];
    const nonEmptyChild = findNonEmptyChild(id);

    const newPanel = {
      id,
      type: 'empty',
    };

    if (nonEmptyChild) {
      const keys = Object.keys(nonEmptyChild);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key === 'id') {
          continue;
        }
        newPanel[key] = nonEmptyChild[key];
      }
    }

    panels[newPanel.id] = newPanel;
    delete panels[childrenIds[0]];
    delete panels[childrenIds[1]];
  };

  const leafPanelTypes = [
    'code-exec',
    'event-bus',
    'headless',
    'empty',
  ];

  const setPanel = (id: number, type: UiPanelTypeNameType) => {
    const panel = panels[id];
    if (panel.type === type) {
      return;
    }
    if (type === 'splitter') {
      wrapInSplitter(id);
    } else if (leafPanelTypes.includes(type)) {
      if (panel.type === 'splitter') {
        unwrapSplitter(id);
      } else {
        panels[id] = {
          id,
          type,
        };
      }
    }
  };

  // const canSetPanelType = (id: number, type: UiPanelTypeNameType) => {
  // };

  return {
    panels,
    panelsTree,
    nextPanelId,
    setPanel,
    sidebar,
    // canSetPanelType,
    // wrapInSplitter,
    // unwrapSplitter,
  };
}, {
  // persist: false,
  persist: {
    paths: ['panels', 'sidebar'],
  },
});
