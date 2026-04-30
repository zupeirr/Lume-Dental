import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-bg-deep">
      <div className="container-wide text-center">
        <h2 className="text-4xl font-bold mb-16 tracking-tighter">What Our Patients Say</h2>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="absolute -top-12 -left-8 text-white/5 -z-10">
            <Quote size={120} fill="currentColor" />
          </div>
          
          <div className="card-dark p-12 md:p-20 relative z-10">
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-white/20" fill="currentColor" />
              ))}
            </div>
            
            <p className="text-2xl md:text-4xl font-bold leading-tight mb-12 text-white tracking-tight">
              "The most peaceful dental experience of my life. From the moment I walked in, the clinical precision mixed with genuine warmth put my anxiety to rest. My results are perfect."
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 p-0.5 bg-white/5">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_hCJ2YeJhiGfdcWNmEVZ8_KsX3Fw3F7BzbDzQcMc5A6-EXcqN6sPndVjl7slXc7-npxnUqVZp27BfslYhkuydNRQ1Y1bPlywJwx9IDNBs7mL7eOrO-2ue_cIQkJgIEn_n68uh160ardF6tAOHbrev9XRcw42o8pSs7Q1jgT41GvOkTjhm5ZkHLCIug6WhgOLZobqt9-w5Em13pze5ViPzcUyMBxCpjXPg4U2-H_OoGVIpYPrtdmZHTCVAoQWOx6yxlg5aPDJRqukX" 
                  alt="Sarah J." 
                  className="w-full h-full object-cover rounded-full filter grayscale" 
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-white tracking-tight">Sarah Jenkins</p>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Patient since 2021</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
