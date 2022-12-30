import user from "../models/User.js";

const index = async (req, res) => {
	try {
		console.log("Hello");
	} catch (err) {
		return res.status(err.code).json({
			status: false,
			message: err.message,
		});
	}
};

export { index };
