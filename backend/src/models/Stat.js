import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
    day: {
        type: Number, 
        default: 0,
        min: 0
    },
    
    month: {
        type: Number,
        default: 0,
        min: 0
    },

    overall: {
        type: Number,
        default: 0,
        min: 0
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Stat = mongoose.model("Stat", statSchema);

export default Stat;