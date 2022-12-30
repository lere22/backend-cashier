import express from "express";
import { index } from "../controllers/UserController.js";
var router = express.Router();

/* GET users listing. */
router.get("/", index);

export default router;
