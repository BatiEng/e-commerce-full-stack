import express from "express";
import colors from "colors";

import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
connectDB();
connectCloudinary();

//middleware
app.use(express.json());
const allowedOrigins = [
  "https://e-commerce-admin-delta-plum.vercel.app",
  "https://e-commerce-frontend-lac-theta.vercel.app/collection",
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Include if you're sending cookies
  })
);

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("api is working");
});

app.listen(PORT, () => console.log(`Server started on Port: ${PORT}`));
