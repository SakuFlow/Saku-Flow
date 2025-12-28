import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    content: {
        type:String, 
        required: true
    },

    done: {
        type:Boolean,
        default: false
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;