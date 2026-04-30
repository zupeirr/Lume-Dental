import { motion } from "motion/react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Contact Form Data:", data);
    setIsSubmitted(true);
    reset();
  };

  return (
    <section id="contact" className="py-24 bg-bg-deep border-y border-white/5">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 rounded-md text-white/50 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[2px]">Contact Protocols</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">Get in Touch with our Clinical Team</h2>
              <p className="text-text-muted text-lg leading-relaxed">
                Our administrative staff is ready to assist with scheduling, insurance verification, and surgical inquiries.
              </p>
            </div>

            <div className="space-y-8">
              <ContactItem 
                icon={<MapPin size={20} />} 
                title="Location" 
                detail="Burj-Omer Road 1" 
              />
              <ContactItem 
                icon={<Phone size={20} />} 
                title="Phone" 
                detail="+252636097266" 
              />
              <ContactItem 
                icon={<Mail size={20} />} 
                title="Inquiries" 
                detail="lumedental@gmail.com" 
              />
              <ContactItem 
                icon={<Clock size={20} />} 
                title="SLA Hours" 
                detail="Mon - Fri: 9:00 AM - 6:00 PM" 
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-dark p-10"
          >
            {!isSubmitted ? (
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Full Name</label>
                    <input 
                      {...register("fullName")}
                      type="text" 
                       
                      className={`w-full bg-white/5 border ${errors.fullName ? 'border-red-500/50' : 'border-white/10'} rounded-md px-4 py-3 text-sm text-white placeholder:text-white/10 focus:border-white/30 transition-all outline-none`}
                    />
                    {errors.fullName && <p className="text-[10px] text-red-500 font-bold">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email Address</label>
                    <input 
                      {...register("email")}
                      type="email" 
                       
                      className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-md px-4 py-3 text-sm text-white placeholder:text-white/10 focus:border-white/30 transition-all outline-none`}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email.message}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Service Category</label>
                  <select 
                    {...register("service")}
                    className={`w-full bg-white/5 border ${errors.service ? 'border-red-500/50' : 'border-white/10'} rounded-md px-4 py-3 text-sm text-white focus:border-white/30 transition-all outline-none appearance-none`}
                  >
                    <option value="" className="bg-bg-deep">Choose service...</option>
                    <option value="Consultation" className="bg-bg-deep">Consultation</option>
                    <option value="Restorative Work" className="bg-bg-deep">Restorative Work</option>
                    <option value="Cosmetic Procedures" className="bg-bg-deep">Cosmetic Procedures</option>
                    <option value="Surgical Infrastructure" className="bg-bg-deep">Surgical Infrastructure</option>
                  </select>
                  {errors.service && <p className="text-[10px] text-red-500 font-bold">{errors.service.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Clinical Inquiry</label>
                  <textarea 
                    {...register("message")}
                    rows={4} 
                    placeholder="Describe your requirements..." 
                    className={`w-full bg-white/5 border ${errors.message ? 'border-red-500/50' : 'border-white/10'} rounded-md px-4 py-3 text-sm text-white placeholder:text-white/10 focus:border-white/30 transition-all outline-none resize-none`}
                  />
                  {errors.message && <p className="text-[10px] text-red-500 font-bold">{errors.message.message}</p>}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
                >
                  <span>Initialize Inquiry</span>
                  <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </motion.button>
              </form>
            ) : (
              <div className="text-center py-10">
                <CheckCircle2 size={48} className="text-brand-blue mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent</h3>
                <p className="text-text-muted mb-8">We'll get back to you shortly.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-white/50 hover:text-white text-sm font-bold uppercase tracking-widest"
                >
                  Send another message
                </button>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, title, detail }: { icon: ReactNode, title: string, detail: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/30 transition-all">
        {icon}
      </div>
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-[2px] text-white/40 mb-1">{title}</h4>
        <p className="text-white font-medium tracking-tight">{detail}</p>
      </div>
    </div>
  );
}
