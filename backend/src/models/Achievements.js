import mongoose from "mongoose";

const achievementsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  achievements: {
    type: Map,  
    of: Boolean,
    default: {}
  }
});

const Achievements = mongoose.model("Achievements", achievementsSchema);

export default Achievements;
