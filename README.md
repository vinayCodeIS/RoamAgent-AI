# Escapist — AI Travel Planner 🌍✈️

Escapist is a high-fidelity, full-stack AI-Driven Travel Itinerary Planner that helps travelers curate, visualize, and budget customized trips to global landmarks and vibrant destinations.

Powered by the state-of-the-art **Gemini API** and styled with an artistic, minimalist editorial design, Escapist provides comprehensive day-by-day sequence schedules, budget estimations, and real-time interactive coordinate routing maps.

---

## ✨ Features & Architecture Highlights

### 1. Interactive Geospatial Visualizer (`TripMap`)
*   **Day-by-Day Mapping**: Features a dynamic Leaflet-powered map utilizing clean, cartographic voyager tile overlays.
*   **Geocoding Sequence**: Integrates active OpenStreetMap Nominatim geocoding on the backend/frontend. It maps landmarks, shops, cafes, and hotels in sequence automatically.
*   **Dotted Trail Connectors**: Sequential dotted line connections map out the spatial transit route of each active day's schedules.
*   **Detailed Tooltip Popups**: Checkpoints include bespoke hover popups outlining schedules, description text, tags, and times of day.

### 2. Immersive Material Landscape Design (Real Imagery)
*   **Curated Inspirations**: Select from a grid of featured escapist escapes (Tokyo, Paris, Rome, NYC, Bali, Reykjavik) adorned with Unsplash-curated images.
*   **Dynamic cover imagery**: Displays local geographic cover headers that dynamically change based on your customized destination query.
*   **Hotel Visual Cards**: Hotel stay recommendations adapt visual theme cards (Luxury vs Mid vs Budget) paired with corresponding high-altitude architectural landscapes.

### 3. Responsive Mechanics & Bento Layouts
*   **Day List Button Fixes**: Fully responsive, bounds-contained Days sequence navigation. Prevents layout leaks or overflowing text tags by utilizing modular flex layouts, tight line-clamps, and custom shrink overrides (`min-w-0 w-full truncate shrink-0`).
*   **Refining Slider UI**: An intuitive slider for duration ranges (1–14 Days) paired with a real-time responsive status badge indicator overlay.
*   **Progress Tracking Bento Grid**: Interactive status dials highlighting actual expense spent relative to estimates alongside luggage packaging progression loops.
*   **Mobile Sidebar Drawer**: A fixed side drawer with high-fidelity `AnimatePresence` back-panel blankets that adapt comfortably from mobile to ultra-wide desktop viewpoints.

---

## 🛠️ Technology Stack & Justification

*   **Frontend**: React (v18), Vite, Tailwind CSS, Motion (Framer Motion).
*   **Mapping**: Leaflet JS (`leaflet`) along with vector icons from Lucide-React.
*   **Server Backend**: Express (v4), TypeScript via `tsx` (Dev mode) and `esbuild` for single-bundle static-routing production builds (`dist/server.cjs`).
*   **AI Orchestration**: Server-side Google Gemini Model integrations (strictly secure, zero browser Leak of API Secrets).
*   **Persistence**: Atomic local write JSON engine (`users.json`, `trips.json`) providing instantaneous state reads/updates.

---

## 🚀 Setup & Execution Guide

### Local Installation & Start

1.  **Clone / Download the workspace**:
    Ensure you have [Node.js (v18+)](https://nodejs.org/) installed.
2.  **Environment Setup**:
    Create a `.env` file at the root:
    ```env
    GEMINI_API_KEY=your_actual_gemini_api_key
    JWT_SECRET=add_a_strong_random_secret_string
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Run in development mode**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it.

---

## 🌍 GitHub Push & Production Deploy (Real-time Web Services)

To deploy Escapist online to run in real-time, perform the following tasks:

### Part A: Host your codebase on GitHub
1.  **Initialize git in the project root**:
    ```bash
    git init
    ```
2.  **Commit the files**:
    Make sure `.gitignore` already excludes `node_modules/`, `data/*.json`, and any local `.env` files containing your secrets.
    ```bash
    git add .
    git commit -m "feat: integrate dynamic maps, real imagery, and responsive bento layouts"
    ```
3.  **Create a public repository on [GitHub](https://github.com/)** (e.g. named `escapist-ai-travel`).
4.  **Link and push**:
    ```bash
    git remote add origin https://github.com/YOUR_GITHUB_USERNAME/escapist-ai-travel.git
    git branch -M main
    git push -u origin main
    ```

### Part B: Deploy to a Cloud Hosting provider (e.g., Render, Railway, or Fly.io)

Because Escapist is a **full-stack app** combining a **NodeJS Express backend** and a **Vite single-page frontend**, they must both be hosted on a platform that supports persistent backend applications. 

#### Option 1: Render.com (Highly Recommended)
1.  Sign in to [Render](https://render.com/) and click **New > Web Service**.
2.  Connect your newly pushed GitHub repository.
3.  Configure the service details:
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
4.  Add your secrets under the **Environment Variables** tab:
    *   `GEMINI_API_KEY` = *(Your Google Gemini Developer Credentials)*
    *   `JWT_SECRET` = *(Generates secure session cookies)*
5.  Click **Deploy Web Service**.

#### Option 2: Railway.app
1.  Connect your GitHub to [Railway](https://railway.app/).
2.  Select **New Project > Deploy from GitHub repo**.
3.  Add the environment variables (`GEMINI_API_KEY`, `JWT_SECRET`) under the Variables tab. Railway automatically runs `npm run build` and `npm start` as defined in `package.json`.

---

## 📽️ Application Walkthrough Outline

When creating your assignment walkthrough video, follow this optimal structure:
1.  **Conceptual Overview (30s)**: Introduce "Escapist", showing the editorial slate landing view and the interactive escape card selection grid.
2.  **Authentication and Safety (1 min)**: Demonstrate signing up or registering. Highlight that password hashing utilizes crypto salts on the server, and sessions are authorized via JWT.
3.  **AI Orchestration (1 min)**: Input a trip destination using the elegant **Duration range slider**. Generate a plan, and show how the Gemini API constructs rich schedules, hotel price guides, isometers, and specific interest plans.
4.  **Custom Geospatial Feature (1 min)**: Display the Leaflet mapping component in action. Show how checkpoints dynamically update when switching days. Hover on map pins to reveal itinerary schedules.
5.  **Aesthetic Decisions (30s)**: Talk briefly about the Swiss inspired serif pairing, the high-contrast progress bento cards, and responsive fluid drawers.

---


