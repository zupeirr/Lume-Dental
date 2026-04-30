import { motion } from "motion/react";

export default function CTASection({ onOpenBooking }: { onOpenBooking: () => void }) {
  return (
    <section className="container-wide py-24 mb-12">
      <div className="bg-white p-12 md:p-20 rounded-lg flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 bg-gradient-to-l from-black to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tighter">Ready for your transformation?</h2>
          <p className="text-lg text-gray-500 font-medium">
            Join hundreds of patients who have discovered the Lume difference. Schedule your consultation today.
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenBooking}
          className="relative z-10 px-10 py-5 bg-black text-white rounded-lg font-bold text-lg shadow-xl transition-all uppercase tracking-[3px]"
        >
          Book Consultation
        </motion.button>
      </div>
    </section>
  );
}
