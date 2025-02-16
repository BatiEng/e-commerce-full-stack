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
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("api is working");
});

app.listen(PORT, () => console.log(`Server started on Port: ${PORT}`));
