import { customersSchema } from "../models/customersSchema.js";
import joi from 'joi';

export async function customersValidation(req, res, next) {
  const customer = req.body;

  const {error} = customersSchema.validate(customer, {abortEarly: false});
  if (error) {
    const message = error.details.map(e => e.message);
    return res.status(422).send(message);
  }
  
  const schemaDate = joi.date();
  try { joi.attempt(customer.birthday, schemaDate); }
  catch (err) { return res.sendStatus(400); }

  req.customer = customer;
  next();
}