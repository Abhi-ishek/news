// models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  newsId: { type: mongoose.Schema.Types.ObjectId, ref: "News" },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Comment", commentSchema);