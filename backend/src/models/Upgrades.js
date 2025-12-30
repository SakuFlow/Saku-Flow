import mongoose from "mongoose";

const upgradesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  upgrades: {
    type: Map,  
    of: Number,
    default: {}
  }
});

const Upgrades = mongoose.model("Upgrades", upgradesSchema);

export default Upgrades;
