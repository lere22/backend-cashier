import express from "express";
// import logger from "morgan";
import dotenv from "dotenv";
import indexRouter from "./routes/index.js";
import cors from "cors";
import { connection } from "./connection.js";

var app = express();
const env = dotenv.config().parsed;

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: "*",
	}),
);

app.use("/", indexRouter);

app.listen(env.APP_PORT, () => {
	console.log(`Server is running on port ${env.APP_PORT}`);
});

// connect Mongodb
connection();
