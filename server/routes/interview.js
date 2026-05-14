const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const protect = require("../middleware/authMiddleware");
const Session = require("../models/Session");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// GENERATE QUESTIONS
router.post("/generate-questions", protect, async (req, res) => {
  try {
    const { role, difficulty, questionCount } = req.body;

    const prompt = `You are an expert technical interviewer. Your task is to generate EXACTLY ${questionCount} interview questions for a ${role} position at ${difficulty} difficulty level.

IMPORTANT: You MUST generate EXACTLY ${questionCount} questions. Not more, not less.

Rules:
- Mix of technical and behavioral questions
- Relevant to current job market in 2025
- ${difficulty === "Easy" ? "Questions should be basic and beginner friendly" : difficulty === "Medium" ? "Questions should be intermediate level" : "Questions should be advanced and challenging"}
- Each question should be clear and concise

Respond in this exact JSON format only, no extra text, no markdown:
{
  "questions": [
    "Question 1 here",
    "Question 2 here",
    "Question 3 here"
  ]
}

Remember: The array must have EXACTLY ${questionCount} items.`;

    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });
    const text = result.choices[0].message.content;

    // Clean and parse JSON
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error generating questions", error: err.message });
  }
});

// EVALUATE ANSWER
router.post("/evaluate-answer", protect, async (req, res) => {
  try {
    const { question, answer, role } = req.body;

    const prompt = `You are an expert interviewer evaluating a candidate for a ${role} position.

    Question: ${question}
    Candidate's Answer: ${answer}

    Evaluate the answer and respond in this exact JSON format only, no extra text:
    {
      "score": <number between 1 and 10>,
      "feedback": "<2-3 sentences of specific, constructive feedback>",
      "improvements": "<1-2 specific things they could add or improve>"
    }`;

    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });
    const text = result.choices[0].message.content;

    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error evaluating answer", error: err.message });
  }
});

// SAVE SESSION
router.post("/save-session", protect, async (req, res) => {
  try {
    const { role, questions, overallScore } = req.body;

    const session = await Session.create({
      userId: req.userId,
      role,
      questions,
      overallScore,
    });

    res.status(201).json({ message: "Session saved", session });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving session", error: err.message });
  }
});

// GET ALL SESSIONS FOR USER
router.get("/sessions", protect, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(sessions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching sessions", error: err.message });
  }
});

module.exports = router;
