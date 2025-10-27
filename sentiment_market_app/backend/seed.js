import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/productModel.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/sentimentShop";
const csvPath = path.join(process.cwd(), "..", "data", "sample30.csv");

async function connect() {
  await mongoose.connect(mongoUri, { autoIndex: true });
}

async function seed() {
  await connect();
  console.log("Connected to MongoDB");
  await Product.deleteMany({});

  const products = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        const price = Math.max(5, Math.min(500, Math.floor((Number(row.reviews_rating) || 3) * 20)));
        products.push({
          name: row.name || "Unnamed Product",
          description: row.reviews_text || row.reviews_title || "",
          price,
          imageUrl: "https://picsum.photos/seed/" + encodeURIComponent(row.id || row.name || Math.random()) + "/400/300",
          category: (row.categories || "general").split(",")[0],
          sentimentScore: row.user_sentiment?.toLowerCase() === "positive" ? 0.5 : -0.2,
        });
      })
      .on("end", resolve)
      .on("error", reject);
  });

  if (products.length) {
    await Product.insertMany(products.slice(0, 100));
  }

  console.log(`Inserted ${Math.min(products.length, 100)} products`);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

