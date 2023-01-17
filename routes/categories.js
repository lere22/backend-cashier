import express from "express";
import { index, store } from "../controllers/CategoryController.js";
import jwtAuth from "../middlewares/jwtAuth.js";
var router = express.Router();

/* GET categories listing. */
router.get("/", jwtAuth(), index);
router.post("/", jwtAuth(), store);

export default router;
