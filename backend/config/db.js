import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connectted: ${conn.connection.host}`.cyan.underline);
  } catch (err) {
    console.log(`error occured while connecting DB err: ${err}`);
    process.exit(1);
  }
};
