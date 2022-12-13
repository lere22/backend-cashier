import express from "express";
// import logger from "morgan";
import dotenv from "dotenv";

import indexRouter from "./routes/index.js";
import mongoose from "mongoose";

var app = express();
const env = dotenv.config().parsed;

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.listen(env.APP_PORT, () => {
	console.log(`Server is running on port ${env.APP_PORT}`);
});

// connect Mongodb
mongoose.set("strictQuery", true);
mongoose.connect(`${env.MONGODB_URI}${env.MONGODB_HOST}:${env.MONGODB_PORT}`, {
	dbName: env.MONGODB_DB_NAME,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
	console.log("Connected to MongoDB");
});
