import express from "express";
import cors from "cors";
import connectToMongo from "./config/models/db.js";
import userroutes from"./routes/user.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(async (req, res, next) => {
  await connectToMongo();
  next();
});


// Baaki middleware ke sath ye add kar
// index.js me ye line zaroor
//  add karein agar nahi hai:
app.use("/public", express.static("public"));
//routes

app.use("/api/v1",userroutes);


app.listen(port, () => {
  console.log(`API is running on http://localhost:${port}`);
});