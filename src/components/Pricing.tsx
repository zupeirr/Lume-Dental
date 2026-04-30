import { motion } from "motion/react";
import { Check } from "lucide-react";

import { ShieldPlus, Smile, Activity } from "lucide-react";

const pricingCategories = [
  {
    title: "Preventative Care",
    icon: <ShieldPlus className="text-brand-blue" size={24} />,
    description: "Essential maintenance for long-term health.",
    services: [
      { name: "Comprehensive Checkup", desc: "Full assessment", price: "from $150" },
      { name: "Professional Cleaning", desc: "Advanced hygiene", price: "from $120" },
      { name: "Digital X-Rays", desc: "Precision imaging", price: "from $80" }
    ]
  },
  {
    title: "Cosmetic Dentistry",
    icon: <Smile className="text-brand-blue" size={24} />,
    description: "Enhance your natural smile confidently.",
    services: [
      { name: "Professional Whitening", desc: "Instant brightening", price: "from $350" },
      { name: "Porcelain Veneers", desc: "Custom aesthetics", price: "from $1,200/th" },
      { name: "Invisalign®", desc: "Clear alignment", price: "Custom Quote" }
    ],
    highlight: true
  },
  {
    title: "Restorative Care",
    icon: <Activity className="text-brand-blue" size={24} />,
    description: "Repair and restore structural integrity.",
    services: [
      { name: "Tooth-Colored Fillings", desc: "Mercury-free repair", price: "from $200" },
      { name: "Dental Crowns", desc: "Durable protection", price: "from $900" },
      { name: "Dental Implants", desc: "Permanent replacement", price: "from $2,500" }
    ]
  }
];

export default function Pricing({ onOpenBooking }: { onOpenBooking: () => void }) {
  return (
    <section id="pricing" className="py-24 bg-bg-deep border-y border-white/5">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 rounded-md text-white/50 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[2px]">Clinical Service Menu</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">Transparent Infrastructure Pricing</h2>
          <p className="text-text-muted text-lg">
            Scalable dental solutions designed for modern lives. No hidden fees, just precision craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pricingCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group p-8 lg:p-10 rounded-[2.5rem] flex flex-col relative transition-all duration-500 border border-white/5 ${
                category.highlight ? "bg-white/[0.04] border-brand-blue/20 ring-1 ring-brand-blue/10" : "bg-white/[0.02]"
              } hover:translate-y-[-8px] hover:bg-white/[0.05] hover:border-white/10`}
            >
              {category.highlight && (
                <div className="absolute top-6 right-6 px-3 py-1 bg-brand-blue/20 border border-brand-blue/30 rounded-full">
                  <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Most Popular</span>
                </div>
              )}

              <div className="mb-10">
                <div className="w-14 h-14 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                  {category.icon}
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4 text-white">{category.title}</h3>
                <p className="text-text-muted text-sm font-medium leading-relaxed max-w-[240px]">
                  {category.description}
                </p>
              </div>

              <div className="flex-grow space-y-8 mb-12">
                {category.services.map((service, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-bold text-white tracking-tight">{service.name}</span>
                      <span className="text-sm font-bold text-white/50 tracking-tighter">{service.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenBooking}
                className={category.highlight ? "btn-primary w-full py-4 text-sm font-bold rounded-2xl" : "px-8 py-4 border-2 border-white/10 rounded-2xl font-bold text-sm text-white hover:bg-white/5 transition-all w-full"}
              >
                Book Appointment
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
