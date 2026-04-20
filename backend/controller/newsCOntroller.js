// controllers/newsController.js
import News from "../models/News.js";

export const createNews = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const imageFile = req.files?.image?.[0];
    const videoFile = req.files?.video?.[0];

    const news = new News({
      title,
      content,
      category,
      image: imageFile ? `/uploads/${imageFile.filename}` : "",
      video: videoFile ? `/uploads/${videoFile.filename}` : "",
      author: req.user.id
    });

    await news.save();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate("author", "name");
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// in newsController.js
export const getAllNews = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const news = await News.find(query).sort({ createdAt: -1 }).populate("author", "name");
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyNews = async (req, res) => {
  try {
    const news = await News.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const updateData = { title, content, category };

    if (req.files?.image?.[0]) {
      updateData.image = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.video?.[0]) {
      updateData.video = `/uploads/${req.files.video[0].filename}`;
    }

    const news = await News.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!news) return res.status(404).json({ message: "News not found" });

    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};