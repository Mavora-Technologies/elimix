'use client';

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'term' | 'annual'>('annual');

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 px-6 py-12 md:py-16 text-center space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0F2942] border border-blue-100">
            <i className="fa-solid fa-tags text-cyan-600"></i>
            SRMS Institutional Licensing & Investment Tiers
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] sm:text-5xl leading-tight">
            Transparent, Scalable Institution Pricing
          </h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Choose the operational tier that aligns with your active student population and administrative scope.
          </p>

          {/* Billing Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setBillingCycle('term')}
                className={`px-4 py-2 rounded-md transition-all ${
                  billingCycle === 'term' ? 'bg-white text-[#0F2942] shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Standard / Term Rate
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-md transition-all ${
                  billingCycle === 'annual' ? 'bg-[#0F2942] text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annual Commitment <span className="text-[10px] text-cyan-300 ml-1 font-normal">(Save ~16%)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="px-4 sm:px-6 py-12 md:py-16 md:px-12 max-w-7xl mx-auto w-full space-y-12 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Starter Tier */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Starter</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Available</span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0F2942]">
                  {billingCycle === 'annual' ? 'KSh 30,000' : 'KSh 3,000'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {billingCycle === 'annual' ? 'Billed annually' : 'Per term rate'}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Designed for small schools starting their digitization journey.
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Up to 300 students</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Isolated DB Schema</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Standard Support Desk</div>
              </div>
            </div>
            <div className="pt-4">
              <Link href="/login" className="w-full block">
                <Button variant="outline" className="w-full text-xs font-semibold border-slate-300 text-slate-700 hover:bg-slate-50">
                  Provision Starter
                </Button>
              </Link>
            </div>
          </div>

          {/* Business Tier */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Business</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Available</span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0F2942]">
                  {billingCycle === 'annual' ? 'KSh 60,000' : 'KSh 6,000'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {billingCycle === 'annual' ? 'Billed annually' : 'Per term rate'}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ideal for growing primary and secondary academies.
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Up to 800 students</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Isolated DB Schema</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Automated Fee Collection</div>
              </div>
            </div>
            <div className="pt-4">
              <Link href="/login" className="w-full block">
                <Button variant="outline" className="w-full text-xs font-semibold border-slate-300 text-slate-700 hover:bg-slate-50">
                  Provision Business
                </Button>
              </Link>
            </div>
          </div>

          {/* Professional Tier (Highlighted as Popular) */}
          <div className="bg-white rounded-xl border-2 border-cyan-500 shadow-md p-6 flex flex-col justify-between space-y-6 relative ring-4 ring-cyan-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
              Most Popular
            </div>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F2942]">Professional</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">Active Tier</span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0F2942]">
                  {billingCycle === 'annual' ? 'KSh 100,000' : 'KSh 10,000'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {billingCycle === 'annual' ? 'Billed annually' : 'Per term rate'}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Built for established institutions with high administrative volume.
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Up to 2,000 students</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Granular RBAC Matrix</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Priority Assistance</div>
              </div>
            </div>
            <div className="pt-4">
              <Link href="/login" className="w-full block">
                <Button className="w-full bg-[#0F2942] hover:bg-[#1a3d63] text-white text-xs font-semibold shadow-sm">
                  Provision Professional
                </Button>
              </Link>
            </div>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Enterprise</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Custom Setup</span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0F2942]">
                  {billingCycle === 'annual' ? 'KSh 150,000' : 'KSh 15,000'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {billingCycle === 'annual' ? 'Billed annually' : 'Per term rate'}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Custom architecture for multi-campus universities and large institutions.
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> 2,000+ / custom capacity</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Dedicated Database Cluster</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> 24/7 Dedicated Support</div>
              </div>
            </div>
            <div className="pt-4">
              <Link href="/contact" className="w-full block">
                <Button variant="outline" className="w-full text-xs font-semibold border-slate-300 text-slate-700 hover:bg-slate-50">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>

        </div>

        {/* Enterprise Security & Support Inclusion Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-200">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-blue-600 text-sm font-bold flex items-center gap-2">
              <i className="fa-solid fa-server"></i> Isolated DB Schema
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">Every institutional tier receives dedicated database partitioning and automated scheduled backups.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-cyan-600 text-sm font-bold flex items-center gap-2">
              <i className="fa-solid fa-headset"></i> Priority Assistance
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">Direct ticketing channels and rapid turnaround support for bursars, registrars, and IT directors.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-teal-600 text-sm font-bold flex items-center gap-2">
              <i className="fa-solid fa-arrows-rotate"></i> Flexible Upgrades
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">Seamlessly transition between Starter, Business, Professional, and Enterprise caps as your student body grows.</p>
          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
}