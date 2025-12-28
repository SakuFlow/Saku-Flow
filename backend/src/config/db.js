import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected succressfully");
    } catch (error) {
        console.error("error connectung to mongodb", error);
        process.exit(1);
    }
};