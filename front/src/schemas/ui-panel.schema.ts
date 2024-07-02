import { Static, Type } from '@sinclair/typebox';

export const UIP_EMPTY = 'empty';
export const UIP_SPLITTER = 'splitter';
export const UIP_CODE_EXEC = 'code-exec';
export const UIP_EVENT_BUS = 'event-bus';
export const UIP_HEADLESS = 'headless';
export const UIP_CAPTCHA = 'captcha';

export const uiPanelEmptySchema = Type.Object({
  type: Type.Literal(UIP_EMPTY),
});
export type UiPanelEmptyType = Static<typeof uiPanelEmptySchema>

export const uiPanelSplitterSchema = Type.Object({
  type: Type.Literal(UIP_SPLITTER),
  horizontal: Type.Boolean(),
  position: Type.Number(),
  children: Type.Object({
    0: Type.Number(),
    1: Type.Number(),
  }),
  isRoot: Type.Optional(Type.Boolean()),
});
export type UiPanelSplitterType = Static<typeof uiPanelSplitterSchema>

export const uiPanelCodeExecSchema = Type.Object({
  type: Type.Literal(UIP_CODE_EXEC),
});

export const uiPanelEventBusSchema = Type.Object({
  type: Type.Literal(UIP_EVENT_BUS),
});

export const uiPanelHeadlessSchema = Type.Object({
  type: Type.Literal(UIP_HEADLESS),
});

export const uiPanelCaptchaSchema = Type.Object({
  type: Type.Literal(UIP_CAPTCHA),
});

export const uiPanelTypeNameSchema = Type.Union([
  Type.Literal(UIP_EMPTY),
  Type.Literal(UIP_SPLITTER),
  Type.Literal(UIP_CODE_EXEC),
  Type.Literal(UIP_EVENT_BUS),
  Type.Literal(UIP_HEADLESS),
  Type.Literal(UIP_CAPTCHA),
]);
export type UiPanelTypeNameType = Static<typeof uiPanelTypeNameSchema>

export const anyPanelSchema = Type.Union([
  uiPanelEmptySchema,
  uiPanelSplitterSchema,
  uiPanelCodeExecSchema,
  uiPanelEventBusSchema,
  uiPanelHeadlessSchema,
  uiPanelCaptchaSchema,
]);

export const uiPanelSchema = Type.Intersect([
  anyPanelSchema,
  Type.Object({
    id: Type.Number(),
  }),
]);

export type UiPanelType = Static<typeof uiPanelSchema>
