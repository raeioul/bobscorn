# Bob's Corn Technical Documentation

Welcome to the **Bob's Corn** project! This document provides a comprehensive overview of the system architecture, the technology stack, and the core logic that powers the landing page and the corn-buying service.

---

## 🚀 Project Overview

Bob's Corn is a high-performance web application designed for a premium user experience. It consists of a **Node.js/Express API** backend and a **Vite/React** frontend, both built with TypeScript for maximum safety and developer productivity.

---

## 🛠️ Technology Stack

### Backend (API)
- **Node.js**: The runtime environment.
- **TypeScript**: Ensuring type safety throughout the codebase.
- **Express.js**: Lightweight framework for handling HTTP requests.
- **Vitest**: Modern testing framework for unit and integration tests.
- **Supertest**: Library for testing HTTP endpoints.

### Frontend (Client)
- **React 19**: Modern component-based UI library.
- **Vite**: Ultra-fast build tool and dev server.
- **Tailwind CSS v4**: The latest utility-first CSS framework for rapid UI development.
- **Lucide Icons / SVG**: For crisp, scalable visual elements.
- **Vitest & React Testing Library**: For component and unit testing.

---

## 🧠 Backend Architecture & Logic

The backend is responsible for enforcing business rules and tracking client progress.

### 1. Rate Limiting Strategy
The core business logic is the **Rate Limiter**, located in `api/src/rateLimiter.ts`.
- **Client Identification**: Uses a custom `X-Client-ID` header (or IP fallback) to uniquely identify users.
- **Cooldown enforcement**: Each client is restricted to **one purchase per 60 seconds**.
- **In-Memory Storage**: The server uses `Map` objects to track `lastPurchaseTime` and `cornCounts`. 
    > [!NOTE]
    > To keep the challenge simple, data is currently stored in memory and will reset if the server restarts.

### 2. API Endpoints
- `POST /buy-corn`: 
    - Checks the rate limit for the provided `clientId`.
    - Returns `200 🌽` on success.
    - Returns `429 Too Many Requests` with a `Retry-After` header if the cooldown is active.
- `GET /corn-count`: (Planned) To fetch the client's current count independently.

---

## 🎨 Frontend Architecture & Design

The frontend focuses on **visual excellence** and **responsive interactions**.

### 1. Aesthetic Design (Glassmorphism)
We used a premium "Glassmorphism" aesthetic:
- **Header**: Sticky, semi-transparent background with `backdrop-blur-lg`.
- **Hero Section**: A full-screen corn background (`product-corn.jpg`) with a dark overlay to make content pop.
- **Card**: Semi-transparent black backgrounds with high blur to maintain readability without hiding the beautiful imagery.

### 2. Core Components
- **`Header`**: Responsive navigation with smooth-scrolling links and social media integration.
- **`Footer`**: Simple, elegant branding and contact section.
- **`CooldownWatch`**: A custom-designed circular progress gauge that visualizes the remaining wait time using SVG dash-offsets and CSS transitions.

### 3. State Management
- **React Hooks**: Uses `useState` and `useEffect` for local state (corn count, messages, cooldown timer).
- **LocalStorage**: Persists the `clientId` so you are recognized by the server as the same user across sessions.

---

## 🧪 Testing Strategy

We follow a strict testing protocol to ensure reliability:

- **Backend Tests**: 
    - `RateLimiter.test.ts`: Verifies successful purchases, cooldown enforcement, and client isolation.
    - `api.test.ts`: Tests the actual HTTP responses and headers.
- **Frontend Tests**: 
    - `CooldownWatch.test.tsx`: Validates rendering of the timer logic.
    - `Header.test.tsx` / `Footer.test.tsx`: Verifies branding and link availability.

---

## 📂 Directory Structure

```bash
bob-api/
├── api/                # Backend code
│   ├── src/            # Logic & Tests
│   └── package.json    # Backend dependencies
├── client/             # Frontend code
│   ├── src/            # Components, Styling & Tests
│   │   ├── components/ # Reusable UI components
│   │   ├── test/       # Organized test suite
│   │   └── App.tsx     # Main application entry
│   └── vite.config.ts  # Vite & Tailwind configuration
└── .agent/             # Internal agent workflows
```

---

