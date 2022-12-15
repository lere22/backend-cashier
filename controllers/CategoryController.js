import category from "../models/Category.js";

const index = async (req, res) => {
	try {
		const categories = await category.find({ status: "active" });

		// jika data category tidak ada
		if (!categories) {
			throw {
				code: 500,
				message: "Get all item in categories failed",
			};
		}

		return res.status(200).json({
			status: true,
			total: categories.length,
			categories,
		});
	} catch (err) {
		return res.status(err.code).json({
			status: false,
			message: err.message,
		});
	}
};

const store = async (req, res) => {
	try {
		// jika beberapa field ada yang kosong
		if (!req.body.title) {
			throw { code: 428, message: "Title is required!" };
		}

		const title = req.body.title;

		const newCategory = new category({
			title: title,
		});
		const saveCategory = await newCategory.save();

		// jika category gagal ditambahkan
		if (!saveCategory) {
			throw { code: 500, message: "Store category failed" };
		}

		return res.status(200).json({
			status: true,
			saveCategory,
		});
	} catch (err) {
		return res.status(err.code).json({
			status: false,
			message: err.message,
		});
	}
};

export { index, store };
