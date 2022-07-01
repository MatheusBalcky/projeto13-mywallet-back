import Joi from 'joi';

export const enterOutSchema = Joi.object({
    value: Joi.string().pattern(/.{1,21}/).required(),
    description: Joi.string().min(1).required(),
});
