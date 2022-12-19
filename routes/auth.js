import express from "express";
import { register, login } from "../controllers/AuthController.js";
var router = express.Router();

/* GET users listing. */
router.post("/register", register);
router.post("/login", login);

export default router;
