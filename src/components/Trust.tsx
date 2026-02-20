import { motion } from "framer-motion";
import { Lock, ShieldCheck, Database, Eye, Key, Users } from "lucide-react";

const items = [
  { icon: Lock, title: "Encrypted Transmission", desc: "All traffic and candidate data transported securely via SSL encryption." },
  { icon: Eye, title: "Access Control", desc: "Role-based access ensures only authorized recruiters view sensitive data." },
  { icon: Database, title: "Secure Database", desc: "PostgreSQL with structured schema, indexing, and data integrity checks." },
  { icon: ShieldCheck, title: "Data Privacy", desc: "Full compliance with data protection standards and privacy regulations." },
  { icon: Key, title: "Secure Authentication", desc: "Robust login system with encrypted credentials and session management." },
  { icon: Users, title: "Team Workspaces", desc: "Isolated workspaces for different recruitment teams and departments." },
];

const Trust = () => {
  return (
    <section className="py-28 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Trust and security at every level
          </h2>
          <p className="text-lg opacity-70 max-w-xl mx-auto">
            Your candidate data is protected with enterprise-grade security measures.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6"
            >
              <item.icon className="w-6 h-6 mb-4 text-glow" />
              <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm opacity-60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;
