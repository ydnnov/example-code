import { Static, Type } from '@sinclair/typebox';

////////////////////////////////////////////////////////////////////////////////
export const siteCaptchaRequestAnswerSchema = Type.Object({
    imageBase64: Type.String(),
});
export type SiteCaptchaRequestAnswerType = Static<typeof siteCaptchaRequestAnswerSchema>
////////////////////////////////////////////////////////////////////////////////
export const siteCaptchaAcceptAnswerSchema = Type.Object({
    answerRequestId: Type.Number(),
    answer: Type.String(),
});
export type SiteCaptchaAcceptAnswerType = Static<typeof siteCaptchaAcceptAnswerSchema>
////////////////////////////////////////////////////////////////////////////////

