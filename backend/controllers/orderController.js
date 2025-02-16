import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const currency = "usd";
const deliveryCharge = 10;

const stripe = new Stripe(process.env.STRIPE_API_KEY);

export const placeOrder = (req, res) => {
  let { userID, items, amount, address } = req.body;

  const orderData = new Order({
    userID,
    items,
    amount,
    address,
    paymentMethod: "COD",
    date: Date.now(),
  });

  orderData
    .save()
    .then((result) => {
      if (!result) {
        res.status(401).json({
          success: false,
          message: `error occured while saving order`,
        });
      }
      User.findByIdAndUpdate(userID, { cartData: {} })
        .then((result) => {
          if (!result) {
            res.status(401).json({
              success: false,
              message: `error occured while updating cart`,
            });
          }
          res.status(200).json({
            success: true,
            message: "order placed",
          });
        })
        .catch((err) => {
          res.status(401).json({
            success: false,
            message: err,
          });
        });
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        message: err,
      });
    });
};

export const placeOrderStripe = (req, res) => {
  let { userID, items, amount, address } = req.body;
  const { origin } = req.headers;

  const orderData = new Order({
    userID,
    items,
    amount,
    address,
    paymentMethod: "Stripe",
    date: Date.now(),
  });

  orderData
    .save()
    .then((result) => {
      if (!result) {
        res.status(401).json({
          success: false,
          message: `Error occurred while saving order`,
        });
      }

      const line_items = items.map((item) => ({
        price_data: {
          currency,
          product_data: {
            // Corrected from productData to product_data
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      line_items.push({
        price_data: {
          currency,
          product_data: {
            // Corrected here too
            name: "Delivery Charges",
          },
          unit_amount: deliveryCharge * 100,
        },
        quantity: 1,
      });

      stripe.checkout.sessions
        .create({
          success_url: `${origin}/verify?success=true&orderID=${orderData._id}`,
          cancel_url: `${origin}/verify?success=false&orderID=${orderData._id}`,
          line_items,
          mode: "payment",
        })
        .then((result) => {
          console.log(result);
          if (!result) {
            res.status(401).json({
              success: false,
              message: "Error occurred while creating session",
            });
          }
          res.status(200).json({
            success: true,
            session_url: result.url,
          });
        })
        .catch((err) => {
          res.status(401).json({
            success: false,
            message: err.message || err,
          });
        });
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        message: err.message || err,
      });
    });
};

export const verifyStripe = (req, res) => {
  const { orderID, success, userID } = req.body;

  if (success === "true") {
    Order.findByIdAndUpdate(orderID, { payment: true })
      .then((result) => {
        // if (!result) {
        //   res.status(401).json({
        //     success: false,
        //     message: `error occured while updating payment`,
        //   });
        // }
        User.findByIdAndUpdate(userID, { cartData: {} })
          .then((result) => {
            // if (!result) {
            //   res.status(401).json({
            //     success: false,
            //     message: `error occured while updating cart`,
            //   });
            // }
            res.status(200).json({
              success: true,
              message: "order placed",
            });
          })
          .catch((err) => {
            // res.status(401).json({
            //   success: false,
            //   message: err,
            // });
          });
      })
      .catch((err) => {
        res.status(401).json({
          success: false,
          message: err.message || err,
        });
      });
  } else {
    Order.findByIdAndDelete(orderID)
      .then((result) => {
        res.status(401).json({
          success: false,
          message: `error occured while placing order`,
        });
      })
      .catch((err) => {
        res.status(401).json({
          success: false,
          message: err.message || err,
        });
      });
  }
};

export const placeOrderRazorpay = (req, res) => {};

export const allOrder = (req, res) => {
  Order.find({})
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "orders fetched",
        data: result,
      });
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        message: err,
      });
    });
};

export const userOrders = (req, res) => {
  const { userID } = req.body;

  Order.find({ userID })
    .then((result) => {
      if (!result) {
        res.status(401).json({
          success: false,
          message: "there is no order",
        });
      }

      res.status(200).json({
        success: true,
        message: "orders fetched",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateStatus = (req, res) => {
  const { orderID, status } = req.body;

  Order.findByIdAndUpdate(orderID, { status })
    .then((_) => {
      res.status(200).json({
        success: true,
        message: "Status updated",
      });
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        message: err,
      });
    });
};
