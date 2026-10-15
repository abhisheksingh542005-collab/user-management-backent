import mongoose from "mongoose";

let isConnected = false;

const connectToMongo = async () => {
  if (isConnected) {
    return;
  }

  try {
    // Vercel serverless environment ke liye connection options
    const db = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, // Isse queries wait karke timeout hone ke bajaye direct error degi agar connection na ho
    });
    
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};

export default connectToMongo;