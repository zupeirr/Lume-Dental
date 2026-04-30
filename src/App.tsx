/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Experts from "./components/Experts";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";

import { Routes, Route } from "react-router-dom";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";

function PublicSite() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenBooking={openBooking} />
      <main className="flex-grow">
        <Hero onOpenBooking={openBooking} />
        <Features />
        <Services />
        <Gallery />
        <Pricing onOpenBooking={openBooking} />
        <Experts />
        <Testimonials />
        <Contact />
        <CTASection onOpenBooking={openBooking} />
      </main>
      <Footer />

      <BookingModal isOpen={isBookingOpen} onClose={closeBooking} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

