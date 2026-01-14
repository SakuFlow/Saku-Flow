import express from "express";
import todoRoutes from "./routes/todoRoutes.js";
import statRoutes from "./routes/statRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import upgradeRoutes from "./routes/upgradeRoutes.js";
import achievementRoutes from "./routes/achievementsRoutes.js"
import { connect } from "mongoose";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/ratelimiter.js";
import cors from  "cors";
import cookieParser from "cookie-parser";
import path from "path";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


app.use(express.json());
app.use(rateLimiter);

if(process.env.NODE_ENV !== "production"){
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));
}

app.use(cookieParser());

app.use("/api/todos", todoRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upgrades", upgradeRoutes);
app.use("/api/achievements", achievementRoutes);

if(process.env.NODE_ENV === "production"){
    const frontendPath = path.join(__dirname, "../frontend/dist");

    app.use(express.static(frontendPath));

    app.use((req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log("server is running at port:", PORT);
    });
});

