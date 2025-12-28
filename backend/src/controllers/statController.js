import mongoose from "mongoose";
import Stat from "../models/Stat.js";

export async function getStats(req, res) {
    try {
        const stats = await Stat.find({ user_id: req.user._id }).lean();
        res.status(200).json(stats);
    } catch (error) {
        console.error("Error in getStats method:", error);
        res.status(500).json({ message: "internal server error" });
    }
}

export async function createStat(req, res) {
    try {
        const user_id = req.user._id;
        const { day, month, overall } = req.body;

        if (day < 0 || month < 0 || overall < 0) {
            return res.status(400).json({ message: "Values must be >= 0" });
        }

        const newStat = new Stat({ day, month, overall, user_id });
        const savedStat = await newStat.save();

        res.status(201).json(savedStat);
    } catch (error) {
        console.error("Error in createStat method:", error);
        res.status(500).json({ message: "internal server error" });
    }
}

export async function updateStat(req, res) {
    try {
        const { day, month, overall } = req.body;

        if (day < 0 || month < 0 || overall < 0) {
            return res.status(400).json({ message: "Values must be >= 0" });
        }

        const updatedStat = await Stat.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user._id },
            { day, month, overall },
            { new: true }
        );

        if (!updatedStat) {
            return res.status(404).json({ message: "Stat not found" });
        }

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
