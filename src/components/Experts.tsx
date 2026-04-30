import { motion } from "motion/react";

const doctors = [
  {
    name: "Dr. Beatrice Cox",
    specialty: "Clinical Director / Orthodontics",
    description: "Specializing in structural alignment and facial aesthetics with 15 years of surgical experience.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBK3zFmKJdLstgH4wlYuws2JRCQOIlPA6Nr678QgixvkwPE3RvJR_uL40VuLW_4D9dwyEAhbZe828Wl9gbAoIJkVP2P8uhd4zBeNxO9k_EilZzzaf0aiXQoqDVujrBwIDcpAcauDKwtegj-L9bBabgtkMadXdywFcU6gnmAcKzNWZaP0dEt_EoShFkYAJANs0wrpSkAr_aqtypO1_P3psDBJrNFaMrlK-F_SkhqAyvWNMyGTq1XlCphnplRSe9y9AlaliJAy_jGC6hK"
  },
  {
    name: "Dr. Austin Camacho",
    specialty: "Restorative Specialist",
    description: "Expert in biological restorations and minimally invasive procedures for lasting oral health.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwzOoOv15A8JlLqJuiaCEIpeWf-x0RiEDCYfMYqOhuiYD6TpZojLjWtlkVRwKrFrfeZWrREFjhlGd1mISV2WgkpM9pa2J1dL6nYq7mdz-Gm4gIcKt81KWhfBeqEqYFmyB4-R02hiY_5RVnXeX8jjacsrB9_v0azPpTa2Oy4uAl20gzImA49-589-xLKl_1v6PDTfzQLnWMgT0FkWxnj6QNOm6n2FtDGgtMZWD_W3ypLLXLhHN-1D3i6bGuJhZgKtLYUGWisstCL2b-"
  }
];

export default function Experts() {
  return (
    <section id="doctors" className="py-24 bg-bg-deep border-y border-white/5">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tighter">Meet Our Experts</h2>
          <p className="text-text-muted font-medium max-w-2xl mx-auto">Led by world-renowned practitioners who combine clinical mastery with empathetic communication.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-12">
          {doctors.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="w-full md:w-80 group cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-lg mb-6 border border-white/10 p-1 bg-white/5">
                <img 
                  src={doc.image} 
                  alt={doc.name} 
                  className="w-full h-full object-cover rounded-md grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" 
                />
              </div>
              <h4 className="text-2xl font-bold mb-1 tracking-tight">{doc.name}</h4>
              <span className="inline-block px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">{doc.specialty}</span>
              <p className="text-text-muted text-sm leading-relaxed">{doc.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
