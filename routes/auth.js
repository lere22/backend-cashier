import express from "express";
import { register, login, accessToken, checkEmail } from "../controllers/AuthController.js";
var router = express.Router();

/* GET auth listing. */
router.post("/register", register);
router.post("/login", login);
// verify token
router.post("/access-token", accessToken);
router.post("/check-email", checkEmail);

export default router;
