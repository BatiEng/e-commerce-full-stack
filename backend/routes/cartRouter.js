import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
} from "../controllers/cartControllers.js";
import { authUser } from "../middleware/authUser.js";

const cartRouter = express.Router();

cartRouter.post("/add", authUser, addToCart);
cartRouter.post("/get", authUser, getCart);
cartRouter.post("/update", authUser, updateCart);

export default cartRouter;
