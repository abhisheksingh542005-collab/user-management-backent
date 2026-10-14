import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. Token missing or invalid format!" });
  }

  const token = authHeader.split(" ")[1];

  // --- DEBUGGING LOGS ---
  console.log("--- TOKEN RECEIVED ON SERVER ---");
  console.log("Token Value:", JSON.stringify(token));
  console.log("--------------------------------");

  try {
    const verified = jwt.verify(token, "secretkey123");
    req.user = verified;
    next();
  } catch (error) {
    console.log("JWT Verification Error Message:", error.message);
    return res.status(400).json({ message: "Invalid token!" });
  }
};

export const isAdmin = (req, res, next) => {
  
    next();
};