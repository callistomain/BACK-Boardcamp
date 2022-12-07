
import { connection } from "../database/database.js";
import { categoriesSchema } from "../models/categoriesSchema.js";

export async function categoriesValidation(req, res, next) {
  const category = req.body;

  const {error} = categoriesSchema.validate(category, {abortEarly: false});
  if (error) {
    const message = error.details.map(e => e.message);
    return res.status(422).send(message);
  }

  const result = await connection.query(
    "SELECT name FROM categories WHERE name=$1",
    [category.name]
  );

  if (result.rowCount > 0) return res.sendStatus(409);

  req.category = category;
  next();
}