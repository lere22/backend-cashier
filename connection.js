import mongoose from "mongoose";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const connection = async () => {
	mongoose.set("strictQuery", true);
	mongoose.connect(`${env.MONGODB_URI}${env.MONGODB_HOST}:${env.MONGODB_PORT}`, {
		dbName: env.MONGODB_DB_NAME,
	});
	const db = await mongoose.connection;
	db.on("error", console.error.bind(console, "connection error:"));
	db.once("open", function () {
		console.log("Connected to MongoDB");
	});
};

export { connection };
