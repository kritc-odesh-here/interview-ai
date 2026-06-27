const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const protect = require("../middleware/authMiddleware");
const Session = require("../models/Session");
const multer = require("multer");
const { extractText } = require("../services/pdfExtractor");
const { analyzeResume } = require("../services/resumeAnalyzer");
const { generatePersonalizedPrompt } = require("../services/promptGenerator");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GENERATE QUESTIONS
router.post("/generate-questions", protect, async (req, res) => {
  try {
    const { role, difficulty, questionCount, resumeAnalysis } = req.body;

    const prompt = resumeAnalysis
      ? generatePersonalizedPrompt(role, difficulty, questionCount, resumeAnalysis)
      : `You are an expert interviewer and senior manager from a top company conducting an interview for the role of: "${role}" at the "${difficulty}" difficulty level.

Your goal is to conduct a realistic, high-quality, structured, and field-appropriate interview simulation.

### ROLE CLASSIFICATION
You must first analyze the target role "${role}" and classify it into one of the following profession categories:
1. **Technical Software Roles** (e.g. Frontend Developer, Backend Developer, Full Stack Developer, Android/iOS Developer, Data Scientist, Machine Learning Engineer, DevOps Engineer, Software Engineer, etc.):
   - Structure: Technical theory, practical coding/debugging problems, project/architectural discussion, scenario-based system challenges, and behavioral questions.
   - For coding questions, follow the CODING PROBLEM FORMAT below.
2. **Technical Non-Coding Roles** (e.g. UI/UX Designer, Product Manager, QA Engineer, Business Analyst, System Administrator, database admin, etc.):
   - Structure: Case studies, workflow questions, tool-specific questions, design decisions, practical scenarios, and behavioral questions. Do NOT generate coding problems.
3. **Creative Roles** (e.g. Graphic Designer, Video Editor, Content Writer, Marketing Specialist, Copywriter, etc.):
   - Structure: Portfolio discussion, creative scenarios, client communication, practical task descriptions, industry knowledge, and behavioral questions. Do NOT generate coding problems.
4. **Business Roles** (e.g. Sales, HR, Recruiter, Customer Support, Operations, Business Development, Accountant, etc.):
   - Structure: Situational questions, communication, conflict resolution, decision making, domain knowledge, and behavioral questions. Do NOT generate coding problems.
5. **Hospitality / Service Roles** (e.g. Chef, Cook, Hotel Manager, Waiter, Barista, Receptionist, Customer Service, etc.):
   - Structure: Real workplace situations, hygiene and safety, customer handling, equipment knowledge, problem-solving scenarios, and experience-based questions. Do NOT generate coding problems.
6. **Healthcare Roles** (e.g. Nurse, Doctor, Medical Assistant, Therapist, Pharmacist, Dentist, etc.):
   - Structure: Clinical scenarios, patient interaction, safety, ethics, emergency handling, and domain-specific knowledge. Do NOT generate coding problems.

### STRUCTURAL FLOW
Generate a structured, progressive sequence of EXACTLY ${questionCount} questions matching the difficulty and role category.
Adapt the interview format dynamically according to the role's field. Do not use a fixed software engineering template for a service or creative role. The questions should progress naturally and cover a balanced mix of relevant topics.

### CODING PROBLEM FORMAT (ONLY for Technical Software Roles when generating a coding challenge)
For any Coding challenge question, the "question" text MUST follow this markdown template exactly:
### [Coding Problem Title]
**Problem Statement:** [Detailed description of the problem]
**Constraints:** [Input constraints]
**Example:**
- **Input:** [Example Input]
- **Output:** [Example Output]
**Edge Cases:** [1-2 key edge cases to consider]
**Expected Complexity:**
- Time: O(...)
- Space: O(...)

### DIFFICULTY MATRIX
Align the complexity of questions and practical situations with the requested difficulty (${difficulty}). For non-technical roles, easy/medium/hard refers to the depth of domain knowledge, complexity of the scenarios, or scale of project management questions.

### INTERVIEWER PERSONA & TONE
- Speak like a professional interviewer, hiring manager, or senior colleague in that specific field. Avoid robotic academic textbook prompts.
- Frame questions around real-world application challenges, practical situational decisions, or actual scenarios they would encounter in their day-to-day work.
- Include realistic follow-up prompts inside the question body (e.g., "How would you handle user resistance here?" or "What safety standards did you prioritize?").

### OUTPUT SCHEMA
You MUST respond with a single valid JSON object containing exactly ${questionCount} questions in the array. Every element in the 'questions' array MUST be a fully populated JSON object containing: 'id', 'question', 'category', 'difficulty', 'estimatedTime', 'skills', 'type', and 'expectedAnswerGuidelines'. DO NOT output simple strings in the array. No conversational intro/outro text, only pure JSON.

For every question, estimate a realistic completion duration (in seconds) as an integer based on its category and complexity:
- Behavioral questions: 60–90 seconds
- Conceptual / Theory questions: 90–180 seconds
- Debugging questions: 180–300 seconds
- Coding questions: 300–480 seconds
- System Design / Case Study / Scenario questions: 480–720 seconds

CRITICAL JSON ESCAPING RULE:
Any double quotes (") inside the string fields MUST be properly escaped as \\" to ensure the JSON remains valid. Better yet, use single quotes (') or backtick characters for code blocks and inline templates to avoid JSON parse errors entirely.

JSON Structure:
{
  "questions": [
    {
      "id": 1,
      "question": "The full detailed question text or scenario layout here",
      "category": "Coding | Behavioral | System Design | Core Concepts | Case Study | Creative | Situational | Clinical",
      "difficulty": "Easy | Medium | Hard",
      "estimatedTime": 420,
      "skills": ["Skill1", "Skill2", "Skill3"],
      "type": "Coding | Conceptual | Behavioral | Scenario | Practical | Clinical",
      "expectedAnswerGuidelines": "Brief guidelines of what a senior-level answer should cover (e.g. key keywords, structural approach, or critical edge cases)"
    }
  ]
}`;

    console.log("SENDING PROMPT TO GROQ:\n", prompt);

    let attempts = 0;
    const maxAttempts = 4; // 1 initial + 3 retries
    let parsedData = null;
    let lastError = null;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Groq Generation Attempt ${attempts}...`);
      try {
        const result = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        });
        const text = result.choices[0].message.content;
        console.log(`GROQ RESPONSE TEXT (Attempt ${attempts}):\n`, text);

        // Clean JSON formatting wrappers
        let clean = text.replace(/```json|```/g, "").trim();

        // 1. Attempt automatic JSON repair
        if (!clean.startsWith("{") && clean.includes("{")) {
          const firstBrace = clean.indexOf("{");
          const lastBrace = clean.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            clean = clean.substring(firstBrace, lastBrace + 1);
          }
        }

        let parsed;
        try {
          parsed = JSON.parse(clean);
        } catch (parseErr) {
          // Fallback repair: replace trailing commas and unescape quotes
          try {
            const repairedClean = clean
              .replace(/,\s*([\]}])/g, "$1") // trailing commas
              .replace(/\\"/g, '"')          // double escaped quotes
              .replace(/"\s*:\s*'\s*([^']*)\s*'/g, ':"$1"'); // single quote string values
            parsed = JSON.parse(repairedClean);
          } catch (repairErr) {
            throw new Error(`JSON Parse Error: ${parseErr.message}`);
          }
        }

        // 2. Structural checks
        if (!parsed || !Array.isArray(parsed.questions)) {
          throw new Error("Missing 'questions' array in AI response.");
        }

        const questionsArray = parsed.questions;

        // Check length
        if (questionsArray.length !== Number(questionCount)) {
          throw new Error(`Incomplete questions count: got ${questionsArray.length}, requested ${questionCount}.`);
        }

        // Auto-normalize fields before validating
        questionsArray.forEach((q, idx) => {
          // Enforce sequential correct IDs
          q.id = idx + 1;

          // Normalize skills
          if (q.skills && typeof q.skills === "string") {
            q.skills = [q.skills];
          } else if (!Array.isArray(q.skills)) {
            q.skills = [];
          }
        });

        // 3. Strict Validation per question
        for (let i = 0; i < questionsArray.length; i++) {
          const q = questionsArray[i];

          if (!q.question || typeof q.question !== "string" || !q.question.trim()) {
            throw new Error(`Question at index ${i} has empty or missing question text.`);
          }
          if (!q.category || typeof q.category !== "string" || !q.category.trim()) {
            throw new Error(`Question at index ${i} has missing category.`);
          }
          if (!q.difficulty || typeof q.difficulty !== "string" || !q.difficulty.trim()) {
            throw new Error(`Question at index ${i} has missing difficulty.`);
          }
          if (q.estimatedTime === undefined || q.estimatedTime === null || typeof q.estimatedTime !== "number" || q.estimatedTime <= 0) {
            throw new Error(`Question at index ${i} has invalid or missing estimatedTime.`);
          }
          if (!q.type || typeof q.type !== "string" || !q.type.trim()) {
            throw new Error(`Question at index ${i} has missing type.`);
          }
          if (!q.expectedAnswerGuidelines || typeof q.expectedAnswerGuidelines !== "string" || !q.expectedAnswerGuidelines.trim()) {
            throw new Error(`Question at index ${i} is missing expectedAnswerGuidelines.`);
          }
        }

        // If validation succeeds:
        parsedData = parsed;
        break; // Exit loop!

      } catch (err) {
        console.warn(`Attempt ${attempts} failed validation: ${err.message}`);
        lastError = err.message;
      }
    }

    if (!parsedData) {
      return res.status(500).json({
        message: "Failed to generate a fully validated interview after 3 retries.",
        error: lastError
      });
    }

    res.json(parsedData);
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
    const questionText = typeof question === "object" && question !== null ? question.question : question;

    const prompt = `You are an expert interviewer evaluating a candidate for a ${role} position.

    Question: ${questionText}
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

// EVALUATE BATCH SESSION ANSWERS
router.post("/evaluate-session", protect, async (req, res) => {
  try {
    const { role, answers } = req.body; // answers is an array of { question, answer }
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Answers array is required." });
    }

    const prompt = `You are an expert technical interviewer and senior engineering manager evaluating a candidate for a "${role}" position.
    Here is a list of questions asked during the mock interview and the candidate's corresponding submitted responses.
    
    Please evaluate each question and answer pair. For each item in the list, provide:
    1. A score (an integer between 1 and 10).
    2. Specific constructive feedback (2-3 sentences explaining what was good or missing).
    3. Actionable improvements (1-2 specific points they can add or revise to improve).

    You MUST respond with a single valid JSON object containing an array named "evaluations". Each element in the "evaluations" array MUST contain "score", "feedback", and "improvements", corresponding exactly to the index and order of the input items. No conversational introductions or explanations, only return pure valid JSON.

    JSON Structure:
    {
      "evaluations": [
        {
          "score": <number>,
          "feedback": "<string>",
          "improvements": "<string>"
        },
        ...
      ]
    }

    Input items:
    ${answers.map((item, idx) => `
    --- ITEM ${idx + 1} ---
    Question: ${item.question}
    Answer: ${item.answer || "No response provided."}
    `).join("\n")}`;

    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = result.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ message: "Error batch evaluating answers", error: err.message });
  }
});


