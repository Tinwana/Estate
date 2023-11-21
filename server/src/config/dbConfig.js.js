import mongoose from "mongoose";

async function connectDb() {
  try {
    const url = process.env.DATABASE_URL;
    const trueUrl = url.toString();
    console.log(trueUrl);
    await mongoose.connect(trueUrl);
    console.log("connect successful!");
  } catch (err) {
    console.log("connect failure!", err);
  }
}

export { connectDb };
