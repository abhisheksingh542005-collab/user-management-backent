import mongoose from "mongoose";

const connectToMongo = () => {
  mongoose.connect("mongodb://127.0.0.1:27017/myDatabase")
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.error("Connection Error:", err));
};

export default connectToMongo;