// ANALYZE RESUME
router.post("/analyze-resume", protect, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded." });
    }
    
    const resumeText = await extractText(req.file.buffer);
    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ message: "Extracted resume content is empty." });
    }

    const analysis = await analyzeResume(resumeText, process.env.GROQ_API_KEY);
    
    res.json({
      filename: req.file.originalname,
      analysis
    });
  } catch (err) {
    res.status(500).json({ message: "Error analyzing resume", error: err.message });
  }
});

// GENERATE HOLISTIC SUMMARY
router.post("/generate-summary", protect, async (req, res) => {
  try {
    const { role, questions, resumeAnalysis } = req.body;

    const prompt = `You are a senior hiring manager and industry expert evaluating a candidate's overall performance in a mock interview for the role of: "${role}".

Candidate's Interview History:
${questions.map((q, idx) => `
Question ${idx + 1}: ${q.question}
Candidate's Answer: ${q.answer}
AI Score: ${q.score}/10
AI Feedback: ${q.feedback}
`).join("\n")}

${resumeAnalysis ? `
Candidate's Resume Profile:
- Level: ${resumeAnalysis.candidateLevel || "N/A"}
- Primary Role: ${resumeAnalysis.primaryRole || "N/A"}
- Technologies: ${JSON.stringify(resumeAnalysis.technologies || [])}
- Projects: ${JSON.stringify(resumeAnalysis.projects || [])}
` : "No resume was uploaded for this interview."}

Please generate a holistic session summary. Return a single valid JSON object following this schema exactly (no extra text, no markdown wrappers):
{
  "overallScore": <integer out of 10 representing overall score>,
  "technicalKnowledge": "<1-2 sentences evaluation of their tech knowledge>",
  "communication": "<1-2 sentences evaluation of their communication>",
  "problemSolving": "<1-2 sentences evaluation of their problem solving>",
  "confidence": "<1-2 sentences evaluation of their confidence and answer certainty>",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "topicsToImprove": ["Topic 1", "Topic 2"],
  "interviewReadiness": "<1 sentence on readiness level, e.g., Ready to apply, Needs practice, etc.>",
  "resumeConsistency": "<If resume was provided, evaluate how consistent their answers were compared to the experience claimed on their resume. Mention specific achievements if appropriate. If no resume was provided, return 'N/A (Quick Interview)'>"
}`;

    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = result.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(clean));
  } catch (err) {
    res.status(500).json({ message: "Error generating overall summary", error: err.message });
  }
});

