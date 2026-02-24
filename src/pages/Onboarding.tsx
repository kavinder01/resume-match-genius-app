import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, User, ArrowRight } from "lucide-react";
import { useEffect } from "react";

const Onboarding = () => {
  const { user, role, setRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!loading && role === "recruiter") navigate("/recruiter");
    if (!loading && role === "applicant") navigate("/applicant");
  }, [loading, user, role, navigate]);

  const handleSelect = async (selectedRole: "recruiter" | "applicant") => {
    await setRole(selectedRole);
    navigate(selectedRole === "recruiter" ? "/recruiter" : "/applicant");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        <a href="/" className="font-display text-2xl font-bold text-foreground mb-8 inline-block">
          SmartRecruit<span className="text-primary">AI</span>
        </a>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          How will you use SmartRecruitAI?
        </h1>
        <p className="text-muted-foreground text-lg mb-12">
          Choose your role to get a personalized experience.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ y: -4 }}
            onClick={() => handleSelect("recruiter")}
            className="group p-8 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all text-left"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <Briefcase className="text-primary" size={28} />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">I'm a Recruiter</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Post jobs, review AI-ranked candidates, and manage your hiring pipeline.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Continue <ArrowRight size={14} />
            </span>
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            onClick={() => handleSelect("applicant")}
            className="group p-8 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all text-left"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <User className="text-primary" size={28} />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">I'm an Applicant</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Upload your resume, track applications, and see your AI match scores.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Continue <ArrowRight size={14} />
            </span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
