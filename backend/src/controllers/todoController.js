import Todo from "../models/Todo.js";

export async function getTodos(req, res) {
    try {
        const user_id = req.user._id;

        const todos = await Todo.find({user_id}).lean();
        res.status(200).json(todos);

    } catch (error) {
        console.error("Error in getTodos method");
        res.status(500).json({ message: "internal server error" });
    }
}

export async function createTodo(req, res) {
    try {
        const user_id = req.user._id;
        const { content } = req.body; 
         
        const todo = await Todo.create({content, user_id});
        res.status(201).json(todo);
    } catch (error) {
        console.error("Error in createTodo method", error);
        res.status(500).json({ message: "internal server error" });   
    }
}


export async function updateTodo(req, res) {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            user_id: req.user._id
        });

        if (!todo) {
            return res.status(404).json({ message: "todo not found" });
        }

        todo.done = !todo.done;
        await todo.save();

        res.status(200).json(todo);

    } catch (error) {
        console.error("Error in updateTodo method");
        res.status(500).json({ message: "internal server error" });
    }
}

export async function deleteTodo(req, res) {
    try {
        const deletedTodo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user._id
        });

        if (!deletedTodo) {
            return res.status(404).json({ message: "todo not found" });
        }

        res.status(200).json({ message: "todo deleted successfully" });

    } catch (error) {
        console.error("Error in deleteTodo method");
        res.status(500).json({ message: "internal server error" });
    }
}
