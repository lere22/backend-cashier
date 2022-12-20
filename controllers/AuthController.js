import user from "../models/User.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
	return jsonwebtoken.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: env.JWT_ACCESS_TOKEN_LIFE });
};

const generateRefreshToken = async (payload) => {
	return jsonwebtoken.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: env.JWT_REFRESH_TOKEN_LIFE });
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
			throw { code: 428, message: "PASSWORD_MUST_MATCH" };
		}

		// jika email sudah terdaftar
		const email = await user.findOne({ email: req.body.email });
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
			throw { code: 404, message: "EMAIL_NOT_FOUND" };
		}

		// jika password match
		const isMatch = await bcrypt.compareSync(req.body.password, User.password);
		if (!isMatch) {
			throw { code: 428, message: "PASSWORD_WRONG" };
		}

		// generate token
		const payload = { id: User._id, role: User.role };
		const accessToken = await generateAccessToken(payload);
		const refreshToken = await generateRefreshToken(payload);

		return res.status(200).json({
			status: true,
			message: "USER_LOGIN_SUCCESS",
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

const accessToken = async (req, res) => {
	try {
		// jika beberapa field ada yang kosong
		if (!req.body.accessToken) {
			throw { code: 428, message: "Access Token is required!" };
		}

		// verify token
		const verifyToken = await jsonwebtoken.verify(req.body.accessToken, env.JWT_ACCESS_TOKEN_SECRET);
		if (!verifyToken) {
			throw { code: 401, message: "ACCESS_TOKEN_INVALID" };
		}

		// regenerate token
		let payload = { _id: verifyToken._id, role: verifyToken.role };
		const accessToken = await generateAccessToken(payload);
		const refreshToken = await generateRefreshToken(payload);

		return res.status(200).json({
			status: true,
			message: "ACCESS_TOKEN_SUCCESS",
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

export { register, login, accessToken };
