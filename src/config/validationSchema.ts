import * as Joi from 'joi';

export const validationSchema = Joi.object({
  GEMINI_API_KEY: Joi.string().required().hostname(),
});
