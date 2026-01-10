import mongoose from "mongoose";
import Stat from "../models/Stat.js";
import Upgrades from "../models/Upgrades.js";
import { BASE_VALUES, UPGRADE_SHOP } from "../constants/gameRules.js";
import { checkAchievements } from "./achievementsController.js";

export async function getStats(req, res) {
    try {
        const userId = req.user._id;

        const stats = await Stat.findOne({ user_id: userId }).lean();
        const userUpgrades = await Upgrades.findOne({ user_id: userId }).lean();

        res.status(200).json({
            suns: stats?.suns || 0,
            energy: stats?.energy || 0,
            upgrades: userUpgrades?.upgrades || {}, 
            overall: stats?.overall || 0
        });
    } catch (error) {
        console.error("Error in getStats method:", error);
        res.status(500).json({ message: "internal server error" });
    }
}

export async function handleConvertedEnergy(req, res) {
    try {
        const userId = req.user._id;
        const MIN = 50;

        const userStats = await Stat.findOne({ user_id: userId} );
        if(!userStats){
            return res.status(404).json({ message: "User stats not foudn"} );
        }

        let { convertedEnergy } = req.body;

        if(typeof convertedEnergy !== "number" || isNaN(convertedEnergy)){
            return res.status(400).json({ message: "Invalid energy value"})
        }
        convertedEnergy = Math.round(convertedEnergy);

        if (convertedEnergy < MIN) {
            return res.status(400).json({ message: `Energy must be at least ${MIN}` });
                }
        if (convertedEnergy > userStats.energy) {
            return res.status(400).json({ message: "Not enough energy" });
        }

        const updatedStats = await Stat.findOneAndUpdate(
            { user_id: userId, energy: { $gte: convertedEnergy } }, 
            {
                $inc: { convertedEnergy: convertedEnergy, energy: -convertedEnergy },
            },
            { new: true }
        );


        return res.status(200).json({
            message: "Energy converted successfully",
            energy: updatedStats.energy,
            convertedEnergy: updatedStats.convertedEnergy,
        });
    } catch (error) {
        console.error("Error in handleConvertedEnergy method:", error);
        res.status(500).json({ message: "internal server error" });
    }
}


export async function updateStat(req, res) {
    try {
        const userId = req.user._id;
        const { overall } = req.body;

        const userUpgrades = await Upgrades.findOne({ user_id: userId });

        const userStats = await Stat.findOne({ user_id: userId });

        let gainedSuns = BASE_VALUES.suns;

        let gainedEnergy = BASE_VALUES.energy;

        if (userUpgrades?.upgrades?.size > 0) {
            for (const [upgrade, level] of userUpgrades.upgrades) {
                const bonus = UPGRADE_SHOP[upgrade];
                if (!bonus) continue;

                if (bonus.suns) gainedSuns += bonus.suns * level;
                if (bonus.energy) gainedEnergy += bonus.energy * level;
            }
        }

        const updatedStat = await Stat.findOneAndUpdate(
            { user_id: userId },
            {
                $inc: {
                    suns: gainedSuns,
                    energy: gainedEnergy,
                    convertedEnergy: -userStats.convertedEnergy,
                    overall: overall
                }
            },
            { new: true, upsert: true }
        );
        await checkAchievements(userId);
        res.status(200).json(updatedStat);
    } catch (error) {
        console.error("Error in updateStat method:", error);
        res.status(500).json({ message: "internal server error" });
    }
}

export async function deleteStat(req, res) {
    try {
        const deletedStat = await Stat.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user._id
        });

        if (!deletedStat) {
            return res.status(404).json({ message: "Stat not found" });
        }

        res.status(200).json({ message: "Stat deleted successfully" });
    } catch (error) {
        console.error("Error in deleteStat method:", error);
        res.status(500).json({ message: "internal server error" });
    }
}
