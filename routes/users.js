import express from "express";
import { index, store, update, edit } from "../controllers/UserController.js";
var router = express.Router();

/* GET users listing. */
router.get("/", index);
router.post("/", store);
router.put("/:id", update);
router.get("/:id", edit);

export default router;
