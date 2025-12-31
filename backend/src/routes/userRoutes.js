import express from "express";
import { deleteUser, getCurrentUser, getUsers, loginUser, logoutUser, refresh, registerUser, updateUser } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();

router.get("/", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/", auth, updateUser);
router.delete("/", auth, deleteUser);
router.post("/auth/refresh", refresh);
router.get("/me", auth, getCurrentUser);
router.post("/logout", auth, logoutUser);

export default router;