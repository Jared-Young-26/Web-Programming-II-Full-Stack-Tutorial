import express from "express";
import { connectToDatabase } from "./database.js";

const db = connectToDatabase("app.db");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("static"));

app.set("view engine", "ejs");

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.type("text/html").send("<html><body>Hello!</body></html>");
});

app.get("/hello", (req, res) => {
  res.type("text/plain").send("Hello!");
});

app.get("/hello/:name", (req, res) => {
  res.type("text/plain").send(`Hello, ${req.params.name}!`);
});

app.get("/goodbye", (req, res) => {
  res.type("text/plain").send("Goodbye!");
});

app.get("/birthday", (req, res) => {
  res.type("text/plain").send("Happy Birthday!");
});

app.get("/birthday/:name", (req, res) => {
  res.type("text/plain").send(`Happy Birthday, ${req.params.name}!`);
});

// GET all
app.get("/api/items", (req, res) => {
  try {
    res.json(db.listItems());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET one
app.get("/api/items/:id", (req, res) => {
  try {
    const item = db.getItem(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST (Create)
app.post("/api/items", (req, res) => {
  const { name, notes } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required" });
  }

  const notesValue = notes ?? "";

  if (typeof notesValue !== "string") {
    return res.status(400).json({ error: "notes must be a string" });
  }

  try {
    const result = db.createItem(name, notesValue);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      notes: notesValue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT (Update)
app.put("/api/items/:id", (req, res) => {
  const { name, notes } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required" });
  }

  const notesValue = notes ?? "";

  if (typeof notesValue !== "string") {
    return res.status(400).json({ error: "notes must be a string" });
  }

  try {
    const result = db.updateItem(req.params.id, name, notesValue);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({
      id: Number(req.params.id),
      name,
      notes: notesValue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE (API)
app.delete("/api/items/:id", (req, res) => {
  try {
    const result = db.deleteItem(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------
   UI ROUTES (/items)
-------------------------- */

// List page
app.get("/items", (req, res) => {
  try {
    res.render("items-list", { items: db.listItems() });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Show create form
app.get("/items/create", (req, res) => {
  res.render("items-create");
});

// Handle create form
app.post("/items/create", (req, res) => {
  const { name, notes } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).send("Name is required");
  }

  const notesValue = notes ?? "";

  if (typeof notesValue !== "string") {
    return res.status(400).send("Notes must be a string");
  }

  try {
    db.createItem(name, notesValue);
    res.redirect("/items");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// UI delete
app.get("/items/delete/:id", (req, res) => {
  try {
    const result = db.deleteItem(req.params.id);

    if (result.changes === 0) {
      return res.status(404).send("Item not found");
    }

    res.redirect("/items");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Show update form
app.get("/items/update/:id", (req, res) => {
  try {
    const item = db.getItem(req.params.id);

    if (!item) {
      return res.status(404).send("Item not found");
    }

    res.render("items-update", { item });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Handle update form
app.post("/items/update/:id", (req, res) => {
  const { name, notes } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).send("Name is required");
  }

  const notesValue = notes ?? "";

  if (typeof notesValue !== "string") {
    return res.status(400).send("Notes must be a string");
  }

  try {
    const result = db.updateItem(req.params.id, name, notesValue);

    if (result.changes === 0) {
      return res.status(404).send("Item not found");
    }

    res.redirect("/items");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.get("/api/pi", (req, res) => {
  res.json([
    { pi: 3.14159 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Simple Express server listening on http://localhost:${PORT}`);
});