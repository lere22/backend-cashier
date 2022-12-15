import express from "express";
import { index, store } from "../controllers/ProductController.js";
var router = express.Router();

/* GET products listing. */
router.get("/", index);
router.post("/", store);

export default router;
