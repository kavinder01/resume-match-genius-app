import { motion } from "framer-motion";
import { Zap, Users, ShieldCheck, BarChart, Clock, Search } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI-Based Resume Screening",
    description: "Automated NLP-powered parsing extracts skills, experience, and qualifications from every resume instantly.",
  },
  {
    icon: BarChart,
    title: "Intelligent Candidate Ranking",
    description: "Weight-based scoring algorithms rank candidates by skill match percentage, experience relevance, and education.",
  },
  {
    icon: Users,
    title: "Recruiter Dashboard",
    description: "A centralized dashboard showing ranked candidates, match percentages, resume summaries, and interview shortlist options.",
  },
  {
    icon: Search,
    title: "Resume Keyword Analysis",
    description: "Deep keyword frequency and semantic similarity analysis ensures no qualified candidate is ever overlooked.",
  },
  {
    icon: Clock,
    title: "Application Tracking",
    description: "Track every candidate's journey from application to offer — with full transparency at every stage.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Scalable",
    description: "Built with secure authentication, encrypted data transport, and a backend architecture that scales with your hiring needs.",
  },
];

const Features = () => {
  return (
    <section className="py-28 bg-card" id="features">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need to hire better
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From AI screening to analytics — a complete recruitment intelligence platform.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-background rounded-2xl p-7 border border-border hover:border-primary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
