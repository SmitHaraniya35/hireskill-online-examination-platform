<div align="center">

# 🎯 HireSkill

**Online Examination Platform for Coding Assessments**

HireSkill is a robust, full-stack platform designed to help organizations evaluate candidates through secure, timed coding assessments. Admins can manage tests, compile custom coding problem banks, and automatically evaluate candidate submissions within highly secured sandboxed containers.

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Sandboxed-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [Deployment](#-deployment)
- [Supported Languages](#-supported-languages)
- [Contributing](#-contributing)

---

## 🔍 Overview

HireSkill is a full-stack online examination platform where organizations can evaluate candidates through timed coding assessments. Admins create tests with difficulty-based problem distributions, students solve problems in a proctored IDE, and code executes in isolated Docker containers. Results, scores, and analytics are calculated automatically.

---

## ✨ Features

### Admin Panel

- **Dashboard** — Global & per-test analytics with score distributions, difficulty-wise performance charts (Recharts + ECharts), problem success rates, and top-5 leaderboards
- **Test Management** — Create/edit tests with configurable problem counts per difficulty (Easy / Medium / Hard), activation toggles, and unique shareable test links
- **Coding Problem Bank** — Rich-text problem descriptions via TipTap editor, per-language code templates, test cases with optional image attachments (Cloudinary)
- **Student Management** — View student profiles, track participation across tests, bulk import via Excel (xlsx)
- **Submission Review** — Detailed per-student results with source code viewer (Monaco Editor), test case verdicts, and execution time

### Student Assessment

- **3-Step Onboarding** — Email verification → Profile completion → Instructions & rules acknowledgment
- **Proctored Environment** — Enforced fullscreen with violation detection; exiting fullscreen triggers a 5-second countdown before auto-submission
- **Integrated Code Editor** — Monaco Editor with syntax highlighting, language switching, code auto-save to session storage, and reset-to-template
- **Run & Submit** — "Run Code" tests against visible sample cases; "Submit" evaluates against all hidden test cases
- **Auto-Finish** — When time expires or a student finishes, the Attempt Worker auto-submits any unsaved/attempted problems and calculates weighted scores

### Code Execution Engine

- **Sandboxed Docker Containers** — Each submission runs in an isolated container with strict limits:
  - `--memory 256m` · `--cpus 0.5` · `--pids-limit 50` · `--network none` · `--read-only`
- **Multi-Language** — C, C++, JavaScript, Python
- **Verdict Detection** — Time Limit Exceeded (exit 124), Memory Limit Exceeded (exit 137), Runtime Error, Compilation Error, Wrong Answer, Accepted
- **Asynchronous Result Calculation** — When a test finishes, the Attempt Worker (BullMQ + Redis) processes all pending submissions in background and computes weighted final scores

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS 4, shadcn/ui, Radix UI |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Rich Text Editor** | TipTap (problem descriptions) |
| **Charts** | Recharts, ECharts (`echarts-for-react`) |
| **Forms & Validation** | React Hook Form + Zod (frontend), Joi (backend) |
| **Backend** | Node.js 20, Express 5, TypeScript, Mongoose ODM |
| **Database** | MongoDB |
| **Queue** | BullMQ + Redis (IoRedis) — for attempt processing |
| **Code Execution** | Docker containers (spawned via Docker CLI) |
| **Auth** | JWT (access + refresh tokens via HttpOnly cookies), bcryptjs |
| **Email** | Nodemailer (Gmail SMTP) |
| **File Upload** | Multer (memory storage) + Cloudinary |
| **Deployment** | Docker Compose, Vercel (frontend) |

---

## 🏗 Architecture

```
┌──────────────────┐         ┌────────────────┐        ┌────────────┐
│    Frontend      │         │   Express API  │        │  MongoDB   │
│  React + Vite    │───────▶│   (Port 5000)   │──────▶│            |
│  (Vercel)        │         │                │        └────────────┘
└──────────────────┘         └─────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
            ┌──────────────┐ ┌──────────┐ ┌──────────────┐
            │ Docker       │ │  Redis   │ │  Cloudinary  │
            │ Containers   │ │  Queue   │ │  (Images)    │
            │ (Sandboxed)  │ │          │ │              │
            │              │ └────┬─────┘ └──────────────┘
            │ • gcc:latest │      │
            │ • node:20    │      ▼
            │ • python:3.11│ ┌───────────────┐
            └──────────────┘ │ Attempt       │
                             │ Worker        │
                             │               │
                             │ • Auto-submit │
                             │   pending code│
                             │ • Calculate   │
                             │   final scores│
                             └───────────────┘
```

### How It Works

1. **Admin** creates a test with selected coding problems and difficulty distribution
2. **Student** accesses the test via a unique URL (`/test/:slug`), verifies email, completes profile, and accepts rules
3. Student writes code in the **Monaco Editor** and clicks "Run Code" or "Submit"
4. **API server** spawns a sandboxed Docker container, compiles the code, and runs it against test cases
5. When the student finishes (or time expires), the **Attempt Worker** picks up the job from Redis:
   - Auto-submits any problems that were attempted but not submitted
   - Calculates weighted scores (Easy: 100, Medium: 200, Hard: 300 points)
   - Saves the final result

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **Docker Desktop** (for sandboxed code execution)
- **MongoDB** (local or Atlas)
- **Redis** (local or cloud)

### Installation

```bash
# Clone
git clone https://github.com/SmitHaraniya35/HireSkill-Online-Examination-Platform.git
cd HireSkill-Online-Examination-Platform

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Setup Local Infrastructure
   
```bash
# Pull Required Judge Images
docker pull gcc:latest
docker pull node:20-alpine
docker pull python:3.11-slim

# Start Redis (Required for BullMQ)
docker run -d --name hireskill-redis -p 6379:6379 redis:7-alpine
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000

# MongoDB
MONGO_DB_URL=mongodb://localhost:27017/hireskill

# CORS
FRONTEND_DEVELOPMENT_URL=http://localhost:5173
FRONTEND_PRODUCTION_URL=https://your-production-domain.vercel.app

# JWT
JWT_ACCESS_SECRETKEY=your-access-secret
JWT_REFRESH_SECRETKEY=your-refresh-secret
TEST_LINK_SECRETKEY=your-testlink-secret

# Cloudinary (for test case images)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Gmail SMTP)
EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Redis
REDIS_HOST=localhost

# Docker (set true only when running inside container)
IS_DOCKER=false
```

### Frontend (`frontend/.env`)

```env
VITE_BACKEND_API_URL=http://localhost:5000/api
VITE_FRONTEND_URL=http://localhost:5173
```

---

## 💻 Execution Options

### Option 1: Native Local Execution (Development)
Use this if you want to run the code natively on your machine while only using Docker for the database/queue infrastructure and the isolated code judges.

1. **Start Infrastructure (Docker Required):**
   ```bash
   # In any terminal
   docker run -d --name hireskill-redis -p 6379:6379 redis:7-alpine
   ```
   *Note: Ensure your MongoDB is also running locally or via Atlas.*

2. **Run Application (3 Terminals):**
   ```bash
   # Terminal 1: Backend API
   cd backend && npm run dev

   # Terminal 2: Background Worker
   cd backend && npm run attempt-worker

   # Terminal 3: Frontend Client
   cd frontend && npm run dev
   ```
   > **Note:** For native execution, ensure `backend/.env` has `IS_DOCKER=false` and `REDIS_HOST=localhost`. These values are essential for the host-based API but are automatically overridden when using Docker Compose (Option 2).

---

### Option 2: Fully Containerized Execution (Backend)
Use this to run the entire backend stack (API, Worker, Redis) within Docker containers. This ensures environment parity but makes debugging slightly more complex.

1. **Build and Start Stack:**
   ```bash
   cd backend
   docker compose up -d --build
   ```

2. **Run Frontend (Natively):**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🐳 Production Deployment Details

The Docker Compose setup in the `backend` directory is designed for production readiness. It orchestrates three primary services:

| Service | Container | Role |
|---------|-----------|------|
| `api` | `hireskill-api` | Express API server (port 5000) |
| `worker` | `hireskill-worker` | Attempt Worker (BullMQ consumer) |
| `redis` | `hireskill-redis` | Redis 7 (queue broker) |

**Shared Infrastructure requirements:**
- **Docker Socket**: Both `api` and `worker` mount `/var/run/docker.sock` to spawn transient judge containers.
- **Shared Volume**: A shared `submissions` volume is used to pass source code between the host and judge containers efficiently.

The frontend is deployed separately on **Vercel**.

---

## 🌐 Supported Languages

| Language | Docker Image | Compile Command | Run Command |
|----------|-------------|----------------|-------------|
| C++ | `gcc:latest` | `g++ Main.cpp -O2 -o Main` | `./Main` |
| C | `gcc:latest` | `gcc Main.c -o Main` | `./Main` |
| JavaScript | `node:20-alpine` | — (syntax: `node --check`) | `node Main.js` |
| Python | `python:3.11-slim` | — (syntax: `py_compile`) | `python3 Main.py` |

### Execution Limits

| Constraint | Value |
|-----------|-------|
| Time limit | 1 second per test case |
| Memory | 256 MB |
| CPU | 0.5 cores |
| Process limit | 50 PIDs |
| Network | Disabled |
| Filesystem | Read-only |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ for smarter technical hiring**

</div>

