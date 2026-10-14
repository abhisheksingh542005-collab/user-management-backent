import usermodel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class usercontroller {

  // 1. Get All Users with Search, Filter & Pagination
  static getallusers = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const search = req.query.search || "";
      const genderFilter = req.query.gender || "";

      const query = {
        isDeleted: false,
        $or: [
          { name: { $regex: search,$options: "i" } },
          { email: { $regex: search,$options: "i" } }
        ]
      };

      if (genderFilter) {
        query.gender = genderFilter;
      }

      const total = await usermodel.countDocuments(query);
      const fetchAllUsers = await usermodel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password"); // Password hide rakhenge response me

      return res.status(200).json({
        total,
        page,
        pages: Math.ceil(total / limit),
        users: fetchAllUsers
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  // 2. Register / Create New User (With Password Hashing)
  static createnewsuser = async (req, res) => {
    try {
      const { name, email, password, gender, city } = req.body;

      if (!name || !email || !password || !gender || !city) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      const isemail = await usermodel.findOne({ email });
      if (isemail) {
        return res.status(400).json({ message: "Email already exists!" });
      }

      // Password Hash karna secure banane ke liye
      const hashedPassword = await bcrypt.hash(password, 10);
      

      const newuser = await usermodel.create({
        name,
        email,
        password: hashedPassword,
        role:"admin",
        gender,
        city,
        
      });

      return res.status(201).json({ 
        message: "User successfully registered!", 
        user: newuser 
      });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  // 3. User Login
  static loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await usermodel.findOne({ email, isDeleted: false });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: "Your account is blocked by admin." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password!" });
      }

      // JWT Token Generate karna
      // usercontroller.js line 105
const token = jwt.sign(
  { id: user._id, role: user.role }, 
  "secretkey123", 
  { expiresIn: "1d" }
);

      return res.status(200).json({ 
        message: "Login successful", 
        token, 
        user 
      });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  // 4. Toggle User Status (Block / Unblock)
  static toggleUserStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await usermodel.findById(id);
      
      if (!user) return res.status(404).json({ message: "User not found!" });

      user.isActive = !user.isActive;
      await user.save();

      return res.status(200).json({ 
        message: `User is now ${user.isActive ? "Active" : "Blocked"}` 
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  // 5. Soft Delete User
  static softDeleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      await usermodel.findByIdAndUpdate(id, { isDeleted: true });
      return res.status(200).json({ message: "User soft deleted successfully!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

export default usercontroller;