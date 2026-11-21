# InterviewPrep AI – AI Powered Interview Preparation System

A complete, professional, fully functional web application designed to help students prepare for technical and behavioral job interviews using **Live Generative AI Models (Google Gemini)** and transparent scoring evaluations.

---

## 🌟 Live Demo Credentials
- **Demo Email**: `demo@interviewprep.ai`
- **Demo Password**: `password123`
- *Or click the **"One-Click Demo Sign In"** button on the Login page!*

---

## 🤖 Live AI Model Integration (Google Gemini)

InterviewPrep AI is powered by **dual-engine architecture**:
1. **✨ Live Generative AI Model (Google Gemini)**: Real-time LLM evaluations with custom qualitative critiques, specific strengths, weaknesses, and benchmark answers using `gemini-1.5-flash`, `gemini-2.0-flash`, or `gemini-1.5-pro`.
2. **⚡ Deterministic Prototype Engine**: Fast rule-based scoring engine evaluating Relevance, Keyword Coverage, Completeness, and Quality without requiring an API key or internet access.

### How to Connect Your Free Google Gemini Key:
1. In the app top navigation bar or **Settings**, click **"Configure Live AI"** or the AI pill.
2. Select **Live Gemini AI Model**.
3. Paste your free Google Gemini API key ([Get a free key from Google AI Studio](https://aistudio.google.com/app/apikey)).
4. Click **"Test Key Connection"** to verify live connectivity.
5. Click **"Save & Apply"**!

*(Alternatively, add `VITE_GEMINI_API_KEY=your_key_here` to `frontend/.env`)*

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Run the Application
From the project root:
```bash
npm run dev
```
*(Or inside the `frontend/` directory, run `npm run dev`)*

Open your browser at:
```
http://localhost:5173
```

### 3. Build for Production
```bash
npm run build
```
Creates an optimized, minified production build in `frontend/dist/`.

---

## 🛠️ Technology Stack
- **Frontend Framework**: React 18 + Vite 6
- **Live AI Models**: Google Gemini API (`gemini-1.5-flash`, `gemini-2.0-flash`, `gemini-1.5-pro`)
- **Routing**: React Router DOM v6 (Public, Protected, and 404 Wildcard routes)
- **Styling**: Tailwind CSS 3 (Deep navy & professional blue SaaS palette, responsive design)
- **Icons**: Lucide React
- **Analytics & Data Visualizations**: Recharts (Responsive AreaChart & BarChart with interactive tooltips)
- **Data Persistence**: LocalStorage (Persisting user profile, authentication state, API keys, and completed interview records)

---

## 📱 Application Modules & Features

### 1. 🔐 Authentication System (`/login`, `/signup`)
- **Sign In / Login Page**: Form validation, password visibility toggle, error notifications, tabbed switcher to sign up.
- **One-Click Demo Access**: Instantly fills credentials or logs in as the pre-configured demo user (`demo@interviewprep.ai`).
- **Signup Page**: Full name, email format validation, password length and confirmation checks, target role and experience tier.
- **Session Persistence**: User authentication state and accounts persist via `localStorage`.
- **Logout**: Clears active session and securely redirects to `/login`.

### 2. 📊 Executive Dashboard (`/`)
- **Personalized Greeting**: Dynamic welcome banner greeting the user by name with an SVG AI coach illustration.
- **Real-Time KPI Cards**: Calculated dynamically from LocalStorage: Total Interviews Completed, Overall Average Score, Best Score Achieved, and Active Streak.
- **Quick-Launch Interview Form**: Start an interview directly from the dashboard by choosing Technology, Difficulty, Question Count, and Type.
- **Live AI Model Status**: Displays whether the live Gemini model or deterministic engine is active.
- **Recent Activity Feed**: Dynamically lists recent completed interviews with scores, dates, and direct links to view detailed evaluation reports.
- **Study Hub Quick Links**: Direct shortcuts to DSA practice, interview tips, and mock tests.

### 3. ⚙️ Interview Setup (`/start-interview`)
- **5 Target Technologies**: Java, Python, JavaScript, React, and SQL.
- **3 Difficulty Tiers**: Beginner (Foundations), Intermediate (Mechanisms & Trade-offs), and Advanced (Architecture & Scalability).
- **Question Counts**: 5 Questions (Express ~15 min), 10 Questions (Standard ~30 min), 15 Questions (Deep-Dive ~45 min).
- **Interview Types**: Technical, HR / Behavioral (STAR method), and Mixed.
- **AI Engine Selector**: Displays active engine and provides one-click button to configure Live Gemini API Key.

### 4. 📝 Focus Interview Session (`/interview-session`)
- **Single Question Focus**: Displays one question at a time to replicate actual interview conditions.
- **Interactive Hints**: Collapsible tips and guiding questions for each topic.
- **Rich Answer Workspace**: Clean typography with live word counter and character counter.
- **Draft Auto-Saving**: Candidate answers are automatically preserved across questions.
- **Session Timer**: Live MM:SS timer tracking active elapsed time.
- **Question Progress Indicator**: Progress bar and interactive question selector pills (color-coded for current, answered, and unanswered).
- **Finish Confirmation Modal**: Audits answered vs unanswered questions and shows an evaluation simulation screen before results.

### 5. 🧠 AI Evaluation Engine (`/evaluation`)
- **Live Generative AI Assessment**: Critiques answers using Google Gemini LLM with tailored feedback.
- **Evaluates 4 Pillars**:
  1. **Answer Relevance** (0-25 pts): Topic term alignment, problem matching.
  2. **Keyword Coverage** (0-25 pts): Verification of key domain keywords and technical concepts.
  3. **Answer Completeness & Depth** (0-25 pts): Word count, structural depth, and elaboration.
  4. **Quality & Structure** (0-25 pts): Analytical reasoning, examples, trade-offs, and clarity.
- **Evaluation Scorecard**:
  - Overall Score out of 100 with circular score gauge.
  - Placement Readiness Grade ("Strong Hire", "Hire", "Needs Practice").
  - 4-bar metric breakdown for Relevance, Keywords, Completeness, and Quality.
  - Highlighted Strengths and Areas for Improvement.
- **Question-by-Question Accordion**: Candidate's submitted response, individual question score out of 100 with category breakdown, keyword coverage analysis (matched vs missed), evaluator feedback, and a complete **Sample Ideal Model Answer**.
- **Run Live Eval Button**: Allows re-evaluating any session with Live Gemini AI in 1 click.
- **Export & Print**: One-click summary print/export.

### 6. 📜 Interview History (`/history`)
- **Complete Log**: Persisted in LocalStorage across browser refreshes.
- **Filtering & Search**: Filter by technology, difficulty, or search by topic.
- **Model Tag**: Shows whether the attempt was evaluated by Live Gemini AI or the Prototype Engine.
- **View Report & Delete Record**: Inspect past results or delete individual records with confirmation modal.

### 7. 📈 Performance Analytics (`/performance`)
- **Score Trend AreaChart (Recharts)**: Visualizes score progression chronologically across all completed mock sessions.
- **Technology Performance BarChart (Recharts)**: Compares average scores across Java, Python, JavaScript, React, and SQL.
- **Strong Topics (80%+) & Weak Topics (<75%)**: Identified conceptual gaps paired with actionable study recommendations.

### 8. 👤 Candidate Profile & Settings (`/profile`, `/settings`)
- **Profile Management**: View and edit Name, Email, Target Role, Experience Tier, College, Degree, Grad Year, Bio, and Preferred Stacks.
- **AI Settings Page**: Connect, test, and save Google Gemini API keys and switch between Gemini Flash and Pro models.
