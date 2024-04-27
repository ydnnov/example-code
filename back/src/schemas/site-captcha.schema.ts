import { Static, Type } from '@sinclair/typebox';

////////////////////////////////////////////////////////////////////////////////
export const siteCaptchaRequestAnswerSchema = Type.Object({
    imageBase64: Type.String(),
});
export type SiteCaptchaRequestAnswerType = Static<typeof siteCaptchaRequestAnswerSchema>
////////////////////////////////////////////////////////////////////////////////
export const siteCaptchaSetAnswerSchema = Type.Object({
    answerRequestId: Type.Number(),
    answer: Type.String(),
});
export type SiteCaptchaSetAnswerType = Static<typeof siteCaptchaSetAnswerSchema>
////////////////////////////////////////////////////////////////////////////////
export const siteCaptchaAcceptAnswerSchema = Type.Object({});
export type SiteCaptchaAcceptAnswerType = Static<typeof siteCaptchaAcceptAnswerSchema>
////////////////////////////////////////////////////////////////////////////////
