import mongoose from "mongoose";

const connecttomongo = async () => {
  try {
    // Agar pehle se connected hai toh dubara connect mat karo
    if (mongoose.connections[0].readyState) {
      return;
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "user-management-db",
      bufferCommands: true, // Ise true rakhein ya hata dein
    });
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connecttomongo;