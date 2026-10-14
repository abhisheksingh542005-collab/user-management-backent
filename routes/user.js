import express from "express";
import multer from "multer";
import usercontroller from "../controller/user.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();



// Public Routes
router.post("/register",  usercontroller.createnewsuser);
router.post("/login", usercontroller.loginUser);

// Admin & Protected Routes (Search, Filter, Pagination, Status Toggle)
router.get("/users", verifyToken, isAdmin, usercontroller.getallusers);
router.patch("/users/:id/status", verifyToken, isAdmin, usercontroller.toggleUserStatus);
router.delete("/users/:id/soft-delete", verifyToken, isAdmin, usercontroller.softDeleteUser);

export default router;