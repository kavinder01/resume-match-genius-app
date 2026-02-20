import { motion } from "framer-motion";
import heroImage from "@/assets/hero-illustration.png";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-hero" id="platform">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground mb-6">
            Hire smarter at the speed of AI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            In a world drowning in resumes, SmartRecruit turns applications into clarity your team can act on — instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full bg-foreground text-primary-foreground px-8 py-3.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              Learn more
            </a>
            <a
              href="#cta"
              className="inline-flex items-center justify-center rounded-full border border-foreground text-foreground px-8 py-3.5 text-sm font-semibold hover:bg-foreground hover:text-primary-foreground transition-colors"
            >
              Request a demo
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <img
            src={heroImage}
            alt="AI-powered resume screening process showing resumes flowing through an intelligent brain and producing ranked candidate profiles"
            className="w-full rounded-2xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
