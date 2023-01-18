import express from "express";
import { register, login, refreshToken, checkEmail } from "../controllers/AuthController.js";
var router = express.Router();

/* GET auth listing. */
router.post("/register", register);
router.post("/login", login);
// verify token
router.post("/refresh-token", refreshToken);
router.post("/check-email", checkEmail);

export default router;
