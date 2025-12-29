import React from 'react';
import { useState, useEffect } from 'react';


const TodoComponent = ({ user }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
  if (!user) {
    setTodos([]);
    return;
  }

  fetchTodos();
}, [user]);

  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/todos", {
        credentials: "include"
      });

      const data = await res.json();

      if(!res.ok) throw new Error(data.message || "Failed to fetch todos");
      
      setTodos(data);
    } catch (error) {
      setError(error.message);
    }
  }

  const addTodo = async (e) => {
    e.preventDefault();

    if(!newTodo.trim()) return;

    try {
      const res = await fetch("http://localhost:5001/api/todos", {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newTodo})
      });
      const data = await res.json();

      if(!res.ok) throw new Error(data.message || "You have to login!");
      setTodos((prev) => [...prev, data]);
      setNewTodo("");
    } catch (error) {
      setError(error.message);
    }
  }

  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/todos/${id}`,{
        method: "PATCH",
        credentials: "include"
      });
      const data = await res.json();

      if(!res.ok) throw new Error(data.message || "Failed to toggle todo");

      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? data : todo)) 
      );
    } catch (error) {
      setError(error.message);
    }
  }

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/todos/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.json();

      if(!res.ok) throw new Error(data.message || "Failed to delete todo");

      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">My Todos</h2>

      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="input input-bordered flex-1"
          required
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div
              onClick={() => toggleTodo(todo._id)}
              className={`flex-1 cursor-pointer ${
                todo.done ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.content}
            </div>

            <button
              onClick={() => deleteTodo(todo._id)}
              className="btn btn-sm btn-error"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoComponent;
