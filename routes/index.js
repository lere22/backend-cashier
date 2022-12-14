import express from "express";
import categories from "./categories.js";
var router = express.Router();

/* GET home page. */
router.use("/categories", categories);

export default router;
