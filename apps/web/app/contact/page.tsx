'use client';

import Link from "next/link";
import Image from "next/image";
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
    <div className="flex min-h-screen flex-col bg-white text-slate-900 font-sans w-full overflow-x-hidden selection:bg-cyan-500 selection:text-white relative">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-[#F0F4F8] border-b border-slate-200/80 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pt-6 pb-14 md:pt-10 md:pb-24 lg:pt-16 lg:pb-32 relative overflow-hidden flex items-center">
        {/* Green accent positioned exactly at the bottom left corner */}
        <div className="absolute bottom-0 left-0 w-[20rem] sm:w-[30rem] lg:w-[40rem] h-[20rem] sm:h-[30rem] lg:h-[40rem] bg-emerald-500/15 rounded-tr-full blur-[80px] sm:blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[2000px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-14 lg:gap-16 xl:gap-24 relative z-10">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left w-full lg:w-1/2 flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#0F2942] border border-blue-100/60 shadow-sm transition-all hover:shadow-md">
              <i className="fa-solid fa-headset text-[#0070F3]"></i>
              <span>Mavora Technologies Enterprise Support Desk</span>
            </div>
            
            {/* Added Gradient Color to the Wordings */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-extrabold tracking-tight text-[#0B1727] leading-[1.15] sm:leading-[1.1] w-full">
              Let's Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Institution Together</span>
            </h1>
            
            <p className="text-slate-600 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl lg:max-w-none w-full">
              Connect with our enterprise architecture team for technical RFPs, custom institutional walkthroughs, or support desk assistance.
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm sm:text-base font-semibold text-slate-700 w-full lg:w-auto">
              <span className="flex items-center gap-2"><i className="fa-solid fa-circle-check text-emerald-500 text-lg"></i> 2-Hour SLA Response</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-circle-check text-emerald-500 text-lg"></i> Dedicated Solution Architects</span>
            </div>
          </div>
          
          {/* Contextual Hero Image Addition */}
          <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
            <div className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[4/3] xl:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 group">
              <Image
                src="/27.png"
                alt="Mavora Technologies Collaborative Support and Engineering Desk"
                fill
                className="object-cover object-right group-hover:scale-105 transition-transform duration-700 ease-in-out"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              />
              <div className="absolute inset-0 bg-[#0F2942]/10 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
            <div className="absolute -inset-4 sm:-inset-6 bg-cyan-400/10 blur-2xl sm:blur-3xl -z-10 rounded-[3rem]"></div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full bg-slate-50/60 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 sm:py-20 md:py-24 lg:py-32 flex-1 border-t border-slate-100 relative overflow-hidden">
        <div className="max-w-[2000px] mx-auto space-y-16 sm:space-y-24 relative z-10">
          
          {/* Contact Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full">
            {/* HQ Card */}
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full w-full">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-blue-50 text-[#0070F3] flex items-center justify-center text-2xl sm:text-3xl border border-blue-100/50 shrink-0">
                <i className="fa-solid fa-building"></i>
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0B1727]">Headquarters</h3>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Mavora Technologies Ltd<br />
                  Wood Garden Road, off Wood Avenue, Kilimani<br />
                  Nairobi, Kenya
                </p>
              </div>
              <div className="pt-6 sm:pt-8 border-t border-slate-100 text-sm sm:text-base font-bold text-emerald-600 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span> Physical Office Open
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full w-full">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl sm:text-3xl border border-cyan-100/50 shrink-0">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0B1727]">Direct Email</h3>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Primary channel for technical RFPs, briefs, and general administrative inquiries.
                </p>
              </div>
              <div className="pt-6 sm:pt-8 border-t border-slate-100">
                <a href="mailto:info@mavoratechnologies.com" className="text-base sm:text-lg font-bold text-[#0070F3] hover:text-blue-700 transition-colors flex items-center gap-2 break-all">
                  info@mavoratechnologies.com <i className="fa-solid fa-arrow-right text-sm"></i>
                </a>
              </div>
            </div>

            {/* Phone / Call Desk Card */}
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full w-full md:col-span-2 lg:col-span-1">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl sm:text-3xl border border-teal-100/50 shrink-0">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0B1727]">Call Desk & Support</h3>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Monday – Friday<br />(8:30 AM – 5:00 PM EAT)
                </p>
              </div>
              <div className="pt-6 sm:pt-8 border-t border-slate-100">
                <a href="tel:+254795707823" className="text-base sm:text-lg font-bold text-[#0070F3] hover:text-blue-700 transition-colors flex items-center gap-2">
                  +254 795 707 823 <i className="fa-solid fa-arrow-right text-sm"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Inquiry Form Section */}
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm max-w-5xl mx-auto w-full space-y-8 sm:space-y-10 hover:shadow-lg transition-shadow duration-300">
            <div className="space-y-3 sm:space-y-4 border-b border-slate-100 pb-6 sm:pb-8 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1727]">Submit Institutional Inquiry or RFP</h3>
              <p className="text-slate-500 text-base sm:text-lg">
                Fill out the form below and our technical architecture team will respond within 2 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-800 p-8 sm:p-12 rounded-2xl sm:rounded-3xl text-center space-y-4 sm:space-y-6">
                <div className="h-20 w-20 sm:h-24 sm:w-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 text-4xl sm:text-5xl">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p className="font-extrabold text-2xl sm:text-3xl">Inquiry Successfully Transmitted</p>
                <p className="text-emerald-700/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                  Thank you. Your request has been securely routed to the Mavora Technologies technical desk at Wood Garden Road, Kilimani.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Prof. Jacobs Moh" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 sm:px-5 py-3.5 sm:py-4 text-base transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]/50 focus:border-[#0070F3]" 
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-widest">Institutional Email</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="jacobs.moh@university.edu" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 sm:px-5 py-3.5 sm:py-4 text-base transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]/50 focus:border-[#0070F3]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-widest">Institution / Organization</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="University or School Name" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 sm:px-5 py-3.5 sm:py-4 text-base transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]/50 focus:border-[#0070F3]" 
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-widest">Estimated Student Population</label>
                    <div className="relative">
                      <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 sm:px-5 py-3.5 sm:py-4 text-base transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]/50 focus:border-[#0070F3] appearance-none cursor-pointer">
                        <option>Up to 300 students (Starter)</option>
                        <option>Up to 800 students (Business)</option>
                        <option>Up to 2,000 students (Professional)</option>
                        <option>2,000+ students (Enterprise / Custom)</option>
                      </select>
                      <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-widest">Message or RFP Requirements</label>
                  <textarea 
                    rows={6} 
                    required 
                    placeholder="Tell us about your technical specifications and timeline..." 
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 sm:px-5 py-4 text-base transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]/50 focus:border-[#0070F3] resize-none" 
                  />
                </div>

                <div className="pt-4 sm:pt-6">
                  <Button type="submit" className="w-full h-14 sm:h-16 bg-[#0B1727] hover:bg-[#152740] text-white text-base sm:text-lg font-bold shadow-md rounded-xl transition-all">
                    Transmit Inquiry
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}