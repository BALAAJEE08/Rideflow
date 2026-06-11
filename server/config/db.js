import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Connected:", conn.connection.host);
  } catch (err) {
    console.log("FULL ERROR:");
    console.dir(err, { depth: null });
    process.exit(1);
  }
};