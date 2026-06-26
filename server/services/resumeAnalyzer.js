const Groq = require("groq-sdk");

/**
 * Analyzes resume raw text using Groq to return a structured JSON profile.
 * @param {string} resumeText - Parsed PDF text.
 * @param {string} apiKey - Groq API key.
 * @returns {Promise<object>} - Structured analysis object.
 */
async function analyzeResume(resumeText, apiKey) {
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured on the server.");
  }
  const groq = new Groq({ apiKey });

  const prompt = `You are an expert technical recruiter and senior engineering manager. Analyze the following resume text content and extract key professional profile information.
Return a single valid JSON object following this schema exactly (no extra text, no markdown block wrappers except standard JSON):

{
  "candidateLevel": "Junior | Mid | Senior | Lead",
  "primaryRole": "e.g. Full Stack Developer, DevOps Engineer, Data Scientist, etc.",
  "yearsOfExperience": "e.g. 3 years, 5+ years, 1 year",
  "skills": ["Skill1", "Skill2", ...],
  "projects": ["Brief summary of project 1", "Brief summary of project 2", ...],
  "technologies": ["Tech1", "Tech2", ...],
  "strengths": ["Strength1", "Strength2", ...],
  "missingSkills": ["Skill that would benefit this profile based on industry standards", ...],
  "summary": "2-3 sentence overview of candidate's technical profile and experience"
}

Resume Text:
${resumeText}`;

  try {
    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = result.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    throw new Error("Failed to analyze resume with Groq: " + err.message);
  }
}

module.exports = { analyzeResume };
