// middleware/adminMiddleware.js
import User from "../models/user.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin role required" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};