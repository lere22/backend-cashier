import express from "express";
import { register, login, accessToken } from "../controllers/AuthController.js";
var router = express.Router();

/* GET users listing. */
router.post("/register", register);
router.post("/login", login);
// verify token
router.post("/access-token", accessToken);

export default router;
