function TodoStats({ todos }) {
  const belumSelesai = todos.filter((todo) => !todo.selesai).length;

  return <p id="stats">{belumSelesai} tugas belum selesai</p>;
}

export default TodoStats;