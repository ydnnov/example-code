import { FastifyReply, FastifyRequest } from 'fastify';
import { services } from '../services/services.js';
import { SiteCaptchaRequestAnswerType } from '../schemas/site-captcha.schema.js';
import { CaptchaAnswerRequestEntity } from '../entities/captcha-answer-request.entity.js';

class SiteCaptchaController {
    public async requestAnswer(
        request: FastifyRequest<{ Body: SiteCaptchaRequestAnswerType }>,
        reply: FastifyReply,
    ): Promise<CaptchaAnswerRequestEntity> {
        return services.siteCaptcha.createAnswerRequest(request.body.imageBase64);
    }

    public async getAnswerRequest(
        request: FastifyRequest<{ Params: { id: number } }>,
        reply: FastifyReply,
    ): Promise<CaptchaAnswerRequestEntity> {
        // TODO: Если не найдено надо возвращать 404,
        // TODO: но надо настроить чтобы fastify автоматом это делал
        return services.siteCaptcha.getAnswerRequest(request.params.id);
    }

}

export const siteCaptchaController = new SiteCaptchaController();
