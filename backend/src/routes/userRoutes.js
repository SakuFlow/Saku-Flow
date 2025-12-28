import express from "express";
import { deleteUser, getUsers, loginUser, refresh, registerUser, updateUser } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();

router.get("/", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);
router.post("/auth/refresh", refresh);

export default router;