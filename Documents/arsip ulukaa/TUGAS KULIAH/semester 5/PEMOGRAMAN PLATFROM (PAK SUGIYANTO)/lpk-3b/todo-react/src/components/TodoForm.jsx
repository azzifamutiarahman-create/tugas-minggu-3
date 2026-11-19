import { useState } from "react";

function TodoForm({ onTambah }) {
  const [teks, setTeks] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!teks.trim()) return;
    onTambah(teks);
    setTeks("");
  }

  return (
    <form id="form-todo" onSubmit={handleSubmit}>
      <input
        type="text"
        id="input-todo"
        placeholder="Tulis tugas baru..."
        value={teks}
        onChange={(e) => setTeks(e.target.value)}
        required
      />
      <button type="submit">Tambah</button>
    </form>
  );
}

export default TodoForm;