import { motion } from "motion/react";
import { Sparkles, Activity, ShieldPlus, Check } from "lucide-react";

const services = [
  {
    title: "Cosmetic Dentistry",
    description: "Enhance the aesthetics of your smile with premium veneers, whitening, and smile contouring.",
    icon: <Sparkles className="text-brand-blue-dark" />,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1nSqxo1i0irC_dlAJU5q-9MRcKxSFwnAFN0L8mdsaGh-ZZUpQop34_GZpVJbTBmWhUerUVvnLoJlztBSV8EIbl3l7Rq7EoM_giANRqj4mNHH-3l8AsECOuFcN5FG62y8QvWOnFDmRVfnzAMDyOW18iWaDE481croVfT2RK_UnqvqYaegv1ora-t0jy7BldoCgoPzGn_NbAQREsiK24l5S152hDrXNe_jy3Ddlc0k4bBat10zrk3QdarBiRA1ZUiP32PCRiJMd8Z4Z",
    bullets: ["Professional Whitening", "Porcelain Veneers"]
  },
  {
    title: "Dental Implants",
    description: "Permanent, natural-looking tooth replacement solutions using biocompatible titanium materials.",
    icon: <Activity className="text-brand-blue-dark" />,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVm84C_CdaVts5Zxez16ARAHDZ8GUNeca-HrmpS6-m1G1Io4V8hu89Yc0gA61IWzv3aMsTgOVtjJRdaidW3IHGwd3qNyImbRwsmKa25wszDTtY_CecBAw27fPSIbgsNgjpj1wIa2a9VsprjAiSG2moMCvvEEHTxjDWzRo6wdr_hQWRQbt2PqG2LeXHxmY4WMvHrjcldTeH7lU5XiTBbQkImc734uXuN0csp0_pDGoSSo1YxSwOXw-tUG8Pz5aRO4fxFDVGpSQkft6r",
    bullets: ["Full Arch Reconstruction", "Guided Surgery"]
  },
  {
    title: "Restorative Care",
    description: "Restoring function and health to damaged teeth with durable, tooth-colored materials.",
    icon: <ShieldPlus className="text-brand-blue-dark" />,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkxawpiEiFVAMUjUdIiRX9AxDXvkAjZeKG8fOs6TSBNy1Gv0VZeZisliT7lHW-gRqOo4xSX838_GUr7DDiTOfiU1gA_kE49nKZFczwhT9LFk-Ho1elaMXgBFiWLk7uDu04Q9OCEWkSP5xW1J4OQ22zzHAxxPTD-b4DwilG1RcmfeyIX8L6nafQMiidfJ5cr73lKHrRbidy5P9lf3uQaOHfkDjElY0j6JVTfbwV9LmaZcAvxIuJ5HKcCGJm_mDufs5IMPx4FovObnft",
    bullets: ["Metal-Free Fillings", "Precision Crowns"]
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-bg-deep">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold mb-4 tracking-tighter">Specialized Dental Care</h2>
            <p className="text-text-muted font-medium">We offer a comprehensive range of dental solutions using the latest medical breakthroughs and artisanal precision.</p>
          </div>
          <button className="btn-secondary">
            View All Services
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-dark p-10 hover:bg-white/[0.02] transition-all duration-500 group"
            >
              <div className="mb-8 overflow-hidden rounded-md border border-white/10 p-1 bg-white/5">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-sm filter grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-white/50">{service.icon}</div>
                <h3 className="text-2xl font-bold tracking-tight">{service.title}</h3>
              </div>
              <p className="text-text-muted text-sm mb-8 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-4">
                {service.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70">
                    <Check size={14} className="text-white/30" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
