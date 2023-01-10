import user from "../models/User.js";
import bcrypt from "bcrypt";

// libraries
import { isEmailExist, isEmailExistWithUserId } from "../libraries/isEmailExist.js";

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

const store = async (req, res) => {
	try {
		// jika beberapa field ada yang kosong
		if (!req.body.fullname) {
			throw { code: 428, message: "Fullname is required!" };
		}
		if (!req.body.email) {
			throw { code: 428, message: "Email is required!" };
		}
		if (!req.body.password) {
			throw { code: 428, message: "Password is required!" };
		}
		if (!req.body.role) {
			throw { code: 428, message: "Role is required!" };
		}

		// jika password tidak match
		if (req.body.password !== req.body.retype_password) {
			throw { code: 428, message: "PASSWORD_NOT_MATCH" };
		}

		// jika email sudah terdaftar
		const email = await isEmailExist(req.body.email);
		if (email) {
			throw { code: 409, message: "EMAIL_EXIST" };
		}

		// password hash with bcrypt
		let salt = await bcrypt.genSalt(10);
		let hash = await bcrypt.hash(req.body.password, salt);

		const newUser = new user({
			fullname: req.body.fullname,
			email: req.body.email,
			password: hash,
			role: req.body.role,
		});
		const saveUser = await newUser.save();

		// jika category gagal ditambahkan
		if (!saveUser) {
			throw { code: 500, message: "USER_REGISTER_FAILED" };
		}

		return res.status(200).json({
			status: true,
			message: "USER_REGISTER_SUCCESS",
			saveUser,
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

const update = async (req, res) => {
	try {
		// jika beberapa field ada yang kosong
		if (!req.body.fullname) {
			throw { code: 428, message: "Fullname is required!" };
		}
		if (!req.body.email) {
			throw { code: 428, message: "Email is required!" };
		}
		if (!req.body.role) {
			throw { code: 428, message: "Role is required!" };
		}

		// jika password tidak match
		if (req.body.password !== req.body.retype_password) {
			throw { code: 428, message: "PASSWORD_NOT_MATCH" };
		}

		// jika email sudah terdaftar
		const email = await isEmailExistWithUserId(req.params.id, req.body.email);
		if (email) {
			throw { code: 409, message: "EMAIL_EXIST" };
		}

		let fields = {};
		fields.fullname = req.body.fullname;
		fields.email = req.body.email;
		fields.role = req.body.role;

		if (req.body.password) {
			// password hash with bcrypt
			let salt = await bcrypt.genSalt(10);
			let hash = await bcrypt.hash(req.body.password, salt);
			fields.password = hash;
		}

		// update user
		const updateUser = await user.findByIdAndUpdate(req.params.id, fields, { new: true });

		// jika category gagal ditambahkan
		if (!updateUser) {
			throw { code: 500, message: "USER_UPDATE_FAILED" };
		}

		return res.status(200).json({
			status: true,
			message: "USER_UPDATE_SUCCESS",
			updateUser,
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

export { index, store, update };
