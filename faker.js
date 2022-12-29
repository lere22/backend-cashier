import { connection } from "./connection.js";

connection();

// route faker
const args = process.argv;

const fakerFile = args[2];
const faker = await import(`./faker/${fakerFile}`);

// limit input faker user
const limit = args[3] || 10;

// run faker user data input
faker.run(limit);
