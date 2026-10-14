import express from "express";
import cors from "cors";
import connecttomongo from "./config/models/db.js";
import userroutes from"./routes/user.js";

const app = express();
const port = process.env.PORT || 5000;

connecttomongo();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// index.js me ye line zaroor add karein agar nahi hai:
app.use("/public", express.static("public"));
//routes

app.use("/api/v1",userroutes);


app.listen(port, () => {
  console.log(`API is running on http://localhost:${port}`);
});