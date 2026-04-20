import mongoose from "mongoose";

mongoose.set('strictQuery', false);

import Category from "../models/Category.js";

const seedCategories = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    const categories = [
      { name: "Tech" },
      { name: "Business" },
      { name: "World" },
      { name: "Science" },
      { name: "Sports" }
    ];
    await Category.insertMany(categories);
    console.log("Initial categories seeded!");
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedCategories();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
