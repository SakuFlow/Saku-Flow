import express from "express";
import { getStats , updateStat, deleteStat, handleConvertedEnergy } from "../controllers/statController.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();

router.get("/", auth, getStats);
router.post("/", auth, updateStat);
router.post("/convert", auth, handleConvertedEnergy);
router.delete("/", auth, deleteStat);

export default router;