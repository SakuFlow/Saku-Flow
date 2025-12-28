import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function auth(req, res, next) {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const { _id } = jwt.verify(token, process.env.ACCESS_SECRET); // ✅ use ACCESS_SECRET
        req.user = await User.findById(_id).select("_id");
        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
}
