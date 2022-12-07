import joi from 'joi';

export const customersSchema = joi.object({
  name: joi.string().required().min(1),
  phone: joi.string().required().min(10).max(11).pattern(/^[0-9]+$/),
  cpf: joi.string().required().length(11).pattern(/^[0-9]+$/),
  birthday: joi.required(),
});
