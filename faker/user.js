import user from "../models/User.js";
import { faker } from "@faker-js/faker";

// input faker user data to database
const run = async (limit) => {
	try {
		let data = [];
		for (let i = 0; i < limit; i++) {
			data.push({
				fullname: faker.name.fullName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
			});
		}

		const fakeData = await user.insertMany(data);

		if (fakeData) {
			console.log(fakeData);
			console.log("Total data yang masuk : " + fakeData.length);
			process.exit();
		}
	} catch (error) {
		console.log(error);
		process.exit();
	}
};

export { run };
