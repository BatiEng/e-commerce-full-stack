import { v2 as cloudinary } from "cloudinary";
import Product from "./../models/productModel.js";
import mongoose from "mongoose";

export const addProduct = (req, res) => {
  // Destructure product details from request body
  let {
    name,
    description,
    price,
    category,
    subCategory,
    sizes,
    bestSeller,
    date,
  } = req.body;

  // Ensure req.files exists before accessing it
  const image1 = req.files?.image1?.[0];
  const image2 = req.files?.image2?.[0];
  const image3 = req.files?.image3?.[0];
  const image4 = req.files?.image4?.[0];

  // Collect valid images
  const images = [image1, image2, image3, image4].filter(Boolean);

  // Cloudinary Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Step 1: Upload Images
  Promise.all(
    images.map((item) =>
      cloudinary.uploader.upload(item.path, { resource_type: "image" })
    )
  )
    .then((results) => {
      // Extract secure URLs
      const imagesURL = results.map((result) => result.secure_url);

      // Create the product object
      const product = {
        name,
        description,
        price: Number(price),
        category,
        subCategory,
        sizes: JSON.parse(sizes),
        bestSeller: bestSeller === "true" ? true : false,
        date: Date.now(),
        image: imagesURL,
      };

      // Step 2: Save the product to the database
      const newProduct = new Product(product);
      return newProduct.save();
    })
    .catch((error) => {
      // Error handling for image upload or product preparation
      console.error("Error during image upload or product preparation:", error);
      res
        .status(500)
        .json({ message: "Failed to upload images", error: error.message });
      throw error; // Re-throw to stop further execution
    })
    .then((savedProduct) => {
      // Step 3: Send success response
      res.status(200).json({
        success: true,
        message: "Product added successfully",
        product: savedProduct,
      });
    })
    .catch((error) => {
      // Error handling for database save operation
      console.error("Error saving product:", error);
      res
        .status(500)
        .json({ message: "Failed to save product", error: error.message });
    });
};

export const getAllProduct = (req, res) => {
  Product.find({})
    .then((result) => {
      res.status(200).json({
        success: true,
        result: result.length,
        message: "Data fetched succesfully",
        data: result,
      });
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        message: `error occured while fetching data err: ${err}`,
      });
    });
};

export const removeProduct = (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(401).json({
      success: false,
      message: `Provide a valid ID err: ${err}`,
    });
  } else {
    Product.findById(id)
      .then((result) => {
        if (!result) {
          res.status(401).json({
            success: false,
            message: "There is no Data with this ID",
          });
        } else {
          Product.findByIdAndDelete(id)
            .then((result) => {
              res.status(200).json({
                success: true,
                message: `Data deleted succesfully`,
              });
            })
            .catch((err) => {
              res.status(401).json({
                success: false,
                message: `error occured while deleting data err: ${err}`,
              });
            });
        }
      })
      .catch((err) => {
        res.status(401).json({
          success: false,
          message: `error occured while fetching data err: ${err}`,
        });
      });
  }
};

export const getSingleProduct = (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(401).json({
      success: false,
      message: `Provide a valid ID err: ${err}`,
    });
  } else {
    Product.findById(id)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "Data fetched succesfully",
          data: result,
        });
      })
      .catch((err) => {
        res.status(401).json({
          success: false,
          message: `error occured while fetching data err: ${err}`,
        });
      });
  }
};
