import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, User, Mail, Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

const bookingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  service: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a preferred date"),
  message: z.string().optional()
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    setErrorMessage("");

    const serviceMap: Record<string, number> = {
      checkup: 1,
      whitening: 2,
      restorative: 3,
      invisalign: 4
    };

    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          service_id: serviceMap[data.service] || 1,
          appointment_date: `${data.date} 09:00:00`, // Defaulting to 9 AM for now
          comments: data.message
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to book appointment");
      }

      setIsSubmitted(true);
      reset();
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error("Booking Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    onClose();
    setTimeout(() => {
      setIsSubmitted(false);
      setErrorMessage("");
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-bg-deep border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12">
              {!isSubmitted ? (
                <>
                  <div className="mb-10">
                    <div className="inline-flex items-center px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-brand-blue mb-4">
                      <Calendar size={14} className="mr-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Appointment Booking</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Book Your Visit</h2>
                    <p className="text-text-muted text-sm font-medium">Please provide your details and we'll confirm your slot.</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                          <User size={12} /> Full Name
                        </label>
                        <input 
                          {...register("fullName")}
                          type="text" 
                          placeholder="John Doe" 
                          className={`w-full bg-white/5 border ${errors.fullName ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/10 focus:border-brand-blue/50 transition-all outline-none`}
                        />
                        {errors.fullName && <p className="text-[10px] text-red-500 font-bold">{errors.fullName.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                          <Mail size={12} /> Email
                        </label>
                        <input 
                          {...register("email")}
                          type="email" 
                          placeholder="john@example.com" 
                          className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/10 focus:border-brand-blue/50 transition-all outline-none`}
                        />
                        {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                          <Phone size={12} /> Phone
                        </label>
                        <input 
                          {...register("phone")}
                          type="tel" 
                          placeholder="+1 (555) 000-0000" 
                          className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/10 focus:border-brand-blue/50 transition-all outline-none`}
                        />
                        {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                          <Calendar size={12} /> Preferred Date
                        </label>
                        <input 
                          {...register("date")}
                          type="date" 
                          className={`w-full bg-white/5 border ${errors.date ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-4 text-sm text-white focus:border-brand-blue/50 transition-all outline-none`}
                        />
                        {errors.date && <p className="text-[10px] text-red-500 font-bold">{errors.date.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Select Service</label>
                      <select 
                        {...register("service")}
                        className={`w-full bg-white/5 border ${errors.service ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-4 text-sm text-white focus:border-brand-blue/50 transition-all outline-none appearance-none`}
                      >
                        <option value="" className="bg-bg-deep">Choose service...</option>
                        <option value="checkup" className="bg-bg-deep">Comprehensive Checkup</option>
                        <option value="whitening" className="bg-bg-deep">Professional Whitening</option>
                        <option value="restorative" className="bg-bg-deep">Restorative Care</option>
                        <option value="invisalign" className="bg-bg-deep">Invisalign® Consultation</option>
                      </select>
                      {errors.service && <p className="text-[10px] text-red-500 font-bold">{errors.service.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <MessageSquare size={12} /> Comments (Optional)
                      </label>
                      <textarea 
                        {...register("message")}
                        rows={3} 
                        placeholder="Anything else we should know?" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/10 focus:border-brand-blue/50 transition-all outline-none resize-none"
                      />
                    </div>

                    {errorMessage && (
                      <div className="p-3 mb-4 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                        {errorMessage}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                      {isLoading ? "Submitting..." : "Confirm Appointment Request"}
                    </motion.button>
                  </form>
                </>
              ) : (
                <div className="text-center py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto mb-8"
                  >
                    <CheckCircle2 size={40} className="text-brand-blue" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-4">Request Received</h2>
                  <p className="text-text-muted font-medium mb-10 max-w-[280px] mx-auto">
                    Our team will contact you within 24 hours to confirm your scheduled visit.
                  </p>
                  <button 
                    onClick={closeModal}
                    className="px-10 py-4 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-100 transition-all"
                  >
                    Got it, thanks!
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
