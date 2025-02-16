import bcrypt from "bcrypt";
import validator from "validator";
import User from "./../models/userModel.js";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

export const register = (req, res) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  if (name === "" || email === "" || password === "") {
    res
      .status(401)
      .json({ success: false, message: "Provide all blank fields" });
  } else {
    User.find({ email })
      .then((result) => {
        if (result.length) {
          res.status(401).json({
            success: false,
            message: "This user is already in our DB",
          });
        } else {
          if (!validator.isLength(name, { min: 2, max: 50 })) {
            res.status(401).json({
              success: false,
              message: "Name must be between 2 and 50 characters",
            });
          } else if (!validator.isEmail(email)) {
            res
              .status(401)
              .json({ success: false, message: "Invalid email format" });
          } else if (
            !validator.isStrongPassword(password, {
              minLength: 6,
              minUppercase: 1,
              minLowercase: 1,
              minNumbers: 1,
              minSymbols: 1,
            })
          ) {
            res.status(401).json({
              success: false,
              message:
                "Password must have at least 6 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
            });
          } else {
            const saltRounds = 10;
            bcrypt
              .hash(password, saltRounds)
              .then((hashedPassword) => {
                const newUser = new User({
                  name,
                  email,
                  password: hashedPassword,
                });
                newUser
                  .save()
                  .then((result) => {
                    const token = createToken(result._id);
                    res.status(200).json({
                      success: true,
                      message: "User saved to the DB succesfuly",
                      user: result,
                      token: token,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(401).json({
                      success: false,
                      message: "error occured while saving user",
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(401).json({
                  success: false,
                  message: "error occured while hashing password",
                });
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json({
          success: false,
          message: "Error occured while checking wheter user in DB or not",
        });
      });
  }
};

export const login = (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();
  if (email === "" || password === "") {
    res
      .status(401)
      .json({ success: false, message: "Provide all blank fields" });
  } else {
    User.find({ email })
      .then((data) => {
        if (data.length) {
          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                const token = createToken(data[0]._id);
                res.status(200).json({
                  success: true,
                  message: "user login succesfully",
                  user: data,
                  token,
                });
              } else {
                res.status(401).json({
                  success: false,
                  message: "invalid credentials",
                });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(401).json({
                success: false,
                message: "Error occured while comparing given password",
              });
            });
        } else {
          res.status(401).json({
            success: false,
            message: "user doesn't exist",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json({
          success: false,
          message:
            "Error occured while checking whether this email in our DB or not",
        });
      });
  }
};

export const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    } else {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.status(200).json({
        success: true,
        token,
      });
    }
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err,
    });
  }
};
