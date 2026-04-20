import express from "express";
import { register, login, getMe, updateProfile } from "../controller/auth.js";
import { protect } from "../middlware/authMiddlware.js";
import upload from "../middlware/upload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

export default router;