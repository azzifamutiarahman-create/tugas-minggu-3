import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoStats from "./components/TodoStats";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem("todos")) || [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function tambahTodo(teks) {
    const baru = {
      id: Date.now(),
      teks: teks.trim(),
      selesai: false,
    };
    setTodos((prev) => [...prev, baru]);
  }

  function toggleSelesai(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, selesai: !todo.selesai } : todo
      )
    );
  }

  function hapusTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <div className="app">
      <h1>📝 To-Do List</h1>
      <TodoForm onTambah={tambahTodo} />
      <TodoStats todos={todos} />
      <TodoList todos={todos} onToggle={toggleSelesai} onHapus={hapusTodo} />
    </div>
  );
}

export default App;