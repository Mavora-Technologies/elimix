import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { WebPageJsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Platform Capabilities & Core Architecture | Elimix",
  description: "Explore the advanced modules and robust security architectures powering institutional management with Elimix by Mavora Technologies.",
  alternates: {
    canonical: "/features",
  },
};

const featuresFaqs = [
  {
    question: "What core operational modules are included in Elimix?",
    answer:
      "Elimix includes multi-tenant schema partitioning, granular Role-Based Access Control (RBAC), automated fee collection, student records management, exam grading, attendance tracking, and stakeholder portals.",
  },
  {
    question: "How does Elimix secure institutional data?",
    answer:
      "Every institution operates within an isolated database schema with encrypted backup routines, immutable audit logging, and customizable role permissions.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white font-sans w-full overflow-x-hidden relative">
      <WebPageJsonLd
        title="Platform Capabilities & Core Architecture | Elimix"
        description="Explore the advanced modules and robust security architectures powering institutional management with Elimix by Mavora Technologies."
        path="/features"
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Features", path: "/features" },
        ]}
        faqs={featuresFaqs}
      />
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="w-full bg-[#F0F4F8] border-b border-slate-200/80 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pt-6 pb-14 md:pt-10 md:pb-24 lg:pt-16 lg:pb-32 relative overflow-hidden flex items-center">
          <div className="absolute bottom-0 left-0 w-[20rem] sm:w-[30rem] lg:w-[40rem] h-[20rem] sm:h-[30rem] lg:h-[40rem] bg-emerald-500/15 rounded-tr-full blur-[80px] sm:blur-[100px] pointer-events-none"></div>

          <div className="w-full max-w-[2000px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-14 lg:gap-16 xl:gap-24 relative z-10">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left w-full lg:w-1/2 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#0F2942] border border-blue-100/60 shadow-sm transition-all hover:shadow-md">
                <i
                  className="fa-solid fa-cube text-[#0070F3]"
                  aria-hidden="true"
                ></i>
                <span>Platform Capabilities &amp; Core Architecture</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-extrabold tracking-tight text-[#0F2942] leading-[1.15] sm:leading-[1.1] w-full">
                Engineered for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                  Comprehensive Campus Control
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl lg:max-w-none w-full">
                Explore the advanced modules and robust security architectures
                powering institutional management worldwide.
              </p>
              <div className="pt-2 sm:pt-4 w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-[#0F2942] hover:bg-slate-800 text-white font-semibold px-8 py-4 h-14 sm:h-12 shadow-md transition-all text-base">
                    Request Platform Demo
                  </Button>
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
              <div className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[4/3] xl:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 group">
                <Image
                  src="/4.png"
                  alt="Elimix Platform Dashboard Data and Analytics"
                  fill
                  className="object-cover object-right group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
                <div className="absolute inset-0 bg-cyan-900/10 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="absolute -inset-4 sm:-inset-6 bg-cyan-400/20 blur-2xl sm:blur-3xl -z-10 rounded-[3rem]"></div>
            </div>
          </div>
        </section>

        {/* Core Feature Showcase Grid */}
        <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 sm:py-20 md:py-24 lg:py-32 max-w-[2000px] mx-auto space-y-12 sm:space-y-16 flex-1">
          <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F2942] tracking-tight leading-tight">
              Core Operational Modules
            </h2>
            <p className="text-slate-600 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
              Discover the enterprise-grade controllers and security protocols
              designed to streamline school and university administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 pt-4 sm:pt-8 w-full">
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-5 sm:space-y-6 hover:border-cyan-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col h-full w-full">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl sm:text-3xl border border-blue-100 shrink-0">
                <i className="fa-solid fa-database" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F2942] leading-tight">
                Strict Multi-Tenant Schema
              </h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed flex-1">
                Automated provisioning and isolated backup routines ensuring
                absolute data separation between institutions.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-5 sm:space-y-6 hover:border-cyan-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col h-full w-full">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-2xl sm:text-3xl border border-cyan-100 shrink-0">
                <i className="fa-solid fa-user-shield" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F2942] leading-tight">
                Granular RBAC Matrix
              </h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed flex-1">
                Custom role creation, comprehensive audit trail logging, and
                mandatory multi-factor authentication enforcement.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-5 sm:space-y-6 hover:border-cyan-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col h-full w-full md:col-span-2 lg:col-span-1">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-2xl sm:text-3xl border border-teal-100 shrink-0">
                <i className="fa-solid fa-receipt" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F2942] leading-tight">
                Automated Fee Collection
              </h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed flex-1">
                Real-time ledger reconciliation, integrated payment tracking, and
                automated bursary receipt generation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10 pt-12 sm:pt-16 w-full">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden group h-full w-full">
              <div className="relative h-56 sm:h-72 lg:h-80 w-full bg-slate-100 border-b border-slate-200 overflow-hidden shrink-0">
                <Image
                  src="/24.png"
                  alt="Secure Server and Database Infrastructure"
                  fill
                  className="object-cover object-right group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  sizes="(max-width: 1280px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 sm:p-8 md:p-10 lg:p-12 space-y-6 sm:space-y-8 flex-1 flex flex-col justify-between">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-blue-50 text-[#0F2942] flex items-center justify-center font-bold text-2xl sm:text-3xl border border-blue-100 shrink-0">
                      <i className="fa-solid fa-building-shield" aria-hidden="true"></i>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#0F2942] leading-tight">
                      Multi-Tenant Partition Guarantee
                    </h3>
                  </div>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                    Every institution operates within its own securely
                    partitioned database schema. Tenant isolation prevents data
                    leakage and ensures absolute compliance with institutional
                    data privacy regulations.
                  </p>
                </div>
                <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg text-slate-700 font-medium pt-6 sm:pt-8 border-t border-slate-100">
                  <li className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0 text-lg sm:text-xl" aria-hidden="true"></i>{" "}
                    Automated tenant provisioning pipelines
                  </li>
                  <li className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0 text-lg sm:text-xl" aria-hidden="true"></i>{" "}
                    Isolated backup routines per institution
                  </li>
                  <li className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0 text-lg sm:text-xl" aria-hidden="true"></i>{" "}
                    Custom domain mapping capabilities
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden group h-full w-full">
              <div className="relative h-56 sm:h-72 lg:h-80 w-full bg-slate-100 border-b border-slate-200 overflow-hidden shrink-0">
                <Image
                  src="/27.png"
                  alt="Access Control and Secure Compliance in Education"
                  fill
                  className="object-cover object-right group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  sizes="(max-width: 1280px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 sm:p-8 md:p-10 lg:p-12 space-y-6 sm:space-y-8 flex-1 flex flex-col justify-between">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-2xl sm:text-3xl border border-cyan-100 shrink-0">
                      <i className="fa-solid fa-user-shield" aria-hidden="true"></i>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#0F2942] leading-tight">
                      Access Control &amp; Compliance
                    </h3>
                  </div>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                    Define exact boundaries for super administrators, finance
                    officers, department heads, teachers, and guardians with
                    customizable permission matrices.
                  </p>
                </div>
                <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg text-slate-700 font-medium pt-6 sm:pt-8 border-t border-slate-100">
                  <li className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0 text-lg sm:text-xl" aria-hidden="true"></i>{" "}
                    Custom role creation and permission grouping
                  </li>
                  <li className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0 text-lg sm:text-xl" aria-hidden="true"></i>{" "}
                    Full audit trail logging for administrative actions
                  </li>
                  <li className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0 text-lg sm:text-xl" aria-hidden="true"></i>{" "}
                    Multi-factor authentication (MFA) enforcement
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}