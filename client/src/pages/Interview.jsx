import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  Award,
  Download,
  Terminal,
  ChevronRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  FileText,
  Activity,
  Play,
  RotateCcw,
} from "lucide-react";
import jsPDF from "jspdf";
import API from "../utils/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

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
  const [role, setRole] = useState(localStorage.getItem("selectedRole") || "Developer");
  const [timeLeft, setTimeLeft] = useState(120);
  const timerRef = useRef(null);
  const [timeUp, setTimeUp] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [reviewingResume, setReviewingResume] = useState(false);
  const [saving, setSaving] = useState(false);
  const [holisticSummary, setHolisticSummary] = useState(null);

  // New assessment states
  const [userAnswers, setUserAnswers] = useState([]);
  const [showPreSubmitReview, setShowPreSubmitReview] = useState(false);
  const [grading, setGrading] = useState(false);
  const [questionTimers, setQuestionTimers] = useState([]);

  const clearActiveSession = () => {
    localStorage.removeItem("activeQuestions");
    localStorage.removeItem("activeQuestionIndex");
    localStorage.removeItem("activeUserAnswers");
    localStorage.removeItem("activeQuestionTimers");
  };

  useEffect(() => {
    const savedQuestions = localStorage.getItem("activeQuestions");
    const savedIndex = localStorage.getItem("activeQuestionIndex");
    const savedAnswers = localStorage.getItem("activeUserAnswers");
    const savedTimers = localStorage.getItem("activeQuestionTimers");

    if (savedQuestions && savedIndex && savedAnswers && savedTimers) {
      try {
        const parsedQuestions = JSON.parse(savedQuestions);
        const parsedIndex = parseInt(savedIndex, 10);
        const parsedAnswers = JSON.parse(savedAnswers);
        const parsedTimers = JSON.parse(savedTimers);

        if (parsedQuestions.length > 0) {
          setQuestions(parsedQuestions);
          setCurrentIndex(parsedIndex);
          setUserAnswers(parsedAnswers);
          setQuestionTimers(parsedTimers);
          setAnswer(parsedAnswers[parsedIndex] || "");
          setTimeLeft(Number(parsedTimers[parsedIndex]) || 120);

          setReviewingResume(false);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Error reading saved session:", e);
        clearActiveSession();
      }
    }

    const mode = localStorage.getItem("interviewMode");
    if (mode === "personalized") {
      setReviewingResume(true);
      setLoading(false);
    } else {
      generateQuestions();
    }
  }, []);

  const generateQuestions = async (resumeAnalysisParam = null) => {
    setLoading(true);
    try {
      const difficulty = localStorage.getItem("difficulty") || "Medium";
      const questionCount = parseInt(localStorage.getItem("questionCount")) || 5;
      
      const payload = {
        role: localStorage.getItem("selectedRole") || "Developer",
        difficulty,
        questionCount,
      };

      if (resumeAnalysisParam) {
        payload.resumeAnalysis = resumeAnalysisParam;
      }

      console.log("Sending:", payload);
      const res = await API.post("/api/interview/generate-questions", payload);
      console.log("Got questions:", res.data.questions.length);

      const loadedQuestions = res.data.questions;
      setQuestions(loadedQuestions);

      const initialAnswers = new Array(loadedQuestions.length).fill("");
      setUserAnswers(initialAnswers);

      const initialTimers = loadedQuestions.map((q) => Number(q.estimatedTime) || 120);
      setQuestionTimers(initialTimers);

      // Persist initial state
      localStorage.setItem("activeQuestions", JSON.stringify(loadedQuestions));
      localStorage.setItem("activeQuestionIndex", "0");
      localStorage.setItem("activeUserAnswers", JSON.stringify(initialAnswers));
      localStorage.setItem("activeQuestionTimers", JSON.stringify(initialTimers));
      localStorage.setItem("interviewStartTime", Date.now().toString());
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to generate questions. Try again!";
      toast.error(errMsg);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || feedback || finished || reviewingResume || saving || grading || showPreSubmitReview || !questions.length) return;

    const savedTime = questionTimers[currentIndex] !== undefined
      ? questionTimers[currentIndex]
      : (Number(questions[currentIndex]?.estimatedTime) || 120);

    setTimeLeft(savedTime);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1;

        setQuestionTimers((currentTimers) => {
          const updated = [...currentTimers];
          if (updated[currentIndex] !== undefined) {
            updated[currentIndex] = newTime;
          } else {
            updated[currentIndex] = newTime;
          }
          localStorage.setItem("activeQuestionTimers", JSON.stringify(updated));
          return updated;
        });

        if (newTime === 0) {
          clearInterval(timerRef.current);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions, loading, feedback, reviewingResume, saving, grading, showPreSubmitReview]);

  useEffect(() => {
    if (timeLeft === 0 && !loading && !finished && !reviewing && !reviewingResume && !saving && !grading) {
      toast.error("Time up for this question!");
      setTimeUp(true);
      
      // Auto-save the answer
      setUserAnswers((prev) => {
        const next = [...prev];
        next[currentIndex] = answer.trim() || "I was unable to answer this question in time.";
        localStorage.setItem("activeUserAnswers", JSON.stringify(next));
        return next;
      });

      if (currentIndex + 1 >= questions.length) {
        setShowPreSubmitReview(true);
      } else {
        navigateToQuestion(currentIndex + 1);
      }
    }
  }, [timeLeft]);

  const handleAnswerChange = (text) => {
    setAnswer(text);
    setUserAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = text;
      localStorage.setItem("activeUserAnswers", JSON.stringify(next));
      return next;
    });
  };

  const navigateToQuestion = (newIdx) => {
    if (newIdx < 0 || newIdx >= questions.length) return;
    
    localStorage.setItem("activeQuestionIndex", String(newIdx));

    setCurrentIndex(newIdx);
    setAnswer(userAnswers[newIdx] || "");
    setTimeUp(false);
    setShowPreSubmitReview(false);
  };

  const handleSubmitAnswer = async () => {
    // Legacy support (unused during active navigated flow)
    clearInterval(timerRef.current);
    setEvaluating(true);
    setFeedback(null);
    try {
      const currentQuestion = questions[currentIndex];
      const questionText = typeof currentQuestion === "object" && currentQuestion !== null
        ? currentQuestion.question
        : currentQuestion;

      const finalAnswer = answer.trim() || "I was unable to answer this question in time.";
      const res = await API.post("/api/interview/evaluate-answer", {
        role,
        question: questionText,
        answer: finalAnswer,
      });
      setFeedback(res.data);
      setAllResults((prev) => [
        ...prev,
        {
          question: questionText,
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
    // Legacy support
    if (currentIndex + 1 >= questions.length) {
      handleFinish();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAnswer("");
      setFeedback(null);
      setTimeUp(false);
    }
  };

  const handleSubmitAssessment = async () => {
    clearInterval(timerRef.current);
    setGrading(true);
    try {
      const answersPayload = questions.map((q, idx) => ({
        question: typeof q === "object" && q !== null ? q.question : q,
        answer: userAnswers[idx] || "No response provided."
      }));

      const resBatch = await API.post("/api/interview/evaluate-session", {
        role,
        answers: answersPayload
      });

      const evaluations = resBatch.data.evaluations;

      const gradedQuestions = questions.map((q, idx) => {
        const questionText = typeof q === "object" && q !== null ? q.question : q;
        const evaluation = evaluations[idx] || { score: 0, feedback: "No feedback generated.", improvements: "" };
        return {
          question: questionText,
          answer: userAnswers[idx] || "No response provided.",
          feedback: evaluation.feedback,
          score: evaluation.score,
          improvements: evaluation.improvements
        };
      });

      setAllResults(gradedQuestions);

      const overallScore = Math.round(
        gradedQuestions.reduce((sum, r) => sum + r.score, 0) / gradedQuestions.length
      );

      const analysisStr = localStorage.getItem("resumeAnalysis");
      const resumeAnalysisObj = analysisStr ? JSON.parse(analysisStr) : null;
      const resumeFilenameVal = localStorage.getItem("resumeFilename") || null;

      // 1. Generate Holistic Summary
      let generatedSummary = null;
      try {
        const summaryRes = await API.post("/api/interview/generate-summary", {
          role,
          questions: gradedQuestions,
          resumeAnalysis: resumeAnalysisObj,
        });
        generatedSummary = summaryRes.data;
        setHolisticSummary(generatedSummary);
      } catch (sumErr) {
        console.error("Failed to generate AI holistic summary:", sumErr);
      }

      // 2. Save Session to MongoDB
      const startTimeStr = localStorage.getItem("interviewStartTime");
      const duration = startTimeStr ? Math.round((Date.now() - Number(startTimeStr)) / 1000) : 0;

      await API.post("/api/interview/save-session", {
        role,
        questions: gradedQuestions,
        overallScore: generatedSummary ? generatedSummary.overallScore : overallScore,
        resumeFilename: resumeFilenameVal,
        resumeAnalysis: resumeAnalysisObj,
        skills: resumeAnalysisObj ? resumeAnalysisObj.skills : [],
        projects: resumeAnalysisObj ? resumeAnalysisObj.projects : [],
        technologies: resumeAnalysisObj ? resumeAnalysisObj.technologies : [],
        candidateLevel: resumeAnalysisObj ? resumeAnalysisObj.candidateLevel : null,
        holisticSummary: generatedSummary,
        duration,
      });

      toast.success("Session saved successfully!");
      setReviewing(true);
      setShowPreSubmitReview(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to finalize session.");
    } finally {
      setGrading(false);
    }
  };

  const handleFinish = async () => {
    // Fallback/Legacy support
    handleSubmitAssessment();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Title
    doc.setFontSize(22);
    doc.setTextColor(20, 184, 166); // Refactored to Teal to match primary accent
    doc.text("InterviewAI Report", pageWidth / 2, y, { align: "center" });
    y += 10;

    // Role and date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Role: ${role}`, pageWidth / 2, (y += 8), { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, (y += 6), {
      align: "center",
    });

    // Overall score
    const overallScore = Math.round(
      allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length
    );
    doc.setFontSize(16);
    doc.setTextColor(99, 102, 241);
    doc.text(`Overall Score: ${overallScore}/10`, pageWidth / 2, (y += 12), {
      align: "center",
    });

    // Divider
    doc.setDrawColor(99, 102, 241);
    doc.line(20, (y += 8), pageWidth - 20, y);
    y += 10;

    // Questions
    allResults.forEach((result, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Question
      doc.setFontSize(12);
      doc.setTextColor(99, 102, 241);
      doc.text(`Q${index + 1}: ${result.question}`, 20, y, {
        maxWidth: pageWidth - 40,
      });
      y += Math.ceil(result.question.length / 80) * 6 + 4;

      // Answer
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Answer: ${result.answer}`, 20, y, {
        maxWidth: pageWidth - 40,
      });
      y += Math.ceil(result.answer.length / 90) * 5 + 4;

      // Feedback
      doc.setTextColor(100, 100, 100);
      doc.text(`Feedback: ${result.feedback}`, 20, y, {
        maxWidth: pageWidth - 40,
      });
      y += Math.ceil(result.feedback.length / 90) * 5 + 4;

      // Score
      doc.setTextColor(99, 102, 241);
      doc.text(`Score: ${result.score}/10`, 20, y);
      y += 10;

      // Divider
      doc.setDrawColor(220, 220, 220);
      doc.line(20, y, pageWidth - 20, y);
      y += 8;
    });

    doc.save(`InterviewAI-${role}-${new Date().toLocaleDateString()}.pdf`);
    toast.success("PDF downloaded!");
  };



  const getScoreVariant = (score) => {
    if (score >= 7) return "success";
    if (score >= 5) return "warning";
    return "danger";
  };

  const formatDuration = (secs) => {
    if (secs === null || secs === undefined || isNaN(secs)) return "N/A";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0) return `${s}s`;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  // 1. Loading Screen
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 p-6 text-center select-none font-sans overflow-hidden">
        <div className="flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner size="lg" />
          <h3 className="text-base font-semibold text-white tracking-tight pt-2">
            Generating mock interview panel...
          </h3>
          <p className="text-zinc-500 text-xs max-w-xs mx-auto leading-relaxed">
            Groq AI is assembling custom questions matching your difficulty level and target role.
          </p>
        </div>
      </div>
    );
  }

  // 1.5. Saving/Grading Screen (AI Session Summary synthesis)
  if (saving || grading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 p-6 text-center select-none font-sans overflow-hidden">
        <div className="flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner size="lg" />
          <h3 className="text-base font-semibold text-white tracking-tight pt-2">
            {grading ? "Evaluating all responses via Groq AI..." : "Synthesizing overall assessment..."}
          </h3>
          <p className="text-zinc-500 text-xs max-w-xs mx-auto leading-relaxed">
            {grading
              ? "Please wait while our senior engineer persona analyzes your technical logic, structural correctness, and coding complexity."
              : "Groq AI is analyzing your technical depth, communication consistency, and calculating your placement stats."}
          </p>
        </div>
      </div>
    );
  }

  // 1.8. Resume Review Screen (Personalized Profile Review)
  if (reviewingResume) {
    const analysisStr = localStorage.getItem("resumeAnalysis");
    const analysis = analysisStr ? JSON.parse(analysisStr) : null;
    
    if (!analysis) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-sans">
          No resume analysis found. Please start from homepage.
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col font-sans select-none overflow-y-auto">
        <header className="sticky top-0 z-50 border-b border-border-subtle bg-zinc-950/70 backdrop-blur-md py-4 px-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-white">Resume Analysis Review</span>
          <span className="text-xs text-zinc-400 font-medium tracking-tight bg-zinc-900 border border-border-subtle px-3 py-1 rounded-full animate-pulse">
            Personalized Mode
          </span>
        </header>

        <main className="max-w-3xl w-full mx-auto px-6 py-10 space-y-8 flex-grow">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">AI Profile Assessment</h1>
            <p className="text-xs text-zinc-500">
              Review how Groq AI evaluated your technical background and edit your target role if needed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summary Box */}
            <div className="p-6 rounded-2xl border border-border-subtle bg-zinc-900/40 md:col-span-2 space-y-3">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block">AI Summary</span>
              <p className="text-zinc-350 text-sm leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Level and Experience */}
            <div className="p-6 rounded-2xl border border-border-subtle bg-zinc-900/40 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Candidate Level</span>
                <span className="text-sm font-semibold text-white">{analysis.candidateLevel || "Not Detected"}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Years of Experience</span>
                <span className="text-sm font-semibold text-white">{analysis.yearsOfExperience || "Not Detected"}</span>
              </div>
            </div>

            {/* Target Role Editor */}
            <div className="p-6 rounded-2xl border border-border-subtle bg-zinc-900/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Confirmed Target Role</span>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-primary/50 text-white rounded-xl px-4 h-11 text-xs outline-none transition"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-3 leading-normal">
                You can adjust this role if the parsed value is incorrect. We will tailor the questions accordingly.
              </p>
            </div>

            {/* Skills & Technologies */}
            <div className="p-6 rounded-2xl border border-border-subtle bg-zinc-900/40 space-y-4 md:col-span-2">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Detected Core Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skills?.map((s, idx) => (
                    <span key={idx} className="text-[9px] font-bold bg-zinc-900 text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Technologies & Frameworks</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.technologies?.map((t, idx) => (
                    <span key={idx} className="text-[9px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Areas to Improve */}
            <div className="p-6 rounded-2xl border border-border-subtle bg-zinc-900/40 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Key Strengths</span>
              <ul className="space-y-1.5 text-xs text-zinc-400 list-disc list-inside">
                {analysis.strengths?.map((s, idx) => (
                  <li key={idx} className="leading-relaxed">{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-border-subtle bg-zinc-900/40 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Areas for Improvement</span>
              <ul className="space-y-1.5 text-xs text-zinc-400 list-disc list-inside">
                {analysis.missingSkills?.map((m, idx) => (
                  <li key={idx} className="leading-relaxed">{m}</li>
                ))}
              </ul>
            </div>

            {/* Highlighted Projects */}
            <div className="p-6 rounded-2xl border border-border-subtle bg-zinc-900/40 space-y-3 md:col-span-2">
              <span className="text-xs font-bold text-zinc-350 uppercase tracking-wider block">Highlighted Projects</span>
              <div className="space-y-3">
                {analysis.projects?.map((p, idx) => (
                  <div key={idx} className="p-3 bg-zinc-950/50 border border-border-subtle/30 rounded-xl text-xs text-zinc-400 leading-relaxed">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              localStorage.setItem("selectedRole", role);
              setReviewingResume(false);
              generateQuestions(analysis);
            }}
            className="w-full h-12 text-sm font-semibold"
          >
            Start Tailored AI Interview
          </Button>
        </main>
      </div>
    );
  }

  // 1.9. Pre-Submission Review Screen
  if (showPreSubmitReview) {
    const unansweredCount = userAnswers.filter((ans) => !ans || !ans.trim()).length;
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col font-sans select-none overflow-y-auto text-zinc-100">
        <header className="sticky top-0 z-50 border-b border-border-subtle bg-zinc-950/70 backdrop-blur-md py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-1.5">
              <FileText size={16} className="text-primary" />
            </div>
            <span className="text-sm font-semibold text-white">Assessment Overview</span>
          </div>
          <span className="text-xs text-zinc-400 font-medium tracking-tight bg-zinc-900 border border-border-subtle px-3 py-1 rounded-full">
            {role}
          </span>
        </header>

        <main className="max-w-3xl w-full mx-auto px-6 py-10 space-y-8 flex-grow">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Review Your Assessment</h1>
            <p className="text-xs text-zinc-500">
              Check all answer completion statuses. Highlighted questions are unanswered. Click any question card to edit.
            </p>
          </div>

          {unansweredCount > 0 && (
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs flex items-center gap-3">
              <AlertTriangle size={16} className="shrink-0" />
              <span>You have {unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}. You can click the cards below to complete them before final submission.</span>
            </div>
          )}

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const questionText = typeof q === "object" && q !== null ? q.question : q;
              const ans = userAnswers[idx];
              const isAnswered = ans && ans.trim().length > 0;
              return (
                <div
                  key={idx}
                  onClick={() => navigateToQuestion(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer hover:border-zinc-700 flex flex-col gap-3 ${
                    isAnswered
                      ? "border-border-subtle bg-zinc-900/20 hover:bg-zinc-900/30"
                      : "border-red-900/30 bg-red-950/5 hover:bg-red-950/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-455">
                      Question {idx + 1}
                    </span>
                    <Badge variant={isAnswered ? "success" : "danger"}>
                      {isAnswered ? "Completed" : "Unanswered"}
                    </Badge>
                  </div>

                  <p className="text-sm font-semibold text-white leading-relaxed truncate">
                    {questionText}
                  </p>

                  <div className="text-xs text-zinc-500 bg-zinc-950/40 p-3 rounded-lg border border-border-subtle/30 truncate max-w-full font-mono">
                    {isAnswered ? ans : <span className="text-red-400/80 italic">No answer provided. Click here to answer.</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border-subtle">
            <Button
              variant="outline"
              onClick={() => {
                setShowPreSubmitReview(false);
                navigateToQuestion(Math.min(currentIndex, questions.length - 1));
              }}
              className="w-full sm:w-auto ml-auto"
            >
              Back to Assessment
            </Button>
            <Button
              onClick={handleSubmitAssessment}
              className="w-full sm:w-auto"
            >
              Submit Interview & Grade
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // 2. Review Screen
  if (reviewing && !finished) {
    const overallScore = Math.round(
      allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length
    );
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col font-sans select-none">
        <header className="sticky top-0 z-50 border-b border-border-subtle bg-zinc-950/70 backdrop-blur-md py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-1.5">
              <FileText size={16} className="text-primary" />
            </div>
            <span className="text-sm font-semibold text-white">Review Summary</span>
          </div>
          <span className="text-xs text-zinc-400 font-medium tracking-tight bg-zinc-900 border border-border-subtle px-3 py-1 rounded-full">
            {role}
          </span>
        </header>

        <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-10 space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Review Your Answers</h1>
            <p className="text-xs text-zinc-500">
              Inspect AI scoring feedbacks and download your placement report summary sheet.
            </p>
          </div>

          <div className="space-y-4">
            {allResults.map((result, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-border-subtle bg-zinc-900/40 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Question {index + 1}
                  </span>
                  <Badge variant={getScoreVariant(result.score)}>
                    Score: {result.score}/10
                  </Badge>
                </div>

                <p className="text-sm font-semibold text-white leading-relaxed">
                  {result.question}
                </p>

                <div className="space-y-3 pt-3 border-t border-border-subtle text-xs">
                  <div>
                    <span className="font-semibold text-zinc-400 block mb-1">Your Submission</span>
                    <p className="text-zinc-300 font-mono bg-zinc-950 p-3 rounded-lg border border-border-subtle/30 overflow-x-auto whitespace-pre-wrap">
                      {result.answer}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-400 block mb-1">AI Evaluation Notes</span>
                    <p className="text-zinc-400 bg-zinc-900/20 p-3 rounded-lg border border-border-subtle/25">
                      {result.feedback}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Holistic AI Session Summary Card */}
          {holisticSummary && (
            <div className="p-6 rounded-2xl border border-border-subtle bg-zinc-900/40 space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary border-b border-border-subtle pb-4">
                <Sparkles size={16} />
                <span>Holistic AI Performance Summary</span>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950/40 border border-border-subtle/30 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Technical Knowledge</span>
                  <p className="text-zinc-300 text-xs leading-relaxed">{holisticSummary.technicalKnowledge}</p>
                </div>
                <div className="p-4 bg-zinc-950/40 border border-border-subtle/30 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Communication</span>
                  <p className="text-zinc-300 text-xs leading-relaxed">{holisticSummary.communication}</p>
                </div>
                <div className="p-4 bg-zinc-950/40 border border-border-subtle/30 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Problem Solving</span>
                  <p className="text-zinc-300 text-xs leading-relaxed">{holisticSummary.problemSolving}</p>
                </div>
                <div className="p-4 bg-zinc-950/40 border border-border-subtle/30 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Confidence</span>
                  <p className="text-zinc-300 text-xs leading-relaxed">{holisticSummary.confidence}</p>
                </div>
              </div>

              {/* Strengths, Weaknesses, Topics to Improve */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border-subtle/40">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Core Strengths</span>
                  <ul className="space-y-1.5 text-xs text-zinc-400 list-disc list-inside">
                    {holisticSummary.strengths?.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">Key Weaknesses</span>
                  <ul className="space-y-1.5 text-xs text-zinc-400 list-disc list-inside">
                    {holisticSummary.weaknesses?.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-sans">Topics to Improve</span>
                  <ul className="space-y-1.5 text-xs text-zinc-400 list-disc list-inside">
                    {holisticSummary.topicsToImprove?.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Readiness & Resume Consistency */}
              <div className="pt-4 border-t border-border-subtle/40 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950/30 border border-border-subtle/20 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-sans">Interview Readiness</span>
                  <p className="text-zinc-300 text-xs leading-relaxed">{holisticSummary.interviewReadiness}</p>
                </div>

                {localStorage.getItem("interviewMode") === "personalized" && (
                  <div className="p-4 bg-zinc-950/30 border border-border-subtle/20 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-sans">Resume Consistency Check</span>
                    <p className="text-zinc-300 text-xs leading-relaxed">{holisticSummary.resumeConsistency}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Report summary card */}
          <div className="p-8 rounded-2xl border border-border-subtle bg-zinc-900/40 text-center space-y-6">
            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider font-sans">
                Overall Session Score
              </p>
              <h2 className="text-5xl font-extrabold text-white">
                {holisticSummary ? holisticSummary.overallScore : overallScore}/10
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                leftIcon={<Download size={14} />}
                onClick={downloadPDF}
              >
                Download Report PDF
              </Button>
              <Button
                variant="primary"
                className="w-full sm:w-auto"
                leftIcon={<Award size={14} />}
                onClick={() => {
                  clearActiveSession();
                  setFinished(true);
                }}
              >
                Finish Session
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. Final Trophy Screen
  if (finished) {
    const displayOverallScore = holisticSummary ? holisticSummary.overallScore : Math.round(
      allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length
    );
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 select-none font-sans relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <Card className="max-w-[420px] w-full p-8 border border-border-subtle bg-zinc-900/40 text-center space-y-8 relative z-10" hover={false}>
          <div className="space-y-4">
            <div className="h-16 w-16 mx-auto flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <Award size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Interview Complete!</h1>
              <p className="text-xs text-zinc-500 mt-1">
                Your answers have been graded and recorded in history logs.
              </p>
            </div>
          </div>

          <div className="space-y-1 bg-zinc-950/50 py-4 rounded-xl border border-border-subtle">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Overall Score Card
            </p>
            <p className="text-4xl font-extrabold text-white">{displayOverallScore}/10</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="primary" size="sm" onClick={() => navigate("/")} leftIcon={<RotateCcw size={14} />}>
              Try Again
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate("/history")} leftIcon={<FileText size={14} />}>
              View Logs
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 4. Active Assessment Workspace Panel
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans select-none overflow-x-hidden lg:overflow-hidden lg:h-screen">
      {/* Assessment Header */}
      <header className="sticky top-0 z-20 h-16 shrink-0 border-b border-border-subtle bg-zinc-950/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
                clearActiveSession();
                navigate("/");
              }
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle hover:bg-zinc-900 text-zinc-400 hover:text-white transition duration-200"
            title="Exit assessment"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">{role}</h2>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider hidden sm:block">
              AI Assessment Panel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 text-xs">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 hidden xs:inline sm:inline">
                Suggested: {formatDuration(questions[currentIndex]?.estimatedTime || 120)}
              </span>
              <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-2 sm:pl-2.5">
                <Clock size={13} className="text-zinc-500" />
                <span
                  className={`font-semibold font-mono text-sm ${
                    timeLeft <= 30 ? "text-red-400 animate-pulse" : "text-emerald-400"
                  }`}
                >
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                </span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-1 w-20 sm:w-28 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 30 ? "bg-red-400" : "bg-emerald-400"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    (timeLeft / (Number(questions[currentIndex]?.estimatedTime) || 120)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          <Badge variant="neutral">
            Q {currentIndex + 1} of {questions.length}
          </Badge>
        </div>
      </header>

      {/* Main Split Layout Workspace */}
      <div className="flex flex-col lg:flex-row flex-grow overflow-y-auto lg:overflow-hidden relative text-zinc-100">
        {/* Workspace Sidebar (Desktop left / Mobile top) */}
        <aside className="w-full lg:w-[280px] lg:h-full border-b lg:border-b-0 lg:border-r border-border-subtle bg-zinc-950 flex flex-col shrink-0">
          {/* Top Progress bar line */}
          <div className="h-[2px] bg-zinc-900 w-full relative">
            <div
              className="absolute h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Navigator */}
          <div className="p-4 flex-grow overflow-y-auto space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">
                Question Navigator
              </p>
              <button
                type="button"
                onClick={() => setShowPreSubmitReview(true)}
                className="text-[9px] font-bold text-primary hover:underline px-2 py-0.5 border border-primary/20 rounded bg-primary/5 cursor-pointer uppercase tracking-wider"
              >
                Review Summary
              </button>
            </div>

            <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none select-none">
              {questions.map((_, i) => {
                const isCurrent = i === currentIndex;
                const ans = userAnswers[i];
                const isAnswered = ans && ans.trim().length > 0;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => navigateToQuestion(i)}
                    className={`flex items-center gap-2 lg:gap-3 px-3 py-2 lg:py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer text-left shrink-0 ${
                      isCurrent
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : isAnswered
                          ? "bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                          : "bg-red-950/5 border-red-900/20 text-red-400 hover:border-red-900/40 hover:bg-red-950/10"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] border shrink-0 ${
                        isCurrent
                          ? "bg-primary border-primary text-white"
                          : isAnswered
                            ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                            : "bg-red-950 border-red-900/30 text-red-400"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className="hidden lg:inline truncate">Question {i + 1}</span>
                    <span className="ml-auto text-[8px] uppercase tracking-wider font-semibold hidden lg:inline">
                      {isCurrent ? (
                        <ChevronRight size={12} className="text-primary animate-pulse" />
                      ) : isAnswered ? (
                        <span className="text-emerald-400">Filled</span>
                      ) : (
                        <span className="text-red-400">Empty</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Workspace Code Editor & Evaluation Panel */}
        <main className="flex-grow flex flex-col bg-zinc-900/10 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-3xl w-full mx-auto space-y-6 flex-grow flex flex-col justify-between">
            
            {/* Active Question Prompt Box */}
            <div className="space-y-4">
              <div className="p-5 sm:p-6 rounded-2xl border border-border-subtle bg-zinc-900/40 relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider">
                    <Terminal size={14} />
                    <span>Active Query</span>
                  </div>

                  {/* Metadata Badges */}
                  {typeof questions[currentIndex] === "object" && questions[currentIndex] !== null && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {questions[currentIndex].category && (
                        <span className="text-[10px] font-bold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 px-2.5 py-0.5 rounded-full leading-none">
                          {questions[currentIndex].category}
                        </span>
                      )}
                      {questions[currentIndex].estimatedTime && (
                        <span className="text-[10px] font-bold uppercase bg-zinc-800 text-zinc-350 border border-zinc-705 px-2.5 py-0.5 rounded-full leading-none">
                          ⏱️ {questions[currentIndex].estimatedTime}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-semibold leading-relaxed text-white whitespace-pre-wrap">
                  {typeof questions[currentIndex] === "object" && questions[currentIndex] !== null
                    ? questions[currentIndex].question
                    : questions[currentIndex]}
                </h3>

                {/* Skills tags */}
                {typeof questions[currentIndex] === "object" &&
                  questions[currentIndex] !== null &&
                  questions[currentIndex].skills &&
                  questions[currentIndex].skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-zinc-800">
                      {questions[currentIndex].skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[9px] font-extrabold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md leading-none"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
              </div>

              {/* Monospaced Response Workspace */}
              <div className="space-y-4">
                <div className="relative rounded-2xl border border-border-subtle bg-zinc-950 overflow-hidden shadow-inner">
                  <div className="h-9 bg-zinc-900 border-b border-border-subtle/60 px-4 flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider select-none shrink-0">
                    <span>Response Buffer</span>
                    <span className="font-mono">plainText / UTF-8</span>
                  </div>

                  <textarea
                    className="w-full bg-transparent px-4 py-4 text-sm font-mono text-zinc-200 outline-none resize-none leading-relaxed min-h-[180px] max-h-[350px] lg:min-h-[220px]"
                    placeholder={
                      timeUp
                        ? "Auto submitting response due to timeout..."
                        : "Input your technical logic, code structure, or STAR explanations here..."
                    }
                    value={answer}
                    onChange={(e) => !timeUp && handleAnswerChange(e.target.value)}
                    disabled={timeUp}
                  />
                </div>

                {/* Navigation and Submission Buttons row */}
                <div className="flex items-center justify-between gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={() => navigateToQuestion(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    className="flex-1 sm:flex-none sm:w-32 h-11"
                  >
                    Previous
                  </Button>

                  <div className="hidden sm:flex text-zinc-550 text-xs font-semibold font-mono items-center justify-center flex-grow py-2">
                    Question {currentIndex + 1} of {questions.length}
                  </div>

                  {currentIndex < questions.length - 1 ? (
                    <Button
                      variant="primary"
                      onClick={() => navigateToQuestion(currentIndex + 1)}
                      className="flex-1 sm:flex-none sm:w-32 h-11"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => setShowPreSubmitReview(true)}
                      className="flex-1 sm:flex-none sm:w-32 h-11"
                    >
                      Review & Submit
                    </Button>
                  )}
                </div>
              </div>

            </div>

            {/* Micro disclaimer branding */}
            <div className="py-4 text-center">
              <span className="text-[10px] text-zinc-650 font-semibold tracking-widest uppercase">
                InterviewAI &copy; {new Date().getFullYear()}
              </span>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Interview;
