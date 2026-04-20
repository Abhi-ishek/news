// controllers/commentController.js
import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  const comment = new Comment({
    user: req.user.id,
    newsId: req.params.id,
    text: req.body.text
  });

  await comment.save();
  res.json(comment);
};

export const getComments = async (req, res) => {
  const comments = await Comment.find({ newsId: req.params.id })
    .populate("user", "name");

  res.json(comments);
};