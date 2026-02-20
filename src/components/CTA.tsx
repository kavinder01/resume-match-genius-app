import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-28 bg-hero" id="cta">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
            Hire smarter, together
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Join forward-thinking teams using AI to find the right talent faster than ever before.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-foreground text-primary-foreground px-8 py-3.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              Get started free
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-foreground text-foreground px-8 py-3.5 text-sm font-semibold hover:bg-foreground hover:text-primary-foreground transition-colors"
            >
              Request a demo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
