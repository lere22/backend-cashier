import express from "express";
import { index, store } from "../controllers/UserController.js";
var router = express.Router();

/* GET users listing. */
router.get("/", index);
router.post("/", store);

export default router;
