import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import RoleGrid from "../components/home/RoleGrid";
import HowItWorks from "../components/home/HowItWorks";
import Showcase from "../components/home/Showcase";
import Features from "../components/home/Features";
import CTA from "../components/home/CTA";
import API from "../utils/api";
import toast from "react-hot-toast";

const roles = [
  { title: "Full Stack Developer" },
  { title: "Frontend Developer" },
  { title: "Backend Developer" },
  { title: "Data Scientist" },
  { title: "DevOps Engineer" },
  { title: "Product Manager" },
  { title: "UI/UX Designer" },
  { title: "Machine Learning Engineer" },
];

function Home({ toggleTheme, theme }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [customRole, setCustomRole] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);
  
  // Resume Personalization States
  const [interviewMode, setInterviewMode] = useState("quick"); // "quick" | "personalized"
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFilename, setResumeFilename] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    const preselect = localStorage.getItem("preselectPersonalized");
    if (preselect === "true") {
      setInterviewMode("personalized");
      localStorage.removeItem("preselectPersonalized");
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const startInterview = async (roleOverride = "") => {
    const roleVal = roleOverride || customRole;
    if (!roleVal.trim() && interviewMode === "quick") {
      toast.error("Please search or specify a target role!");
      return;
    }

    // Clear any existing active session data
    localStorage.removeItem("activeQuestions");
    localStorage.removeItem("activeQuestionIndex");
    localStorage.removeItem("activeUserAnswers");
    localStorage.removeItem("activeQuestionTimers");

    if (interviewMode === "personalized") {
      if (!resumeFile) {
        toast.error("Please drag & drop or browse your resume first!");
        return;
      }

      setAnalyzing(true);
      try {
        const formData = new FormData();
        formData.append("resume", resumeFile);

        const res = await API.post("/api/interview/analyze-resume", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Save analysis data
        localStorage.setItem("interviewMode", "personalized");
        localStorage.setItem("resumeFilename", res.data.filename);
        localStorage.setItem("resumeAnalysis", JSON.stringify(res.data.analysis));
        localStorage.setItem("selectedRole", res.data.analysis.primaryRole || roleVal.trim() || "Developer");
        localStorage.setItem("difficulty", difficulty);
        localStorage.setItem("questionCount", questionCount);

        toast.success("Resume analyzed successfully!");
        navigate("/interview");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to analyze resume. Try again!");
      } finally {
        setAnalyzing(false);
      }
    } else {
      // Quick Mode - Generate questions before navigating
      setAnalyzing(true);
      try {
        const payload = {
          role: roleVal.trim(),
          difficulty,
          questionCount,
        };
        const res = await API.post("/api/interview/generate-questions", payload);
        const loadedQuestions = res.data.questions;

        const initialAnswers = new Array(loadedQuestions.length).fill("");
        const initialTimers = loadedQuestions.map((q) => Number(q.estimatedTime) || 120);

        localStorage.setItem("interviewMode", "quick");
        localStorage.removeItem("resumeFilename");
        localStorage.removeItem("resumeAnalysis");
        localStorage.setItem("selectedRole", roleVal.trim());
        localStorage.setItem("difficulty", difficulty);
        localStorage.setItem("questionCount", questionCount);

        localStorage.setItem("activeQuestions", JSON.stringify(loadedQuestions));
        localStorage.setItem("activeQuestionIndex", "0");
        localStorage.setItem("activeUserAnswers", JSON.stringify(initialAnswers));
        localStorage.setItem("activeQuestionTimers", JSON.stringify(initialTimers));
        localStorage.setItem("interviewStartTime", Date.now().toString());

        toast.success("Interview session ready!");
        navigate("/interview");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to generate questions. Please try again.");
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleCustomRole = () => {
    startInterview();
  };

  const handleStartInterviewCTA = () => {
    if (customRole.trim()) {
      startInterview();
    } else {
      // Scroll to the top and focus the role input
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        const input = document.querySelector('input[placeholder*="iOS Developer"]');
        if (input) {
          input.focus();
        }
      }, 600);
    }
  };

  const handleShowcaseCTA = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      const input = document.querySelector('input[placeholder*="iOS Developer"]');
      if (input) {
        input.focus();
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col font-sans text-zinc-100">
      <Navbar
        user={user}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        <Hero
          customRole={customRole}
          setCustomRole={setCustomRole}
          handleCustomRole={handleCustomRole}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          isMobile={isMobile}
          interviewMode={interviewMode}
          setInterviewMode={setInterviewMode}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          resumeFilename={resumeFilename}
          setResumeFilename={setResumeFilename}
          analyzing={analyzing}
        />

        <RoleGrid
          roles={roles}
          startInterview={(r) => startInterview(r)}
          setCustomRole={setCustomRole}
        />

        <HowItWorks />

        <Showcase onCTAClick={handleShowcaseCTA} />

        <Features />

        <CTA onStart={handleStartInterviewCTA} />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
