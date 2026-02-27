import Database from "better-sqlite3";

export function connectToDatabase(path) {
  const sqlite = new Database(path);

  return {
    listItems() {
      return sqlite.prepare("SELECT * FROM items ORDER BY id").all();
    },

    getItem(id) {
      return sqlite
        .prepare("SELECT * FROM items WHERE id = ?")
        .get(id);
    },

    createItem(name, notes) {
      return sqlite
        .prepare("INSERT INTO items (name, notes) VALUES (?, ?)")
        .run(name, notes);
    },

    updateItem(id, name, notes) {
      return sqlite
        .prepare("UPDATE items SET name = ?, notes = ? WHERE id = ?")
        .run(name, notes, id);
    },

    deleteItem(id) {
      return sqlite
        .prepare("DELETE FROM items WHERE id = ?")
        .run(id);
    }
  };
}