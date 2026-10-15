import mongoose from "mongoose";

const connectToMongo = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, // Connection na hone par queries hanging block kar dega
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};

export default connectToMongo;