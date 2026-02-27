# Web Programming II – Full-Stack CRUD Application

## Overview

This project is a small full-stack web application built with:

- **Node.js**
- **Express**
- **EJS (server-rendered templates)**
- **SQLite (via better-sqlite3)**
- **Bootstrap 5**
- **Google Material Icons**

It demonstrates a complete CRUD system implemented in two layers:

- A **JSON REST API** under `/api`
- A **server-rendered UI** under `/items`

Both layers share a single SQLite database and are architecturally separated using a database abstraction module.

---

## Features

### API (Programmatic Interface)

All API routes return JSON.

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/items` | List all items |
| GET | `/api/items/:id` | Get one item |
| POST | `/api/items` | Create an item |
| PUT | `/api/items/:id` | Update an item |
| DELETE | `/api/items/:id` | Delete an item |
| GET | `/api/pi` | Returns a JSON approximation of π |

Example response:

```json
[
  { "pi": 3.14159 }
]
```

---

### UI (Browser Interface)

Human-friendly pages rendered with EJS:

| Route | Description |
|-------|-------------|
| `/items` | List all items |
| `/items/create` | Create new item |
| `/items/update/:id` | Update existing item |
| `/items/delete/:id` | Delete item (UI convenience route) |

The UI uses:
- Bootstrap for layout and styling
- Material Icons for edit/delete actions
- Server-side rendering (no frontend framework)

---

## Architecture

This project follows separation of concerns.

### Server Layer

Handles:
- Routing
- HTTP validation
- Response formatting

The server does not contain SQL.

### Database Module (`database.js`)

Handles:
- All SQL queries
- SQLite connection
- CRUD methods

The server interacts only with:

```js
db.listItems()
db.getItem(id)
db.createItem(name, notes)
db.updateItem(id, name, notes)
db.deleteItem(id)
```

If the database engine changes, only `database.js` must be modified.

---

## Project Structure

```
.
├── example-simple-express-server.js
├── database.js
├── app.db
├── views/
│   ├── items-list.ejs
│   ├── items-create.ejs
│   └── items-update.ejs
├── static/
├── package.json
└── README.md
```

---

## Running Locally

### 1. Install dependencies

```
npm install
```

### 2. Start the server

```
node example-simple-express-server.js
```

Server runs at:

```
http://localhost:8080
```

---

## Database

- SQLite database stored in `app.db`
- No external database server required
- Single-file persistence

---

## Deployment

The project can be deployed to platforms such as Render.

Important:
- Ensure Node 20 LTS is used
- Do not commit `node_modules`
- SQLite files on cloud platforms may not persist unless configured

---

## Educational Purpose

This project demonstrates:

- Express routing fundamentals  
- RESTful API design  
- Server-rendered UI with templates  
- HTML form handling (GET/POST patterns)  
- HTTP status codes  
- Separation of concerns  
- Refactoring for maintainability  
- Database abstraction patterns  

It intentionally avoids frontend frameworks to focus on backend structure and architecture.

---

## License

This project is provided for educational purposes.
