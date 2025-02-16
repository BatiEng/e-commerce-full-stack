import User from "./../models/userModel.js";

export const addToCart = (req, res) => {
  const { userID, itemID, size } = req.body;
  User.findById(userID)
    .then((result) => {
      if (!result) {
        res.status(401).json({
          success: false,
          message: "there is no user with this ID",
        });
      }
      let cartData = result.cartData;
      if (cartData[itemID]) {
        if (cartData[itemID][size]) {
          cartData[itemID][size] += 1;
        } else {
          cartData[itemID][size] = 1;
        }
      } else {
        cartData[itemID] = {};
        cartData[itemID][size] = 1;
      }

      User.findByIdAndUpdate(userID, { cartData })
        .then((result) => {
          if (result) {
            res.status(200).json({
              success: true,
              message: "Product added to cart",
              result,
            });
          }
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
export const getCart = (req, res) => {
  const { userID } = req.body;
  User.findById(userID)
    .then((result) => {
      if (!result) {
        res.status(401).json({
          success: false,
          message: "there is no user with this ID",
        });
      }
      res.status(200).json({
        success: true,
        message: "cart data fetched",
        cartData: result.cartData,
      });
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        message: err,
      });
    });
};
export const updateCart = (req, res) => {
  const { userID, itemID, size, quantity } = req.body;
  User.findById(userID)
    .then((result) => {
      if (!result) {
        res.status(401).json({
          success: false,
          message: "there is no user with this ID",
        });
      }
      let cartData = result.cartData;
      cartData[itemID][size] = quantity;

      User.findByIdAndUpdate(userID, { cartData })
        .then((result) => {
          if (result) {
            res.status(200).json({
              success: true,
              message: "cart updated",
              result,
            });
          }
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
