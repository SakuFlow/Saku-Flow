import express from "express";
import { buyUpgrade } from "../controllers/upgradeController.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();

router.post("/buy-upgrade", auth, buyUpgrade);

export default router;