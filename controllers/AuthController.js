import user from "../models/User.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

// libraries
import { isEmailExist } from "../libraries/isEmailExist.js";

const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
	return jsonwebtoken.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: env.JWT_ACCESS_TOKEN_LIFE });
};

const generateRefreshToken = async (payload) => {
	return jsonwebtoken.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: env.JWT_REFRESH_TOKEN_LIFE });
};

// endpoint untuk mengecek dari sisi Frontend
const checkEmail = async (req, res) => {
	try {
		// jika email sudah terdaftar
		const email = await isEmailExist(req.body.email);
		if (email) {
			throw { code: 409, message: "EMAIL_EXIST" };
		}

		// email berhasil dicek
		res.status(200).json({
			status: true,
			message: "EMAIL_NOT_EXIST",
		});
	} catch (err) {
		res.status(err.code).json({
			status: false,
			message: err.message,
		});
	}
};

const register = async (req, res) => {
	try {
		// jika beberapa field ada yang kosong
		if (!req.body.fullname) {
			throw { code: 428, message: "Fullname is required!" };
		}
		if (!req.body.email) {
			throw { code: 428, message: "Email is required!" };
		}
		if (!req.body.password) {
			throw { code: 428, message: "password is required!" };
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

const login = async (req, res) => {
	try {
		// jika beberapa field ada yang kosong
		if (!req.body.email) {
			throw { code: 428, message: "Email is required!" };
		}
		if (!req.body.password) {
			throw { code: 428, message: "password is required!" };
		}

		// jika email sudah terdaftar
		const User = await user.findOne({ email: req.body.email });
		if (!User) {
			throw { code: 403, message: "EMAIL_NOT_FOUND" };
		}

		// jika password match
		const isMatch = await bcrypt.compareSync(req.body.password, User.password);
		if (!isMatch) {
			throw { code: 403, message: "WRONG_PASSWORD" };
		}

		// generate token
		const payload = { id: User._id, role: User.role };
		const accessToken = await generateAccessToken(payload);
		const refreshToken = await generateRefreshToken(payload);

		return res.status(200).json({
			status: true,
			message: "USER_LOGIN_SUCCESS",
			fullname: User.fullname,
			accessToken,
			refreshToken,
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

const refreshToken = async (req, res) => {
	try {
		// jika beberapa field ada yang kosong
		if (!req.body.refreshToken) {
			throw { code: 428, message: "REFRESH_TOKEN_REQUIRED" };
		}

		// verify token
		const verifyToken = await jsonwebtoken.verify(req.body.refreshToken, env.JWT_REFRESH_TOKEN_SECRET);

		// regenerate token
		let payload = { id: verifyToken.id, role: verifyToken.role };
		const accessToken = await generateAccessToken(payload);
		const refreshToken = await generateRefreshToken(payload);

		return res.status(200).json({
			status: true,
			message: "REFRESH_TOKEN_SUCCESS",
			accessToken,
			refreshToken,
		});
	} catch (err) {
		if (err.message == "jwt expired") {
			err.message = "REFRESH_TOKEN_EXPIRED";
		} else {
			err.message = "REFRESH_TOKEN_INVALID";
		}
		return res.status(err.code).json({
			status: false,
			message: err.message,
		});
	}
};

export { register, login, refreshToken, checkEmail };
