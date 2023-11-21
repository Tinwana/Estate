import mongoose from "mongoose";
const mongooseOptions = {
  dbName: "auth", // Replace with your actual database name
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
async function connectDb() {
  try {
    const url = process.env.DATABASE_URL;
    const trueUrl = url.toString();
    console.log(trueUrl);
    await mongoose.connect(trueUrl, { dbName: "auth" });
    console.log("connect successful!");
  } catch (err) {
    console.log("connect failure!", err);
  }
}

export { connectDb };
