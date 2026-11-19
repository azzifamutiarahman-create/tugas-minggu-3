import TodoItem from "./TodoItem";

function TodoList({ todos, onToggle, onHapus }) {
  if (todos.length === 0) {
    return (
      <ul id="list-todo">
        <li>
          <span className="teks">Belum ada tugas. Tambahkan!</span>
        </li>
      </ul>
    );
  }

  return (
    <ul id="list-todo">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onHapus={onHapus}
        />
      ))}
    </ul>
  );
}

export default TodoList;