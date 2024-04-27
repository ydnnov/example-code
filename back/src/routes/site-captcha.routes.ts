import { FastifyInstance } from 'fastify';
import {
    siteCaptchaRequestAnswerSchema, siteCaptchaSetAnswerSchema,
} from '../schemas/site-captcha.schema.js';
import { controllers } from '../controllers/controllers.js';

export async function siteCaptchaRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/site-captcha/request-answer',
        { schema: { body: siteCaptchaRequestAnswerSchema } },
        controllers.siteCaptcha.requestAnswer.bind(controllers.siteCaptcha),
    );
    fastify.get(
        '/site-captcha/answer-request/:id',
        controllers.siteCaptcha.getAnswerRequest.bind(controllers.siteCaptcha),
    );
    fastify.get(
        '/site-captcha/captcha-image/:id',
        controllers.siteCaptcha.getCaptchaImage.bind(controllers.siteCaptcha),
    );
    fastify.post(
        '/site-captcha/set-answer',
        { schema: { body: siteCaptchaSetAnswerSchema } },
        controllers.siteCaptcha.setAnswer.bind(controllers.siteCaptcha),
    );

}
