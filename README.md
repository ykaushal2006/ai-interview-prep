# 🎙️ AI Interview Prep

An AI-powered mock interview system that conducts personalized interviews based on your resume and job description, with voice support and detailed analysis reports.

## ✨ Features

- 📄 **Resume Parsing** — Upload your resume (PDF) and let the AI extract relevant information
- 🤖 **AI-Generated Questions** — Personalized interview questions based on your resume and job description
- 🔄 **Cross Questioning** — AI intelligently asks follow-up questions based on your answers
- 🎙️ **Voice Support** — Answer questions by speaking using Web Speech API
- 🔊 **Text to Speech** — AI interviewer speaks questions aloud
- 📊 **Analysis Report** — Detailed feedback report after the interview
- ⬇️ **PDF Export** — Download your analysis report as a PDF
- 🔐 **Authentication** — Secure JWT-based login and registration

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React + Vite | Frontend framework |
| Tailwind CSS | Styling |
| Axios | API calls |
| React Router | Navigation |
| Web Speech API | Voice input/output |
| jsPDF | PDF report export |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Multer | File uploads |
| pdf-parse | Resume text extraction |
| Groq API (LLaMA 3.3 70B) | AI interview engine |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at https://console.groq.com)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/ai-interview-prep.git
cd ai-interview-prep
```

2. **Setup Backend**
```bash
cd server
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

Fill in your values in `server/.env`:
MONGO_URI=your_mongodb_atlas_uri

JWT_SECRET=your_jwt_secret_key

GROQ_API_KEY=your_groq_api_key

PORT=5000
4. **Setup Frontend**
```bash
cd ../client
npm install
```

5. **Run the project**

Backend (in `/server`):
```bash
npm run dev
```

Frontend (in `/client`):
```bash
npm run dev
```

6. **Open in browser**
http://localhost:5173

## 📁 Project Structure
ai-interview-prep/

├── client/                    # React frontend

│   ├── src/

│   │   ├── api/

│   │   │   └── axios.js       # Axios instance

│   │   ├── components/

│   │   │   ├── Navbar.jsx

│   │   │   └── ProtectedRoute.jsx

│   │   ├── context/

│   │   │   └── AuthContext.jsx

│   │   ├── pages/

│   │   │   ├── Login.jsx

│   │   │   ├── Register.jsx

│   │   │   ├── Home.jsx

│   │   │   ├── Interview.jsx

│   │   │   └── Report.jsx

│   │   └── App.jsx

│   └── package.json

│

├── server/                    # Express backend

│   ├── controllers/

│   │   ├── authController.js

│   │   ├── interviewController.js

│   │   └── reportController.js

│   ├── middleware/

│   │   └── authMiddleware.js

│   ├── models/

│   │   ├── User.js

│   │   ├── Session.js

│   │   └── Report.js

│   ├── routes/

│   │   ├── authRoutes.js

│   │   ├── interviewRoutes.js

│   │   └── reportRoutes.js

│   ├── .env.example

│   └── index.js

│

└── README.md

## 🔄 How It Works

User registers/logs in

↓
Uploads resume (PDF) + pastes job description

↓
AI extracts resume text and generates 8 personalized questions

↓
Interview begins — AI speaks each question aloud

↓
User answers via voice or text

↓
AI cross-questions (max 2 follow-ups per question)

↓
After all questions, AI generates detailed analysis report

↓
User downloads report as PDF


## 📊 Question Distribution

Each interview generates 8 questions:
- **3 Technical** — Based on skills in resume + JD
- **2 Project** — Digs into specific projects from resume
- **2 Behavioral** — STAR-based situational questions
- **1 Situational** — Real engineering scenario

## 🌐 Deployment

- **Frontend** — Vercel
- **Backend** — Render
- **Database** — MongoDB Atlas

## 🔮 Future Improvements

- [ ] ElevenLabs TTS integration for natural AI voice
- [ ] Interview history dashboard
- [ ] Multiple interview rounds (HR + Technical)
- [ ] Coding round with live code editor
- [ ] Performance analytics over time
