import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id !== req.body.userID) {
        res.status(401).json({
          success: false,
          message: "Not authorized",
        });
      }
      next();
    } catch (err) {
      res.status(401).json({
        success: false,
        message: `not authorization: ${err}`,
      });
    }
  }
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Not authorized, No token",
    });
  }
};
