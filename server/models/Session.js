const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: String,
        answer: String,
        feedback: String,
        score: Number,
      },
    ],
    overallScore: {
      type: Number,
      default: 0,
    },
    resumeFilename: {
      type: String,
    },
    resumeAnalysis: {
      type: mongoose.Schema.Types.Mixed,
    },
    skills: [String],
    projects: [String],
    technologies: [String],
    candidateLevel: {
      type: String,
    },
    holisticSummary: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Session", sessionSchema);
