import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface TransformationItem {
  id: number;
  title: string;
  description: string;
  before: string;
  after: string;
}

interface GalleryContent {
  label: string;
  title: string;
  description: string;
  items: TransformationItem[];
}

export default function Gallery() {
  const [content, setContent] = useState<GalleryContent | null>(null);

  useEffect(() => {
    const apiUrl = (import.meta as any).env.VITE_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/content/gallery`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setContent({
            label: 'Clinical Results',
            title: 'Patient Transformations',
            description: 'View the precision and artistry of our restorative and cosmetic procedures.',
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
    <section id="gallery" className="py-24 bg-bg-deep border-y border-white/5">
      <div className="container-wide">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-brand-blue mb-6"
          >
            <span className="text-xs font-bold uppercase tracking-wider">{content.label}</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-white">{content.title}</h2>
          <p className="text-text-muted max-w-xl mx-auto font-medium">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 aspect-square mb-6">
                <div className="absolute bottom-4 left-4 z-20 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md border border-white/10">
                  <span className="text-[10px] font-bold text-white uppercase">Before</span>
                </div>
                <div className="absolute bottom-4 right-4 z-20 px-2 py-1 bg-brand-blue/80 backdrop-blur-sm rounded-md border border-brand-blue/30">
                  <span className="text-[10px] font-bold text-white uppercase">After</span>
                </div>

                <div className="relative h-full flex">
                  <div className="w-1/2 relative overflow-hidden grayscale brightness-75 border-r border-white/5">
                    <img
                      src={item.before}
                      alt={`${item.title} Before`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="w-1/2 relative overflow-hidden">
                    <img
                      src={item.after}
                      alt={`${item.title} After`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </div>

              <div className="px-2">
                <h3 className="text-xl font-bold mb-2 tracking-tight text-white">{item.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed line-clamp-2 font-medium">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
