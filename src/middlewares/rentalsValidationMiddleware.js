import { connection } from '../database/database.js';
import { rentalsSchema } from "../models/rentalsSchema.js";

export async function rentalsValidation(req, res, next) {
  const rental = req.body;

  const {error} = rentalsSchema.validate(rental);
  if (error) return rental.sendStatus(400); // return res.status(422).send(message);
  
  const customer = await connection.query(
    'SELECT * FROM customers WHERE id=$1',
    [rental.customerId]
  );
  if (customer.rowCount === 0) return res.sendStatus(400);

  const game = await connection.query(
    'SELECT * FROM games WHERE id=$1',
    [rental.gameId]
  );
  if (game.rowCount === 0) return res.sendStatus(400);

  const rentals = await connection.query(
    'SELECT * FROM rentals WHERE "gameId"=$1',
    [rental.gameId]
  );

  if (+rental.daysRented > game.rows[0].stockTotal) return res.sendStatus(400);
  if (rentals.rowCount >= game.rows[0].stockTotal) return res.sendStatus(400);

  rental.price = game.rows[0].pricePerDay;
  req.rental = rental;
  next();
}