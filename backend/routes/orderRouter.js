import express from "express";
import {
  allOrder,
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateStatus,
  userOrders,
  verifyStripe,
} from "../controllers/orderController.js";
import { adminAuth } from "../middleware/adminAuth.js";

import { authUser } from "../middleware/authUser.js";

const orderRouter = express.Router();

orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/place-stripe", authUser, placeOrderStripe);
orderRouter.post("/place-razorpay", authUser, placeOrderRazorpay);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/admin", adminAuth, allOrder);
orderRouter.post("/user", authUser, userOrders);
orderRouter.post("/verify-stripe", authUser, verifyStripe);

export default orderRouter;
