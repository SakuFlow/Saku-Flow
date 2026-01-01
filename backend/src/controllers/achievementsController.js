import Achievements from "../models/Achievements.js";
import Stat from "../models/Stat.js";
import { ACHIEVEMENTS } from "../constants/gameRules.js";

export async function getAchievements(req, res) {
    try {
        const user_id = req.user._id;

        const achievements = await Achievements.findOne({ user_id }).lean();
        res.status(200).json(achievements ?? { achievements: {} });

    } catch (error) {
        console.error("Error in getAchievements method");
        res.status(500).json({ message: "internal server error" });
    }
}


export async function checkAchievements(req, res) {
    try {
        const userId = req.user._id;

        const stats = await Stat.findOne({ user_id: userId });
        if(!stats) return res.status(404).json({ message: "Stats not found"} );

        const { suns, energy, overall } = stats;


        let userAch = await Achievements.findOne({ user_id: userId });
        if(!userAch) return res.status(404).json({ message: "Achievements not found"} );


        for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
            if (achievement.suns && suns >= achievement.suns) {
                if (!userAch.achievements.get(id)){
                    userAch.achievements.set(id, true);
                }
            }
        }

        await userAch.save();

    } catch (error) {
        console.error("Error in checkAchievements method");
        res.status(500).json({ message: "internal server error" });
    }
}