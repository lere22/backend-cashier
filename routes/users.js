import express from "express";
import { index, store, update } from "../controllers/UserController.js";
var router = express.Router();

/* GET users listing. */
router.get("/", index);
router.post("/", store);
router.put("/:id", update);

export default router;
