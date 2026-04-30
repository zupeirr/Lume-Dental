import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";

export default function Hero({ onOpenBooking }: { onOpenBooking: () => void }) {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-bg-deep">
      <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue/20 border border-brand-blue/30 rounded-full text-brand-blue mb-8">
            <CheckCircle size={16} className="text-secondary-fixed" />
            <span className="text-xs font-bold tracking-tight">Now accepting new patients</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tighter">
            Your Perfect Smile Starts with Lume Dental
          </h1>
          
          <p className="text-lg text-text-muted max-w-lg mb-12 leading-relaxed mx-auto lg:mx-0 font-medium">
            Experience clinical excellence paired with a compassionate, human-centric approach to oral health. Our precision-focused treatments ensure lasting confidence.
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenBooking}
              className="px-8 py-4 bg-white text-black rounded-full font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-gray-100 transition-all"
            >
              Book Appointment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border-2 border-white/10 rounded-full font-bold text-sm text-white hover:bg-white/5 transition-all"
            >
              Explore Our Services
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/5 blur-3xl -z-10 rounded-full" />
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-2 bg-white/5">
            <img 
              src="/regenerated_image_1777535062325.png" 
              alt="Lume Dental Excellence Clinic"
              className="w-full h-[600px] object-cover rounded-xl shadow-2xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
