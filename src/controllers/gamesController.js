import { connection } from "../database/database.js";

export async function getGames(req, res) {
  const { name } = req.query;
  
  try {
    const text = name ? `SELECT * FROM games WHERE name ILIKE '${name}%'` : `SELECT * FROM games`;
    const query = await connection.query(text);

    const games = query.rows;
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      const query = await connection.query(`SELECT name FROM categories WHERE id=$1`, [game.categoryId]);
      const categoryName = query.rows[0].name;
      game.categoryName = categoryName;
    }
    
    res.send(games);
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


