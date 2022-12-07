import { connection } from "../database/database.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;
  
  try {
    const customers = cpf 
      ? await connection.query(`SELECT * FROM customers WHERE name ILIKE '${cpf}%'`)
      : await connection.query("SELECT * FROM customers");
    res.send(customers.rows);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
}

export async function getCustomersById(req, res) {
  const { id } = req.params;
  
  try {
    const customer = await connection.query("SELECT * FROM customers WHERE id=$1", [id]);
    if (customer.rowCount > 0) return res.send(customer.rows[0]);
    else return res.sendStatus(404);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
}

export async function postCustomers(req, res) {
  const { name, phone, cpf, birthday } = req.customer;

  const result = await connection.query(
    "SELECT * FROM customers WHERE cpf=$1",
    [cpf]
  );
  if (result.rowCount > 0) return res.sendStatus(409);

  try {
    await connection.query(
      'INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)',
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
}

export async function putCustomers(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.customer;

  const result = await connection.query(
    "SELECT * FROM customers WHERE cpf=$1 AND id<>$2",
    [cpf, id]
  );
  if (result.rowCount > 0) return res.sendStatus(409);

  try {
    await connection.query(
      'UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5',
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
}

