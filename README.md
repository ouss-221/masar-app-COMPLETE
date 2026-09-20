# Masar — project scaffold

Same stack as the purchase-management thesis (Spring Boot + Spring Security + Spring Data JPA
+ MySQL, Docker), with a React frontend that Capacitor wraps into the Android/iOS builds.

## What's here

```
masar-app/
  backend/     Spring Boot API (Java 17, Maven)
  frontend/    React + Vite app, Capacitor-ready
  docker-compose.yml
```

## Running it locally

1. **Backend + database**
   ```bash
   docker compose up --build
   ```
   This starts MySQL and the Spring Boot API on http://localhost:8080.
   Tables are auto-created on first run (`ddl-auto: update`) — there's no seed data yet,
   so `/api/sections` will return an empty list until you add rows (via a data.sql file,
   a small admin endpoint, or directly in MySQL — happy to add whichever you prefer).

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Runs on http://localhost:5173 and talks to the backend at localhost:8080.

## What's implemented vs. what's next

Done:
- Auth (register/login, JWT)
- Guide sections, served from the database (editable without an app update)
- Personal checklist with per-user progress, synced through the API
- Sponsor placements per section, clearly labeled, kept separate from editorial content
- PDF export of the checklist (PDFBox, same library as the thesis)
- Docker Compose for local dev, matching the thesis deployment approach

Next, when you're ready:
- Seed the database with the actual guide content (from the HTML prototype)
- An admin-only endpoint or small admin UI to edit sections/sponsors without touching the DB directly
- Wrapping the frontend build with Capacitor for the Android/iOS builds
- Swapping the dev JWT secret and CORS origins for real production values before deploying

## Getting to a mobile build (once the web app works)

```bash
cd frontend
npm run build
npx cap add android
npx cap add ios       # only from a Mac, or via Codemagic/Appflow as discussed
npx cap sync
npx cap open android  # opens Android Studio
```
