
import { connection } from "../database/database.js";
import { gamesSchema } from "../models/gamesSchema.js";

export async function gamesValidation(req, res, next) {
  const game = req.body;

  const {error} = gamesSchema.validate(game, {abortEarly: false});
  if (error) {
    const message = error.details.map(e => e.message);
    return res.status(422).send(message);
  }

  const id = await connection.query(
    'SELECT * FROM categories WHERE id=$1',
    [game.categoryId]
  );
  if (id.rowCount === 0) return res.sendStatus(400);

  const name = await connection.query(
    "SELECT * FROM games WHERE name=$1",
    [game.name]
  );
  if (name.rowCount > 0) return res.sendStatus(409);

  req.game = game;
  next();
}