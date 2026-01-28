import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUri = process.env.REACT_APP_BACKEND_URI || "";

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${backendUri}/toDoList`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [backendUri]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${backendUri}/newToDo`, {
        text: newTodo.trim()
      });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error creating todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUri}/deleteToDo?id=${id}`);
      await fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Todo List</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newTodo.trim()}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No todos yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo._id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50"
            >
              <span className="text-gray-800 flex-1">{todo.text}</span>
              <button
                onClick={() => handleDelete(todo._id)}
                className="ml-3 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
