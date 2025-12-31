import express from "express";
import { buyUpgrade, getUpgrades } from "../controllers/upgradeController.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();

router.post("/buy", auth, buyUpgrade);
router.get("/", auth, getUpgrades);

export default router;