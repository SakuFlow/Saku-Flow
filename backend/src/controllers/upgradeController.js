import { UPGRADE_SHOP } from "../constants/gameRules.js";
import Upgrades from "../models/Upgrades.js";
import Stat from "../models/Stat.js";

function calculatePrice(basePrice, multiplier, level) {
    return Math.floor(basePrice * Math.pow(multiplier, level));
}

export async function getUpgrades(req, res) {
    try {
        const user_id = req.user._id;

        const upgrades = await Upgrades.findOne({ user_id }).lean();
        res.status(200).json(upgrades ?? { upgrades: {} });

    } catch (error) {
        console.error("Error in getUpgrades method");
        res.status(500).json({ message: "internal server error" });
    }
}

export async function buyUpgrade(req, res) {
    try {
        const userId = req.user._id;
        const { upgradeName } = req.body;

        if(!upgradeName){
            return res.status(400).json({ message: "upgradeName is required" });
        }

        const shopItem = UPGRADE_SHOP[upgradeName];

        if(!shopItem){
            return res.status(400).json({ message: "invalid upgrade" });
        }

        // get users current upgrade
        const upgradeDoc = await Upgrades.findOne({ user_id: userId });
        const currentLevel = upgradeDoc?.upgrades.get(upgradeName) || 0;

        // calculate the price
        const price = calculatePrice(
            shopItem.basePrice,
            shopItem.priceMultiplier,
            currentLevel
        );

        // get users stats
        const stat = await Stat.findOne({ user_id: userId });
        if(!stat || stat.suns < price){
            return res.status(400).json({ message: "not enough suns" });
        }

        // reduce suns
        stat.suns -= price;
        await stat.save();


        // increase upgrade level
        const updatedUpgrades = await Upgrades.findOneAndUpdate(
            { user_id: userId },
            { $inc: { [`upgrades.${upgradeName}`]: 1 } },
            { upsert: true, new: true }
        );

        res.status(200).json({
            upgrades: updatedUpgrades.upgrades,
            suns: stat.suns
        });

    } catch (error) {
        console.error("Error in buyUpgrade method:", error);
        res.status(500).json({ message: "internal server error" });
    }
}


export async function deleteUpgrades(req, res) {
    try {
        const deletedUpgrades = await Upgrades.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user._id
        });

        if (!deletedUpgrades) {
            return res.status(404).json({ message: "upgrades not found" });
        }

        res.status(200).json({ message: "upgrades deleted successfully" });

    } catch (error) {
        console.error("Error in deleteUpgrades method");
        res.status(500).json({ message: "internal server error" });
    }
}
