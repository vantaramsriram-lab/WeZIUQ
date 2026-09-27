import mongoose from "mongoose";
const connectDB = async () => {
  if (!process.env.DB_URI) {
    console.error("Error: DB_URI is not defined in environment variables");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.DB_URI)
    console.log("MongoDB Connected Successfully", conn.connection.name)
  } catch (err) {
    console.error("Error! While connecting the database", err.message)
    process.exit(1)
  }
}
export default connectDB