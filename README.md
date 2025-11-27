<img src="https://res.cloudinary.com/dhigfwson/image/upload/v1763634040/favicon_yxbyqj.png" alt="LaraExpress mini-framework logo" width="100" height="100">

# LaraExpress Mini-Framework

(In Development Stage)

A lightweight Node.js + Express + Edge.js framework inspired by Laravel, designed for quick SSR projects with a familiar Blade-like syntax and clean MVC structure.

---

## ✨ Why LaraExpress?

- Laravel-inspired syntax and workflow
- Edge.js templating with Blade-like directives
- Tailwind CSS + JS modules ready out of the box
- Simple MVC structure for small business sites & rapid prototyping
- Developer-friendly and beginner-readable

---

## 📁 Folder Structure

```bash
laraexpress/
├── app/       # MVC logic: controllers, models, routes, view
├── config/    # Configuration (database connection, settings)
├── database/  # migrations
├── public/    # Compiled assets (ignored in git, kept with .gitkeep)
├── src/       # Source files: Tailwind input CSS, JS modules
├── tools/     # development runner useful tools e.g browser reload
├── .env       # Environment variables (ignored in git)
├── app.js     # Entry point
└── package.json
```

---

## 🚀 Installation

```bash
git clone <repo-url>
cd laraexpress
npm install
```

---

## ▶️ Running the App

```bash
npm link # to make sure lara cli is connected (run once only)
npm run dev   # start the development server
```

- Controllers → `app/Http/controllers/`
- Models → `app/Models/`
- Views → `app/Views/` (Edge.js)

---

## 🧠 How LaraExpress Works (Big Picture)

LaraExpress follows a clean Laravel-style flow:

```
Request → Router → Controller → Model → Database
                       ↓
                     View (Edge)
```

---

## 1️⃣ Conceptual Diagram (MVC Flow)

```
┌─────────────────────┐
│       Router        │
│ (routes/homepage.js)│
└─────────┬───────────┘
          │ calls
          ▼
┌─────────────────────┐
│    Controller       │
│ HomepageController  │
│ - constructor       │
│ - index(), show()   │
│ - destroy()         │
└─────────┬───────────┘
          │ uses
          ▼
┌─────────────────────┐
│       Model         │
│   HomepageModel     │
│ - all()             │
│ - find(id)          │
│ - delete(id)        │
└─────────┬───────────┘
          │ talks to
          ▼
┌─────────────────────┐
│      Database       │
│   PostgreSQL  │
└─────────────────────┘

Controller also renders:

┌─────────────────────┐
│        View         │
│ homepage/index.edge │
│ homepage/show.edge  │
└─────────────────────┘
```

### Flow Explanation

- Router → calls controller via `controllerAction()`
- Controller → handles logic + validation
- Model → talks to the database
- View → displays data using Edge templates

---

## cli helpers

```bash
lara make:controller Product
lara make:model Product
```

- These commands create bare-bones models and controllers for rapid development.

## additional cli helpers

```bash
lara make:migration products # make bare-bones migration schema
lara migrate # run migrations inside migrations folder
lara migrate:fresh # drop tables start fresh run migrations inside migrations folder(use in development only)
```

---

## ✅ Summary for Newbies

- Router decides which controller handles the URL
- Controller runs logic and validation
- Model communicates with database
- View displays the result

This keeps code clean, organized, and scalable — just like Laravel ❤️
