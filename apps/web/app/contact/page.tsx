'use client';

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 px-6 py-12 md:px-12 md:py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0F2942] border border-blue-100">
            <i className="fa-solid fa-headset text-cyan-600"></i>
            Mavora Technologies Enterprise Support & Communications Desk
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] sm:text-5xl leading-tight">
            Let's Transform Your Institution Together
          </h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Connect with our enterprise architecture team for technical RFPs, custom institutional walkthroughs, or support desk assistance.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-4 sm:px-6 py-10 md:py-12 md:px-12 max-w-7xl mx-auto w-full space-y-12 flex-1">
        
        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* HQ Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-[#0F2942] flex items-center justify-center font-bold text-lg">
              <i className="fa-solid fa-building"></i>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#0F2942]">Headquarters</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mavora Technologies Ltd<br />
                Wood Garden Road, off Wood Avenue, Kilimani<br />
                Nairobi, Kenya
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> Physical Office Open
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="h-10 w-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-lg">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#0F2942]">Direct Email</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Primary channel for technical RFPs, briefs, and general administrative inquiries.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <a href="mailto:info@mavoratechnologies.com" className="text-xs font-semibold text-blue-600 hover:underline">
                info@mavoratechnologies.com →
              </a>
            </div>
          </div>

          {/* Phone / Call Desk Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg">
              <i className="fa-solid fa-phone"></i>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#0F2942]">Call Desk & Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monday – Friday (8:30 AM – 5:00 PM EAT)
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <a href="tel:+254795707823" className="text-xs font-semibold text-blue-600 hover:underline">
                +254 (0) 795 707 823 →
              </a>
            </div>
          </div>
        </div>

        {/* Inquiry Form Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-10 shadow-sm max-w-4xl mx-auto w-full space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4 text-center md:text-left">
            <h3 className="text-xl font-extrabold text-[#0F2942]">Submit Institutional Inquiry or RFP</h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              Fill out the form below and our technical architecture team will respond within 2 business hours.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-lg text-xs space-y-2 text-center">
              <p className="font-bold text-base">✓ Inquiry Successfully Transmitted</p>
              <p className="text-slate-600">Thank you. Your request has been securely routed to the Mavora Technologies technical desk at Wood Garden Road, Kilimani.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Full Name</label>
                  <input type="text" required placeholder="Dr. Valary Femy" className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2942]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Institutional Email</label>
                  <input type="email" required placeholder="valary.femy@university.edu" className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2942]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Institution / Organization</label>
                  <input type="text" required placeholder="University or School Name" className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2942]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Estimated Student Population</label>
                  <select className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2942]">
                    <option>Up to 300 students (Starter)</option>
                    <option>Up to 800 students (Business)</option>
                    <option>Up to 2,000 students (Professional)</option>
                    <option>2,000+ students (Enterprise / Custom)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Message or RFP Requirements</label>
                <textarea rows={5} required placeholder="Tell us about your technical specifications and timeline..." className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2942]" />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full bg-[#0F2942] hover:bg-[#1a3d63] text-white py-3 text-xs font-semibold shadow-sm">
                  Transmit Inquiry
                </Button>
              </div>
            </form>
          )}
        </div>

      </section>

      <Footer />
    </div>
  );
}