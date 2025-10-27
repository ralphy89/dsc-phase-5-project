import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();
const app = express();

// const allowedOrigins = [
//     'https://sentiment-market.vercel.app',  // Votre frontend
//     'http://localhost:3000'                // Pour le développement local
// ];

// const corsOptions = {
//     origin: function (origin, callback) {
//         // Permet l'accès si l'origine est dans la liste ou si c'est une requête sans origine (ex: Postman)
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     }
// };

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

connectDB();

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/recommendations", recommendationRoutes);

const PORT = process.env.PORT || 5050;
// Ajouter à la fin de server.js
if (process.env.NODE_ENV === 'production') {
    module.exports = app;
  } else {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend running on http://0.0.0.0:${PORT}`);
    });
  }

