import { Globe, Phone, Mail, MapPin } from "lucide-react";
import { ReactNode } from "react";

export default function Footer() {
  return (
    <footer className="w-full py-20 bg-bg-deep border-t border-white/10">
      <div className="container-wide flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex flex-col gap-6 max-w-sm">
          <a href="/" className="text-2xl font-extrabold tracking-tighter text-white hover:opacity-80 transition-opacity block w-fit">LUME DENTAL</a>
          <p className="text-sm text-text-muted font-medium leading-relaxed">
            Precision dental care tailored to your unique needs. We combine the latest technology with a patient-first philosophy for the ultimate clinic experience.
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={<Globe size={18} />} />
            <SocialIcon icon={<Phone size={18} />} />
            <SocialIcon icon={<Mail size={18} />} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-6">
            <h5 className="font-bold uppercase text-[10px] tracking-[2px] text-white/40">Clinic Hours</h5>
            <ul className="text-sm space-y-3 text-text-muted font-medium">
              <li className="flex justify-between gap-8"><span>Mon - Fri</span> <span className="text-white font-bold">9:00 - 18:00</span></li>
              <li className="flex justify-between gap-8"><span>Saturday</span> <span className="text-white font-bold">10:00 - 15:00</span></li>
              <li className="flex justify-between gap-8"><span>Sunday</span> <span className="text-white font-bold">Closed</span></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h5 className="font-bold uppercase text-[10px] tracking-[2px] text-white/40">Quick Links</h5>
            <nav className="flex flex-col gap-3 text-sm">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
              <FooterLink href="#" className="font-bold text-white">Emergency Care</FooterLink>
            </nav>
          </div>
        </div>
      </div>
      
      <div className="container-wide mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-12">
          <div className="flex flex-col gap-1">
            <span className="stat-num text-xl font-bold tracking-tighter">99.9%</span>
            <span className="stat-label text-[8px] text-text-muted uppercase tracking-widest leading-none">Uptime SLA</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="stat-num text-xl font-bold tracking-tighter">150+</span>
            <span className="stat-label text-[8px] text-text-muted uppercase tracking-widest leading-none">Partners</span>
          </div>
        </div>
        <p className="text-[10px] text-white/20 font-bold uppercase tracking-[2px]">
          © 2024 LUME DENTAL SYSTEMS INC. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: ReactNode }) {
  return (
    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:bg-white/10 hover:text-white transition-all cursor-pointer">
      {icon}
    </div>
  );
}

function FooterLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} className={`text-gray-500 hover:text-white transition-colors ${className}`}>
      {children}
    </a>
  );
}
