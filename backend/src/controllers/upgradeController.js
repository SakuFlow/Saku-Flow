import Upgrades from "../models/Upgrades.js";

export async function getUpgrades(req, res) {
    try {
        const user_id = req.user._id;

        const upgrades = await Upgrades.find({user_id}).lean();
        res.status(200).json(upgrades);

    } catch (error) {
        console.error("Error in getUpgrades method");
        res.status(500).json({ message: "internal server error" });
    }
}

export async function buyUpgrade(req, res) {
    try {
        const userId = req.user._id;
        const { upgradeName } = req.body;

        const updatedUpgrade = await Upgrades.findOneAndUpdate(
            { user_id: userId },
            { $inc: { [`upgrades.${upgradeName}`]: 1 }},
            { upsert: true, new: true }
        );

        res.status(200).json(updatedUpgrade);
    } catch (error) {
        console.error("Error in buyUpgrade method:", error);
        res.status(500).json({ message: "internal server error" });
    }
}


export async function deleteUpgrades(req, res) {
    try {
        const deletedUpgrades = await Todo.findOneAndDelete({
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
