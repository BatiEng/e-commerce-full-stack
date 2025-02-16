import express from "express";
import {
  addProduct,
  getAllProduct,
  getSingleProduct,
  removeProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import { adminAuth } from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/add-product",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter
  .route("/product/:id")
  .get(getSingleProduct)
  .delete(adminAuth, removeProduct);
productRouter.get("/products", getAllProduct);

export default productRouter;
