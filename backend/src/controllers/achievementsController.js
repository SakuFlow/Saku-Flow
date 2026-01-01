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



/*
Right now the following function is only for the suns..
In the future (tomorrow) i need to add energy and overall too :)
*/
export async function checkAchievements(userId) {
    const stats = await Stat.findOne({ user_id: userId });
    if (!stats) return;

    const { suns, energy, overall } = stats;

    let userAch = await Achievements.findOne({ user_id: userId });
    if (!userAch) {
        //throw new Error("achievements don't exist");
        userAch = await Achievements.create({
            user_id: userId,
            achievements: {}
        });
    }

    for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (achievement.suns !== undefined && suns >= achievement.suns) {
            if (!userAch.achievements.get(id)) {
                userAch.achievements.set(id, true);
            }
        }
    }

    await userAch.save();
}