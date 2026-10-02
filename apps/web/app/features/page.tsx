import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 px-6 py-12 md:px-12 md:py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0F2942] border border-blue-100">
            <i className="fa-solid fa-cube text-cyan-600"></i>
            Platform Capabilities & Core Architecture
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] sm:text-5xl leading-tight">
            Engineered for Comprehensive Campus Control
          </h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore the advanced modules and robust security architectures powering institutional management worldwide.
          </p>
        </div>
      </section>

      {/* Core Feature Showcase Grid (Replaces Module Registry Table) */}
      <section className="px-4 sm:px-6 py-12 md:py-16 md:px-12 max-w-7xl mx-auto w-full space-y-8 flex-1">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] tracking-tight">
            Core Operational Modules
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Discover the enterprise-grade controllers and security protocols designed to streamline school and university administration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
              <i className="fa-solid fa-database"></i>
            </div>
            <h3 className="text-base font-bold text-[#0F2942]">Strict Multi-Tenant Schema</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Automated provisioning and isolated backup routines ensuring absolute data separation between institutions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-lg">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <h3 className="text-base font-bold text-[#0F2942]">Granular RBAC Matrix</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Custom role creation, comprehensive audit trail logging, and mandatory multi-factor authentication enforcement.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg">
              <i className="fa-solid fa-receipt"></i>
            </div>
            <h3 className="text-base font-bold text-[#0F2942]">Automated Fee Collection Engine</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Real-time ledger reconciliation, integrated payment tracking, and automated bursary receipt generation.
            </p>
          </div>
        </div>

        {/* Deep-Dive Technical Detail Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-blue-50 text-[#0F2942] flex items-center justify-center font-bold text-lg">
                <i className="fa-solid fa-building-shield"></i>
              </div>
              <h3 className="text-base font-bold text-[#0F2942]">Multi-Tenant Partition Guarantee</h3>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Every institution operates within its own securely partitioned database schema. Tenant isolation prevents data leakage and ensures absolute compliance with institutional data privacy regulations.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium pt-2">
              <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Automated tenant provisioning pipelines</li>
              <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Isolated backup routines per institution</li>
              <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Custom domain mapping capabilities</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-lg">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <h3 className="text-base font-bold text-[#0F2942]">Access Control & Compliance</h3>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Define exact boundaries for super administrators, finance officers, department heads, teachers, and guardians with customizable permission matrices.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium pt-2">
              <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Custom role creation and permission grouping</li>
              <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Full audit trail logging for administrative actions</li>
              <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Multi-factor authentication (MFA) enforcement</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}