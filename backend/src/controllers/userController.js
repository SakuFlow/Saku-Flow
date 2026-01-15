import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Upgrades from "../models/Upgrades.js";
import Stat from "../models/Stat.js";
import Achievements from "../models/Achievements.js";
import Todo from "../models/Todo.js";

const createAccessToken = (_id) =>
    jwt.sign({ _id }, process.env.ACCESS_SECRET, { expiresIn: "50m" });

const createRefreshToken = (_id) =>
    jwt.sign({ _id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

export async function getUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch {
        res.status(500).json({ message: "internal server error" });
    }
}

export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "user not found" });
        res.status(200).json({ _id: user._id, username: user.username, email: user.email });
    } catch {
        res.status(500).json({ message: "internal server error" });
    }
}

export async function logoutUser(req, res) {
    try {
        await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logged out successfully" });
    } catch {
        res.status(500).json({ message: "internal server error" });
    }
}

export async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" });

        const lowEmail = email.toLowerCase();
        const exists = await User.findOne({ email: lowEmail });
        if (exists) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email: lowEmail, password: hashedPassword });

        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        user.refreshToken = refreshToken;

        await user.save();

        await Promise.all([
            Stat.create({ user_id: user._id, suns: 0, energy: 0, overall: 0 }),
            Upgrades.create({ user_id: user._id, upgrades: {} }),
            Achievements.create({ user_id: user._id, achievements: {} })
        ]);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 50 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ email: lowEmail, username });
    } catch {
        res.status(500).json({ message: "internal server error" });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields must be filled" });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 50 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ email: user.email });
    } catch {
        res.status(500).json({ message: "internal server error" });
    }
}

export async function updateUser(req, res) {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ message: "Username is required" });

        const exists = await User.findOne({ username });
        if (exists) return res.status(400).json({ message: "Username already taken" });

        const updatedUser = await User.findByIdAndUpdate(req.user._id, { username }, { new: true });
        res.status(200).json({ username: updatedUser.username });
    } catch {
        res.status(500).json({ message: "internal server error" });
    }
}

export async function deleteUser(req, res) {
    try {
        const userId = req.user._id;

        await Promise.all([
            User.deleteOne({ _id: userId }),
            Upgrades.deleteOne({ user_id: userId }),
            Stat.deleteOne({ user_id: userId }),
            Todo.deleteMany({ user_id: userId }),
            Achievements.deleteOne({ user_id: userId })
        ]);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "User deleted successfully" });
    } catch {
        res.status(500).json({ message: "internal server error" });
    }
}

export async function refresh(req, res) {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    try {
        const { _id } = jwt.verify(token, process.env.REFRESH_SECRET);
        const user = await User.findById(_id);
        if (!user || user.refreshToken !== token) return res.status(403).json({ message: "Invalid refresh token" });

        const newAccessToken = createAccessToken(user._id);
        const newRefreshToken = createRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: "Access token refreshed" });
    } catch {
        res.status(403).json({ message: "Invalid refresh token" });
    }
}
