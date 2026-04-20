// routes/newsRoutes.js
import express from "express";
import {
  createNews,
  getAllNews,
  getSingleNews,
  deleteNews,
  getMyNews,
  updateNews
} from "../controller/newsCOntroller.js";

import { protect } from "../middlware/authMiddlware.js";
import { isAdmin } from "../middlware/AdminMiddleware.js";
import upload from "../middlware/upload.js";

const router = express.Router();

router.get("/", getAllNews);
router.get("/my-news", protect, getMyNews);
router.get("/:id", getSingleNews);

// Admin only
router.post("/", protect, isAdmin, upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), createNews);
router.put("/:id", protect, isAdmin, upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), updateNews);
router.delete("/:id", protect, isAdmin, deleteNews);

export default router;