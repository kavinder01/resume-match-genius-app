import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const navItems = ["Platform", "Solutions", "How It Works", "Features"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      if (role === "recruiter") navigate("/recruiter");
      else if (role === "applicant") navigate("/applicant");
      else navigate("/onboarding");
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <a href="/" className="font-display text-xl font-bold tracking-tight text-foreground">
          SmartRecruit<span className="text-primary">AI</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={handleGetStarted}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => { signOut(); }}
                className="inline-flex items-center justify-center rounded-full border border-border text-foreground px-5 py-2 text-sm font-medium hover:bg-card transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth")}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="inline-flex items-center justify-center rounded-full bg-foreground text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background border-b border-border px-6 pb-6 space-y-4"
        >
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="block text-sm font-medium text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
          <button
            onClick={() => { setMobileOpen(false); handleGetStarted(); }}
            className="block w-full text-center rounded-full bg-foreground text-primary-foreground px-5 py-2.5 text-sm font-medium"
          >
            {user ? "Dashboard" : "Get Started"}
          </button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
