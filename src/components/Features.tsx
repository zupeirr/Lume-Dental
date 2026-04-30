import { motion } from "motion/react";
import { Microscope, GraduationCap, ShieldCheck, User } from "lucide-react";

const features = [
  {
    icon: <Microscope size={28} />,
    title: "State-of-the-art equipment",
    description: "Precision diagnostic tools and robotic assistance for flawlessly accurate dental procedures."
  },
  {
    icon: <GraduationCap size={28} />,
    title: "Experienced professionals",
    description: "Our world-class dental experts bring decades of collective expertise to every patient's chair."
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Pain-free treatments",
    description: "Gentle techniques and innovative anesthesia delivery ensuring your absolute comfort throughout."
  },
  {
    icon: <User size={28} />,
    title: "Personalized approach",
    description: "Tailored care plans designed specifically for your unique dental anatomy and aesthetic goals."
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-bg-deep border-y border-white/5">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tighter">Why Choose Us</h2>
          <p className="text-text-muted font-medium">Providing a sterile, organized, and friendly environment where patient comfort is our highest priority.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-dark p-8 hover:bg-white/[0.02] transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white mb-6 group-hover:border-white/30 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
