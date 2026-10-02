import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 px-6 py-12 md:px-12 md:py-20">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0F2942] border border-blue-100">
              <i className="fa-solid fa-shield-halved text-cyan-600"></i>
              Mavora SRMS Enterprise Core • Secure • Scalable • Automated
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] sm:text-5xl lg:text-6xl leading-[1.1]">
              Institutional Governance & Operations Console
            </h1>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
              SRMS delivers strict data partitioning, granular role-based access control (RBAC), and real-time academic analytics for primary institutions, secondary academies, and multi-campus universities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#0F2942] hover:bg-[#1a3d63] text-white font-semibold px-6 py-3 h-12 shadow-sm text-xs">
                  <i className="fa-solid fa-right-to-bracket mr-2"></i> Launch Workspace
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-6 py-3 h-12 text-xs">
                  <i className="fa-solid fa-tags mr-2"></i> View Pricing Tiers
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick System Metrics Box */}
          <div className="w-full md:w-auto bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 space-y-5 sm:min-w-[340px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cluster Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> All Systems Nominal
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <div className="text-3xl font-extrabold text-white">142</div>
                <div className="text-xs text-slate-400 mt-0.5">Active Tenants</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">99.99%</div>
                <div className="text-xs text-slate-400 mt-0.5">Partition Uptime</div>
              </div>
            </div>
            <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 flex items-center justify-between">
              <span>Isolated DB Latency: <strong className="text-white">12ms</strong></span>
              <i className="fa-solid fa-server text-cyan-400"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Features Grid */}
      <section className="px-4 sm:px-6 py-16 md:py-24 md:px-12 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Enterprise Architecture</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F2942] tracking-tight">
            Built for Enterprise Scale and Institutional Security
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Designed from the ground up to support seamless multi-tenant isolation, precise administrative control, and complete financial auditing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:border-cyan-500 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-[#0F2942] flex items-center justify-center font-bold text-xl">
              <i className="fa-solid fa-database"></i>
            </div>
            <h3 className="text-lg font-bold text-[#0F2942]">Strict Tenant Isolation</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Each institution operates within a partitioned database schema guaranteeing zero cross-tenant data leakage.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:border-cyan-500 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-xl">
              <i className="fa-solid fa-lock"></i>
            </div>
            <h3 className="text-lg font-bold text-[#0F2942]">Granular RBAC Matrix</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Role matrices designed specifically for super admins, institutional directors, department leads, and bursars.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:border-cyan-500 transition-colors sm:col-span-2 md:col-span-1">
            <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xl">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <h3 className="text-lg font-bold text-[#0F2942]">Immutable Audit Trails</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Full traceability of administrative actions, fee collections, and grade modifications with secure audit logs.
            </p>
          </div>
        </div>
      </section>

      {/* Operational Workflow Section */}
      <section className="bg-white border-y border-slate-200 px-6 py-16 md:py-20 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942]">Seamless Institutional Onboarding</h2>
            <p className="text-slate-600 text-xs sm:text-sm">Get your school or university fully provisioned in under three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-cyan-600 font-extrabold text-sm">STEP 01</div>
              <h3 className="text-base font-bold text-[#0F2942]">Select Tenant Tier</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Choose your student capacity bracket ranging from Starter up to Enterprise custom deployments.</p>
            </div>

            <div className="space-y-3 p-6 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-cyan-600 font-extrabold text-sm">STEP 02</div>
              <h3 className="text-base font-bold text-[#0F2942]">Provision Workspace</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Instantly instantiate your isolated database schema and configure initial administrative credentials.</p>
            </div>

            <div className="space-y-3 p-6 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-cyan-600 font-extrabold text-sm">STEP 03</div>
              <h3 className="text-base font-bold text-[#0F2942]">Manage & Scale</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Monitor student admissions, automated term billings, and academic performance metrics in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="px-4 sm:px-6 py-16 md:py-24 max-w-5xl mx-auto text-center space-y-6">
        <div className="bg-[#0F2942] text-white rounded-2xl p-8 md:p-14 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
          <div className="space-y-3 max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Ready to Transform Your Institution?</h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Join leading schools and universities relying on Mavora SRMS for secure academic and financial management.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-[#0F2942] font-bold px-8 py-3 text-xs shadow-md">
                Launch Workspace Now
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-slate-700 bg-transparent text-white hover:bg-slate-800 font-semibold px-8 py-3 text-xs">
                Contact Enterprise Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}