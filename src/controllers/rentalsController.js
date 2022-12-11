import { connection } from "../database/database.js";

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;
  
  try {
    let rentals;
    if (customerId) rentals = await connection.query(`SELECT * FROM rentals WHERE "customerId"=$1`, [customerId]);
    else if (gameId) rentals = await connection.query(`SELECT * FROM rentals WHERE "gameId"=$1`, [gameId]);
    else rentals = await connection.query("SELECT * FROM rentals");

    rentals = rentals.rows;
    const l = rentals.length;
    const arr = [];
    for (let i = 0; i < l; i++) {
      const item = rentals[i];
      const customer = await connection.query(`SELECT id, name FROM customers WHERE id=$1`, [item.customerId]);
      const game = await connection.query(`SELECT id, name, "categoryId" FROM games WHERE id=$1`, [item.gameId]); //
      const categoryName = await connection.query(`SELECT name FROM categories WHERE id=$1`, [game.rows[0].categoryId]);
      const obj = { ...item, customer: customer.rows[0], game: {...game.rows[0], categoryName: categoryName.rows[0].name} };
      arr.push(obj);      
    }

    res.send(arr);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
}

export async function postRentals(req, res) {
  const { customerId, gameId, daysRented, price } = req.rental;

  try {
    await connection.query(
      `INSERT INTO rentals (
        "customerId", 
        "gameId", 
        "daysRented", 
        "rentDate", 
        "originalPrice", 
        "returnDate", 
        "delayFee"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        customerId, gameId, daysRented,
        new Date(), daysRented * price,
        null, null
      ]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
}

export async function postRentalsReturn(req, res) {
  const { id } = req.params;

  function dateDiffInDays(a, b) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / msPerDay);
  }

  try {
    const text = `SELECT a."rentDate", a."daysRented", a."returnDate", b."pricePerDay" 
    FROM rentals AS a JOIN games AS b ON a."gameId" = b.id WHERE a.id=$1`;
    const query = await connection.query(text, [id]);
    if (query.rowCount === 0) return res.sendStatus(404);

    const { rentDate, daysRented, returnDate, pricePerDay } = query.rows[0];
    if (returnDate) return res.sendStatus(400);

    const currentDate = new Date();
    rentDate.setDate(rentDate.getDate() + daysRented);
    const delayFee = Math.max(0, dateDiffInDays(rentDate, currentDate) * pricePerDay);

    await connection.query(
      'UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3',
      [currentDate, delayFee, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
}

export async function deleteRentals(req, res) {
  const { id } = req.params;

  try {
    const query = await connection.query(`SELECT "returnDate" FROM rentals WHERE id=$1`, [id]);
    if (query.rowCount === 0) return res.sendStatus(404);

    const { returnDate } = query.rows[0];
    if (!returnDate) return res.sendStatus(400);

    await connection.query(`DELETE FROM rentals WHERE id=$1`, [id]);
    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
}