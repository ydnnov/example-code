import { Static, Type } from '@sinclair/typebox';

export const headlessScreenshotsSetIntervalBodySchema = Type.Object({
    interval: Type.Number(),
});
export type HeadlessScreenshotsSetIntervalBodyType = Static<typeof headlessScreenshotsSetIntervalBodySchema>
