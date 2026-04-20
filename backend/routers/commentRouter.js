// routes/commentRoutes.js
import express from "express";
import { addComment, getComments } from "../controller/commentcontroler.js";
import { protect } from "../middlware/authMiddlware.js";

const router = express.Router();

router.get("/:id", getComments);
router.post("/:id", protect, addComment);

export default router;