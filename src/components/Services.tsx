import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ShieldPlus, Smile, Activity, Check } from "lucide-react";

const iconMap: Record<string, any> = {
  "Cosmetic Dentistry": <Sparkles className="text-brand-blue-dark" />,
  "Dental Implants": <Activity className="text-brand-blue-dark" />,
  "Restorative Care": <ShieldPlus className="text-brand-blue-dark" />,
};

const DEFAULT_ICON = <Sparkles className="text-brand-blue-dark" />;

interface ServiceItem {
  title: string;
  description: string;
  image: string;
  bullets: string[];
}

interface ServicesContent {
  title: string;
  description: string;
  buttonText: string;
  items: ServiceItem[];
}

export default function Services() {
  const [content, setContent] = useState<ServicesContent | null>(null);

  useEffect(() => {
    const apiUrl = (import.meta as any).env.VITE_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/content/services`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setContent({
            title: 'Specialized Dental Care',
            description: 'We offer a comprehensive range of dental solutions...',
            buttonText: 'View All Services',
            items: data
          });
        } else {
          setContent(data);
        }
      })
      .catch(() => {}); 
  }, []);

  if (!content) return null;

  return (
    <section id="services" className="py-24 bg-bg-deep">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold mb-4 tracking-tighter">{content.title}</h2>
            <p className="text-text-muted font-medium">{content.description}</p>
          </div>
          <button className="btn-secondary">
            {content.buttonText}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.items.map((service, index) => (
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
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-white/50">{iconMap[service.title] || DEFAULT_ICON}</div>
                <h3 className="text-2xl font-bold tracking-tight">{service.title}</h3>
              </div>
              <p className="text-text-muted text-sm mb-8 leading-relaxed">{service.description}</p>
              <ul className="space-y-4">
                {service.bullets?.map((bullet: string, i: number) => (
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
