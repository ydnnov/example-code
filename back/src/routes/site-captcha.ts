import { FastifyInstance } from 'fastify';
import { siteCaptchaRequestAnswerSchema } from '../schemas/site-captcha.schema.js';
import { siteCaptchaController } from '../controllers/site-captcha.controller.js';

export async function siteCaptchaRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/site-captcha/request-answer',
        { schema: { body: siteCaptchaRequestAnswerSchema } },
        siteCaptchaController.requestAnswer.bind(siteCaptchaController),
    );
    fastify.get(
        '/site-captcha/answer-request/:id',
        siteCaptchaController.getAnswerRequest.bind(siteCaptchaController),
    );

}
