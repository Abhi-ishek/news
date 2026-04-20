import express from "express";
import { getCategories, createCategory } from "../controller/categoryController.js";
import { protect } from "../middlware/authMiddlware.js";
import { isAdmin } from "../middlware/AdminMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, isAdmin, createCategory);

export default router;
