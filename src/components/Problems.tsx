import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const problems = [
  { problem: "Manual resume screening", solution: "Automated AI screening in seconds" },
  { problem: "Time-consuming hiring process", solution: "Instant ranking & shortlisting" },
  { problem: "Human bias in candidate selection", solution: "Algorithm-based objective scoring" },
  { problem: "Poor candidate management", solution: "Centralized recruiter dashboard" },
  { problem: "Lack of hiring analytics", solution: "Match percentages & detailed reports" },
  { problem: "Missed qualified candidates", solution: "Deep keyword & semantic analysis" },
];

const Problems = () => {
  return (
    <section className="py-28 bg-background" id="solutions">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Problems we solve
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Traditional recruitment is broken. Here's how SmartRecruit fixes it.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 bg-card rounded-xl p-5 border border-border"
            >
              <span className="text-sm text-muted-foreground line-through min-w-[200px] md:min-w-[260px]">
                {p.problem}
              </span>
              <ArrowRight className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-medium text-foreground">{p.solution}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problems;
