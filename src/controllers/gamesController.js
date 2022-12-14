import { connection } from "../database/database.js";

export async function getGames(req, res) {
  const { name } = req.query;
  
  try {
    const text = `SELECT a.*, b.name AS "categoryName" FROM games AS a JOIN categories AS b ON a."categoryId" = b.id`;
    const textFinal = name ? text + ` WHERE a.name ILIKE '%${name}%'` : text;
    const query = await connection.query(textFinal);

    res.send(query.rows);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
}

export async function postGames(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.game;

  try {
    await connection.query(
      'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
}


