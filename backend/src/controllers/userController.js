import { errors } from "@upstash/redis";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import e from "express";
import jwt from "jsonwebtoken";


const createAccessToken = (_id) =>
    jwt.sign({ _id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });

const createRefreshToken = (_id) =>
    jwt.sign({ _id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });


export async function getUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsers method");
        res.status(500).json({ message: "internal server error" });
    }
}

export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(404).json({ message: "user not found" });
        }

        res.status(200).json({ _id: user._id, username: user.username, email: user.email });
    } catch (error) {
        console.error("Error in getUsers method");
        res.status(500).json({ message: "internal server error" });
    }
}

export async function logoutUser(req, res) {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logoutUser:", error);
        res.status(500).json({ message: "internal server error" });
    }
}

export async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            throw new Error("All fields are required");
        }

        const exists = await User.findOne({ email });
        if(exists){
            throw new Error("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });

        const accessToken = createAccessToken(newUser._id);
        const refreshToken = createRefreshToken(newUser._id);

        newUser.refreshToken = refreshToken;

        await newUser.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ email });
    } catch (error) {
        console.error("Error in registerUser method:", error); 
        res.status(500).json({ message: "internal server error" });   
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            throw new Error("All fields must be filled");
        }

        const user = await User.findOne({ email });

        if(!user){
            throw new Error("Invalid email");      
        }


        const match = await bcrypt.compare(password, user.password);

        if(!match){
            throw Error("Incorrect Password");
        }

        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        user.refreshToken = refreshToken;

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ email });

    } catch (error) {
        console.error("Error in registerUser method");
        res.status(500).json({ message: "internal server error" });
    }
}


export async function updateUser(req, res){
    try {
        const { username } = req.body;

        if(!username) {
            return res.status(400).json({ message: "Username is required "});
        }

        const exists = await User.findOne({ username });
        if(exists){
            return res.status(400).json({ message: "Username already taken" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { username },
            { new: true }
        );
        
        res.status(200).json({ 
            message: "Username updated successfully", 
            username: updatedUser.username
        });

    } catch (error) {
        console.error("Error in updateUser method");
        res.status(500).json({ message: "internal server error" }); 
    }
}

export async function deleteUser(req, res){
    try {
        const deletedUser = await User.findByIdAndDelete(req.user._id);

        if (!deletedUser) {
            return res.status(404).json({ message: "404 User not found" });
        }
        res.status(200).json({ message: "User deleted succressfully!!" });

    } catch (error) {
        console.error("Error in deleteUser method");
        res.status(500).json({ message: "internal server error" }); 
    }
}

export async function refresh(req, res) {
    const token = req.cookies.refreshToken;

    if(!token){
        return res.status(401).json({ error: "No refresh token" });
    }

    try {
        const { _id } = jwt.verify(token, process.env.REFRESH_SECRET);
        const user = await User.findById(_id);

        if(!user || user.refreshToken !== token){
            return res.status(403).json({ error: "invalid refresh token" });
        }

        const newAccesToken = createAccessToken(user._id);

        res.cookie("accessToken" , newAccesToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({  message: "Access token refreshed "});
    } catch (error) {
        return res.status(403).json({ error: "Invalid refresh token" });
    }
}