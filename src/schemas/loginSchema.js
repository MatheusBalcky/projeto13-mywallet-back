import Joi from 'joi';

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/.{6,21}/).required()
});

export default loginSchema;