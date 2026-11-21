# InterviewPrep AI - Frontend

College Minor Project: **AI-Powered Interview Preparation System (InterviewPrep AI)**

Modern, professional SaaS web application built with **React**, **Vite**, **Tailwind CSS**, **React Router**, **Lucide React**, and **Recharts**.

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Start Development Server
```bash
# From frontend folder:
npm run dev

# Or from project root:
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Generates production-ready bundled assets into `dist/`.

---

## 🔑 Demo Account Credentials
- **Email**: `demo@interviewprep.ai`
- **Password**: `password123`
- *Or click "One-Click Demo Sign In" on the Login page.*

---

## 📁 Architecture & File Structure

```
src/
├── components/
│   ├── common/             # Reusable UI primitives (Badge, Button, Card, Modal, ProgressBar, StatCard)
│   └── layout/             # Application shell (DashboardLayout, Sidebar, TopNavbar)
├── context/
│   ├── AuthContext.jsx      # Authentication & User profile persistence
│   └── InterviewContext.jsx # In-memory interview session manager & LocalStorage history
├── utils/
│   └── evaluatorEngine.js  # Transparent deterministic rule-based prototype scoring engine
├── data/
│   ├── interviewQuestions.js # Comprehensive question bank (Java, Python, JS, React, SQL, HR)
│   ├── mockRolesAndSkills.js # Role and skill definitions
│   └── mockUser.js         # Default user seed
├── pages/
│   ├── Login/              # Login page with demo credentials
│   ├── Signup/             # Student account registration with validation
│   ├── Dashboard/          # Welcome banner, KPI cards, quick-start, recent activity
│   ├── StartInterview/     # Technology (Java, Python, JS, React, SQL), Difficulty, Count, Type
│   ├── InterviewSession/   # Focus environment (Timer, question navigator, answer input, hints)
│   ├── Evaluation/         # AI Scorecard, 4-pillar breakdown, question review, sample model answers
│   ├── History/            # Filterable & searchable interview history with delete functionality
│   ├── Performance/        # Recharts AreaChart & BarChart for score trends & tech mastery
│   ├── Profile/            # Student profile editor & logout
│   ├── Resources/          # Handpicked DSA guides & interview cheat sheets
│   └── Settings/           # System & audio preferences
├── App.jsx                 # Client-side routing with React Router & ProtectedRoute
├── main.jsx                # Application root entry point
└── index.css               # Tailwind CSS directives & custom utility classes
```
