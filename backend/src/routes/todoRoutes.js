import express from "express";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../controllers/todoController.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();

router.get("/", auth, getTodos);
router.post("/", auth, createTodo);
router.patch("/:id", auth, updateTodo);
router.delete("/:id", auth, deleteTodo);

export default router;