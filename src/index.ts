require('express-async-errors');
import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import Database from "./services/Database";
import dbConnect from "./services/ExpressApp";

const port = process.env.PORT || 3077;

const StartServer = async () => {
  try {

    const app: Express = express();

    await Database()

    await dbConnect(app)

    app.listen(port, () => {
      // console.clear();
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

StartServer()
