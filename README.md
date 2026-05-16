# 🎯 InterviewAI — AI-Powered Mock Interview Platform

> Practice interviews with AI-generated questions, get instant feedback, and track your progress.

🔗 **Live Demo:** [interview-ai-wine.vercel.app](https://interview-ai-wine.vercel.app)

---

## 📸 Features

- 🤖 **AI Question Generation** — Dynamic interview questions tailored to your role and difficulty
- 📝 **Instant AI Feedback** — Detailed evaluation with score, feedback, and improvement tips
- ⏱️ **Question Timer** — 2-minute countdown with auto-submit to simulate real interviews
- 🎯 **Difficulty Levels** — Easy, Medium, and Hard questions
- 🔢 **Flexible Question Count** — Choose 5, 10, or 15 questions per session
- 📊 **Progress Tracking** — Visual progress graph across all your sessions
- 📄 **PDF Report** — Download detailed interview report after each session
- 🔐 **Google OAuth** — Sign in with Google for quick access
- 🌙 **Dark / Light Mode** — Toggle between themes
- 📱 **Mobile Responsive** — Works seamlessly on all devices
- 💡 **Tip of the Day** — Daily interview tips to sharpen your skills

---

## 🛠️ Tech Stack

### Frontend

- **React** (Vite)
- **React Router DOM**
- **Recharts** — Progress graphs
- **jsPDF** — PDF report generation
- **React Hot Toast** — Notifications
- **Google OAuth** (`@react-oauth/google`)

### Backend

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **Groq SDK** — AI question generation and evaluation
- **Google Auth Library** — OAuth verification

### Deployment

- **Frontend** → Vercel
- **Backend** → Render
- **Database** → MongoDB Atlas

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Groq API key ([console.groq.com](https://console.groq.com))
- Google OAuth credentials ([console.cloud.google.com](https://console.cloud.google.com))

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/kritc-odesh-here/interview-ai.git
cd interview-ai
```

**2. Setup Backend**

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
node index.js
```

**3. Setup Frontend**

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm run dev
```

**4. Open** `http://localhost:5173`

---

## 📁 Project Structure

```
interview-app/
├── server/
│   ├── index.js
│   ├── models/
│   │   ├── User.js
│   │   └── Session.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── interview.js
│   └── middleware/
│       └── authMiddleware.js
│
└── client/
    └── src/
        ├── pages/
        │   ├── Home.jsx
        │   ├── Interview.jsx
        │   ├── History.jsx
        │   ├── Login.jsx
        │   └── Register.jsx
        ├── components/
        └── utils/
            └── api.js
```

---

## 🔑 API Endpoints

| Method | Endpoint                            | Description                |
| ------ | ----------------------------------- | -------------------------- |
| POST   | `/api/auth/register`                | Register new user          |
| POST   | `/api/auth/login`                   | Login user                 |
| POST   | `/api/auth/google`                  | Google OAuth login         |
| POST   | `/api/interview/generate-questions` | Generate AI questions      |
| POST   | `/api/interview/evaluate-answer`    | Evaluate answer with AI    |
| POST   | `/api/interview/save-session`       | Save interview session     |
| GET    | `/api/interview/sessions`           | Get user's session history |

---

## 👨‍💻 Author

**Manash Krit**

- GitHub: [@kritc-odesh-here](https://github.com/YOUR_USERNAME)
- LinkedIn: [manashkrit02](https://linkedin.com/in/manashkrit02)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
