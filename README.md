# Repel

Repel is a simple full-stack project demonstrating how modern website-generation web apps work using Large Language Models (LLMs).  
The system is built with a **frontend + backend architecture** and integrates the **Gemini API** to dynamically generate content.

---

## 🚀 Features
- Full-stack demo showcasing how to integrate LLMs in web app workflows.  
- Backend powered by Gemini API for intelligent content generation.  
- Frontend web interface to interact with the generation pipeline.  

---

## 🛠️ Tech Stack
- **Backend:** Node.js (Express)  
- **Frontend:** React + Vite (or your stack if different)  
- **LLM:** Gemini API  

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/eklavya-eg/repel.git
cd repel
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# add your GEMINI_API_KEY=xxxxxx in .env
npm install
npm run dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

### 4. Access
http://localhost:5173

📂 Project Structure
```bash
repel/
 ├── backend/   # API layer with Gemini integration
 ├── frontend/  # React-based web UI
 └── README.md
```
