import express from "express";
import todoRoutes from "./routes/todoRoutes.js";
import statRoutes from "./routes/statRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import upgradeRoutes from "./routes/upgradeRoutes.js";
import { connect } from "mongoose";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/ratelimiter.js";
import cors from  "cors";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


app.use(express.json());
app.use(rateLimiter);
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());

app.use("/api/todos", todoRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upgrades", upgradeRoutes);

connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log("server is running at port:", PORT);
    });
});

