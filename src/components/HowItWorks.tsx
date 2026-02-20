import { motion } from "framer-motion";
import { FileUp, Brain, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: FileUp,
    title: "Upload",
    subtitle: "Resumes flow in effortlessly",
    description:
      "Candidates upload resumes in PDF or DOC format. Recruiters post jobs with required skills, experience, and qualifications — the system handles the rest.",
  },
  {
    icon: Brain,
    title: "Parse & Match",
    subtitle: "AI extracts what matters",
    description:
      "Our NLP engine extracts skills, experience, education, and certifications. Using TF-IDF and cosine similarity, every resume is matched against the job description with precision.",
  },
  {
    icon: BarChart3,
    title: "Rank & Decide",
    subtitle: "Instant clarity on who fits best",
    description:
      "Candidates are ranked automatically based on skill match percentage, experience relevance, and education weightage — giving recruiters a decision-ready dashboard.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const HowItWorks = () => {
  return (
    <section className="py-28 bg-background" id="how-it-works">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Don't just screen, understand
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SmartRecruit brings together AI parsing, intelligent matching, and ranked insights — so you hire the right people, every time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-1">
                {step.title}
              </h3>
              <p className="text-sm font-medium text-primary mb-3">{step.subtitle}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
