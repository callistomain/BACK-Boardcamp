import joi from 'joi';

export const gamesSchema = joi.object({
  name: joi.string().required().min(1),
  image: joi.string().required().min(1),
  stockTotal: joi.number().required().min(1),
  categoryId: joi.number().required(),
  pricePerDay: joi.number().required().min(1),
});
