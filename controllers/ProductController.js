import { mongoose } from "mongoose";
import category from "../models/Category.js";
import product from "../models/Product.js";

const index = async (req, res) => {
	try {
		const products = await product.find({ status: "active" });

		// jika data product tidak ada
		if (!products) {
			throw { code: 500, message: "Get all item in products failed" };
		}

		return res.status(200).json({
			status: true,
			total: products.length,
			products,
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
		if (!req.body.thumbnail) {
			throw { code: 428, message: "Thumbnail is required!" };
		}
		if (!req.body.price) {
			throw { code: 428, message: "Price is required!" };
		}
		if (!req.body.categoryId) {
			throw { code: 428, message: "categoryId is required!" };
		}

		// jika product sudah ada
		const productExist = await product.findOne({ title: req.body.title });
		if (productExist) {
			throw { code: 428, message: "Product already exist!" };
		}

		// jika categoryId bukan bertipe ObjectId
		if (!mongoose.Types.ObjectId.isValid(req.body.categoryId)) {
			throw { code: 500, message: "Category inValid!" };
		}

		// jika category tidak ada
		const categoryExist = await category.findOne({ _id: req.body.categoryId });
		if (!categoryExist) {
			throw { code: 428, message: "Category is not exist!" };
		}

		const title = req.body.title;
		const thumbnail = req.body.thumbnail;
		const price = req.body.price;
		const categoryId = req.body.categoryId;

		const newProduct = new product({
			title: title,
			thumbnail: thumbnail,
			price: price,
			categoryId: categoryId,
		});
		const saveProduct = await newProduct.save();

		// jika product gagal ditambahkan
		if (!saveProduct) {
			throw { code: 500, message: "Store product failed" };
		}

		return res.status(200).json({
			status: true,
			saveProduct,
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

export { index, store };