// SAVE SESSION
router.post("/save-session", protect, async (req, res) => {
  try {
    const { 
      role, 
      questions, 
      overallScore, 
      resumeFilename, 
      resumeAnalysis, 
      skills, 
      projects, 
      technologies, 
      candidateLevel, 
      holisticSummary,
      duration
    } = req.body;

    // Strict validation before MongoDB persistence
    if (!role || typeof role !== "string" || !role.trim()) {
      return res.status(400).json({ message: "Validation failed: Role is required." });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Validation failed: Questions array is empty." });
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || typeof q.question !== "string" || !q.question.trim()) {
        return res.status(400).json({ message: `Validation failed: Question at index ${i} has missing text.` });
      }
      if (q.score === undefined || q.score === null || typeof q.score !== "number" || q.score < 0 || q.score > 10) {
        return res.status(400).json({ message: `Validation failed: Question at index ${i} has invalid score (${q.score}).` });
      }
      if (!q.feedback || typeof q.feedback !== "string" || !q.feedback.trim()) {
        return res.status(400).json({ message: `Validation failed: Question at index ${i} has missing feedback.` });
      }
    }

    const session = await Session.create({
      userId: req.userId,
      role,
      questions,
      overallScore,
      resumeFilename,
      resumeAnalysis,
      skills,
      projects,
      technologies,
      candidateLevel,
      holisticSummary,
      duration: duration || 0
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

// GET STATISTICS AGGREGATION FOR USER
router.get("/stats", protect, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.userId });
    if (sessions.length === 0) {
      return res.json({
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        favoriteRole: "N/A",
        resumeCount: 0,
        quickCount: 0,
        totalQuestions: 0,
        averageDuration: 0,
      });
    }

    const totalInterviews = sessions.length;
    const bestScore = Math.max(...sessions.map(s => s.overallScore || 0));
    const averageScore = Math.round((sessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) / totalInterviews) * 10) / 10;

    let resumeCount = 0;
    let quickCount = 0;
    let totalQuestions = 0;
    let totalDuration = 0;
    let durationCount = 0;

    const roleCounts = {};

    sessions.forEach(s => {
      // Role occurrence tracking
      if (s.role) {
        roleCounts[s.role] = (roleCounts[s.role] || 0) + 1;
      }
      // Resume vs Quick counters
      if (s.resumeFilename) {
        resumeCount++;
      } else {
        quickCount++;
      }
      // Questions answered count
      if (Array.isArray(s.questions)) {
        totalQuestions += s.questions.length;
      }
      // Duration accumulator (fallback to 900 seconds/15 mins if 0)
      const dur = s.duration && s.duration > 0 ? s.duration : 900;
      totalDuration += dur;
      durationCount++;
    });

    // Determine favorite role
    let favoriteRole = "N/A";
    let maxCount = 0;
    Object.keys(roleCounts).forEach(role => {
      if (roleCounts[role] > maxCount) {
        maxCount = roleCounts[role];
        favoriteRole = role;
      }
    });

    const averageDuration = durationCount > 0 ? Math.round(totalDuration / durationCount) : 0;

    res.json({
      totalInterviews,
      averageScore,
      bestScore,
      favoriteRole,
      resumeCount,
      quickCount,
      totalQuestions,
      averageDuration,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error calculating statistics", error: err.message });
  }
});

module.exports = router;
