import user from "../models/User.js";

const index = async (req, res) => {
	try {
		// search option
		let search = {
			fullname: { $regex: `^${req.query.search}`, $options: "i" },
		};

		// pagination & total limit page option
		let optionsPagination = {
			page: req.query.page || 1,
			limit: req.query.limit || 10,
		};

		const users = await user.paginate(search, optionsPagination);

		// jika data user tidak ada
		if (!users) {
			throw {
				code: 500,
				message: "Get all item in users failed",
			};
		}

		return res.status(200).json({
			status: true,
			total: users.length,
			users,
		});
	} catch (err) {
		if (!err.code) {
			err.code = 500;
		}
		return res.status(err.code).json({
			status: false,
			message: err.message,
		});
	}
};

export { index };
