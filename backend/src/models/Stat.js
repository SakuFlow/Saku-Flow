import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
    suns: {
        type: Number, 
        default: 0,
        min: 0
    },
    
    energy: {
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