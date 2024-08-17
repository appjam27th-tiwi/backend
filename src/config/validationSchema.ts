import * as Joi from 'joi';

export const validationSchema = Joi.object({
  GEMINI_API_KEY: Joi.string().required(),
  NAVER_CLIENT_ID: Joi.string().required(),
  NAVER_CLIENT_SECRET: Joi.string().required(),
});
