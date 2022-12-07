import express, { json } from 'express';
import cors from 'cors';
import categoriesRouter from './routes/categoriesRouter.js'
import customersRouter from './routes/customersRouter.js'
import gamesRouter from './routes/gamesRouter.js'

const app = express();
app.use(json());
app.use(cors());
app.use(categoriesRouter);
app.use(customersRouter);
app.use(gamesRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at port ${port}...`);
});