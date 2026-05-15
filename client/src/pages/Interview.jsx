import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";

function Interview() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("selectedRole");
  const [timeLeft, setTimeLeft] = useState(120);
  const timerRef = useRef(null);
  const [timeUp, setTimeUp] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const difficulty = localStorage.getItem("difficulty") || "Medium";
      const questionCount =
        parseInt(localStorage.getItem("questionCount")) || 5;
      console.log("Sending:", { role, difficulty, questionCount });
      const res = await API.post("/api/interview/generate-questions", {
        role,
        difficulty,
        questionCount,
      });
      console.log("Got questions:", res.data.questions.length);
      setQuestions(res.data.questions);
    } catch (err) {
      toast.error("Failed to generate questions. Try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || feedback || finished) return;

    setTimeLeft(120);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, loading, feedback]);

  useEffect(() => {
    if (timeLeft === 0 && !feedback && !loading) {
      toast.error("Time up! Auto submitting...");
      setTimeUp(true);
      handleSubmitAnswer();
    }
  }, [timeLeft]);

  const handleSubmitAnswer = async () => {
    clearInterval(timerRef.current);
    setEvaluating(true);
    setFeedback(null);
    try {
      const finalAnswer =
        answer.trim() || "I was unable to answer this question in time.";
      const res = await API.post("/api/interview/evaluate-answer", {
        role,
        question: questions[currentIndex],
        answer: finalAnswer,
      });
      setFeedback(res.data);
      setAllResults((prev) => [
        ...prev,
        {
          question: questions[currentIndex],
          answer: finalAnswer,
          feedback: res.data.feedback,
          score: res.data.score,
        },
      ]);
    } catch (err) {
      toast.error("Failed to evaluate answer. Try again!");
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      handleFinish();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAnswer("");
      setFeedback(null);
      setTimeUp(false);
    }
  };

  const handleFinish = async () => {
    const overallScore = Math.round(
      allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length,
    );
    try {
      await API.post("/api/interview/save-session", {
        role,
        questions: allResults,
        overallScore,
      });
      toast.success("Session saved! 🏆");
    } catch (err) {
      console.error(err);
    }
    setReviewing(true);
  };

  // Review screen
  if (reviewing && !finished) {
    const overallScore = Math.round(
      allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length,
    );
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.role}>Review Your Answers 📝</h2>
          <span style={styles.progress}>{role}</span>
        </div>

        <div style={styles.content}>
          {allResults.map((result, index) => (
            <div key={index} style={styles.reviewCard}>
              <p style={styles.questionLabel}>
                Q{index + 1}: {result.question}
              </p>
              <p style={styles.reviewAnswer}>📝 {result.answer}</p>
              <p style={styles.reviewFeedback}>💬 {result.feedback}</p>
              <span
                style={{
                  ...styles.miniScore,
                  background:
                    result.score >= 7
                      ? "#00c48c"
                      : result.score >= 5
                        ? "#ffb347"
                        : "#ff6b6b",
                }}
              >
                Score: {result.score}/10
              </span>
            </div>
          ))}

          {/* Overall Score */}
          <div style={styles.overallBox}>
            <p style={styles.overallLabel}>Overall Score</p>
            <p style={styles.overallScore}>{overallScore}/10</p>
            <button style={styles.finishBtn} onClick={() => setFinished(true)}>
              See Final Result 🏆
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading screen
  if (loading) {
    return (
      <div style={styles.centered}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Generating your questions...</p>
        </div>
      </div>
    );
  }

  // Finished screen
  if (finished) {
    const overallScore = Math.round(
      allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length,
    );
    return (
      <div style={styles.centered}>
        <div style={styles.finishedBox}>
          <div style={styles.trophy}>🏆</div>
          <h1 style={styles.finishedTitle}>Interview Complete!</h1>
          <p style={styles.finishedSubtitle}>Overall Score</p>
          <div style={styles.bigScore}>{overallScore}/10</div>
          <div style={styles.finishedBtns}>
            <button style={styles.primaryBtn} onClick={() => navigate("/")}>
              Try Another Role
            </button>
            <button
              style={styles.secondaryBtn}
              onClick={() => navigate("/history")}
            >
              View History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2 style={styles.role}>{role}</h2>
        <div style={styles.headerRight}>
          <span
            style={{
              ...styles.timer,
              color: timeLeft <= 30 ? "#ff6b6b" : "#00c48c",
            }}
          >
            ⏱️ {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </span>
          <span style={styles.progress}>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <div style={styles.content}>
        <div style={styles.questionBox}>
          <p style={styles.questionLabel}>Question {currentIndex + 1}</p>
          <p style={styles.questionText}>{questions[currentIndex]}</p>
        </div>

        {/* Answer */}
        {!feedback && (
          <>
            <textarea
              style={{
                ...styles.textarea,
                opacity: timeUp ? 0.5 : 1,
              }}
              placeholder={timeUp ? "Time up!" : "Type your answer here..."}
              value={answer}
              onChange={(e) => !timeUp && setAnswer(e.target.value)}
              rows={6}
              disabled={timeUp}
            />
            <button
              style={{
                ...styles.submitBtn,
                opacity: timeUp || evaluating || !answer.trim() ? 0.6 : 1,
              }}
              onClick={handleSubmitAnswer}
              disabled={evaluating || !answer.trim() || timeUp}
            >
              {evaluating
                ? "Evaluating..."
                : timeUp
                  ? "Time Up! ⏱️"
                  : "Submit Answer →"}
            </button>
          </>
        )}

        {/* Feedback */}
        {feedback && (
          <div style={styles.feedbackBox}>
            <div style={styles.scoreRow}>
              <span style={styles.scoreLabel}>Score</span>
              <span
                style={{
                  ...styles.scoreBadge,
                  background:
                    feedback.score >= 7
                      ? "#00c48c"
                      : feedback.score >= 5
                        ? "#ffb347"
                        : "#ff6b6b",
                }}
              >
                {feedback.score}/10
              </span>
            </div>

            <p style={styles.feedbackTitle}>📝 Your Answer</p>
            <p style={styles.feedbackText}>{answer}</p>

            <p style={styles.feedbackTitle}>💬 Feedback</p>
            <p style={styles.feedbackText}>{feedback.feedback}</p>

            <p style={styles.feedbackTitle}>✨ Improvements</p>
            <p style={styles.feedbackText}>{feedback.improvements}</p>

            <button style={styles.nextBtn} onClick={handleNext}>
              {currentIndex + 1 >= questions.length
                ? "Finish Interview 🏆"
                : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "var(--gradient-bg)",
  },
  centered: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--gradient-bg)",
  },
  loadingBox: {
    textAlign: "center",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255,255,255,0.1)",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  loadingText: {
    color: "#888",
    fontSize: "16px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  backBtn: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "14px",
  },
  role: {
    color: "var(--text-primary)",
    fontSize: "18px",
    fontWeight: "600",
  },
  progress: {
    color: "var(--accent-primary)",
    fontWeight: "700",
    fontSize: "16px",
  },
  progressBar: {
    height: "4px",
    background: "rgba(255,255,255,0.1)",
  },
  progressFill: {
    height: "100%",
    background: "var(--gradient-main)",
    transition: "width 0.3s ease",
  },
  content: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  questionBox: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "30px",
    marginBottom: "24px",
  },
  questionLabel: {
    color: "var(--accent-primary)",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  questionText: {
    ccolor: "var(--text-primary)",
    fontSize: "18px",
    lineHeight: "1.6",
  },
  textarea: {
    width: "100%",
    padding: "16px",
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    borderRadius: "12px",
    fontSize: "15px",
    lineHeight: "1.6",
    resize: "vertical",
    marginBottom: "16px",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "var(--gradient-main)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
  },
  feedbackBox: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "30px",
  },
  scoreRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  scoreLabel: {
    color: "var(--text-muted)",
    fontSize: "14px",
  },
  scoreBadge: {
    padding: "6px 16px",
    borderRadius: "20px",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
  },
  feedbackTitle: {
    color: "var(--accent-primary)",
    fontWeight: "600",
    marginBottom: "8px",
    marginTop: "16px",
  },
  feedbackText: {
    color: "var(--text-secondary)",
    lineHeight: "1.6",
    fontSize: "15px",
  },
  nextBtn: {
    width: "100%",
    padding: "14px",
    background: "var(--gradient-main)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "24px",
  },
  finishedBox: {
    textAlign: "center",
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "20px",
    padding: "60px 40px",
    maxWidth: "420px",
    width: "100%",
  },
  trophy: {
    fontSize: "60px",
    marginBottom: "20px",
  },
  finishedTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--text-primary)",
    marginBottom: "8px",
  },
  finishedSubtitle: {
    color: "#888",
    marginBottom: "16px",
  },
  bigScore: {
    fontSize: "48px",
    fontWeight: "800",
    background: "var(--gradient-main)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "30px",
  },
  finishedBtns: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  primaryBtn: {
    padding: "12px 24px",
    background: "var(--gradient-main)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
  },
  secondaryBtn: {
    padding: "12px 24px",
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    borderRadius: "10px",
    fontSize: "15px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  timer: {
    fontSize: "18px",
    fontWeight: "700",
  },
  reviewCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderLeft: "4px solid var(--accent-primary)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "16px",
  },
  reviewAnswer: {
    color: "#aaa",
    fontSize: "14px",
    marginTop: "10px",
    marginBottom: "8px",
    lineHeight: "1.6",
  },
  reviewFeedback: {
    color: "#888",
    fontSize: "13px",
    marginBottom: "12px",
    lineHeight: "1.6",
  },
  miniScore: {
    padding: "4px 12px",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
  },
  overallBox: {
    textAlign: "center",
    padding: "40px",
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    marginTop: "24px",
  },
  overallLabel: {
    color: "#888",
    fontSize: "16px",
    marginBottom: "12px",
  },
  overallScore: {
    fontSize: "52px",
    fontWeight: "800",
    background: "var(--gradient-main)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "24px",
  },
  finishBtn: {
    padding: "14px 32px",
    background: "var(--gradient-main)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
  },
};

export default Interview;
