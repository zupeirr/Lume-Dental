import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShieldPlus, Smile, Activity } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "Preventative Care": <ShieldPlus className="text-brand-blue" size={24} />,
  "Cosmetic Dentistry": <Smile className="text-brand-blue" size={24} />,
  "Restorative Care": <Activity className="text-brand-blue" size={24} />,
};

const DEFAULT_ICON = <ShieldPlus className="text-brand-blue" size={24} />;

interface PricingService {
  name: string;
  price: string;
}

interface PricingCategory {
  title: string;
  description: string;
  highlight?: boolean;
  services: PricingService[];
}

interface PricingContent {
  title: string;
  description: string;
  items: PricingCategory[];
}

const DEFAULT_PRICING_CONTENT: PricingContent = {
  title: "Transparent Infrastructure Pricing",
  description: "Scalable dental solutions designed for modern lives. No hidden fees, just precision craftsmanship.",
  items: [
    {
      title: "Preventative Care",
      description: "Essential maintenance for long-term health.",
      highlight: false,
      services: [
        { name: "Comprehensive Checkup", price: "from $150" },
        { name: "Professional Cleaning", price: "from $120" },
        { name: "Digital X-Rays", price: "from $80" }
      ]
    },
    {
      title: "Cosmetic Dentistry",
      description: "Enhance your natural smile confidently.",
      highlight: true,
      services: [
        { name: "Professional Whitening", price: "from $350" },
        { name: "Porcelain Veneers", price: "from $1,200/th" },
        { name: "Invisalign®", price: "Custom Quote" }
      ]
    },
    {
      title: "Restorative Care",
      description: "Repair and restore structural integrity.",
      highlight: false,
      services: [
        { name: "Tooth-Colored Fillings", price: "from $200" },
        { name: "Dental Crowns", price: "from $900" },
        { name: "Dental Implants", price: "from $2,500" }
      ]
    }
  ]
};

export default function Pricing({ onOpenBooking }: { onOpenBooking: () => void }) {
  const [content, setContent] = useState<PricingContent>(DEFAULT_PRICING_CONTENT);

  useEffect(() => {
    const apiUrl = (import.meta as any).env.VITE_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/content/pricing`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch pricing");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setContent({
            title: "Transparent Infrastructure Pricing",
            description: "Scalable dental solutions designed for modern lives. No hidden fees, just precision craftsmanship.",
            items: data
          });
        } else if (data && Array.isArray(data.items)) {
          setContent(data);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch database content for pricing, using local fallback.", err);
      });
  }, []);

  if (!content) return null;

  return (
    <section id="pricing" className="py-24 bg-bg-deep border-y border-white/5">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 rounded-md text-white/50 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[2px]">Clinical Service Menu</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">{content.title}</h2>
          <p className="text-text-muted text-lg">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {content.items.map((category, index) => (
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
                  {iconMap[category.title] || DEFAULT_ICON}
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4 text-white">{category.title}</h3>
                <p className="text-text-muted text-sm font-medium leading-relaxed max-w-[240px]">
                  {category.description}
                </p>
              </div>

              <div className="flex-grow space-y-8 mb-12">
                {category.services?.map((service: any, i: number) => (
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