import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-[#F0F4F8] text-slate-900 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 pt-6 pb-12 md:pt-10 md:pb-20 lg:pt-12 lg:pb-28 border-b border-slate-200/80 relative overflow-hidden">
        {/* Added subtle dot pattern exactly like the reference */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>
        {/* Green accent positioned exactly at the bottom left corner */}
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-emerald-500/15 rounded-tr-full blur-[100px] pointer-events-none"></div>
        
        {/* CHANGED: Added lg:items-start to eliminate the massive vertical gap above the text */}
        <div className="w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16 relative z-10">
          
          {/* TEXT SPREAD WIDE: Added lg:pt-2 to perfectly flush align it with the image top */}
          <div className="space-y-6 flex-1 w-full text-center lg:text-left pr-0 lg:pr-8 xl:pr-12 lg:pt-2">
            <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#0F2942] border border-blue-100/60 shadow-sm">
              <i className="fa-solid fa-shield-halved text-[#0070F3]"></i>
              Mavora SRMS Enterprise Core • Secure • Scalable • Automated
            </div>
            
            {/* Added Gradient Color to Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Governance & Operations Console</span>
            </h1>
            
            <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed">
              SRMS delivers strict data partitioning, granular role-based access control (RBAC), and real-time academic analytics for primary institutions, secondary academies, and multi-campus universities.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 h-12 shadow-md shadow-blue-600/20 text-sm transition-all">
                  <i className="fa-solid fa-right-to-bracket mr-2"></i> Launch Workspace
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold px-8 py-3.5 h-12 text-sm shadow-sm transition-all">
                  <i className="fa-solid fa-tags mr-2"></i> View Pricing Tiers
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick System Metrics & Feature Image Container */}
          <div className="w-full lg:w-[450px] xl:w-[550px] shrink-0 flex flex-col items-center gap-6 mt-8 lg:mt-0">
            {/* 1st Image Size Increased to Match 2nd Card's Balanced Proportions */}
            <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100 group">
              <Image
                src="/1.png"
                alt="Institutional Dashboard Data Analytics Preview"
                fill
                className="object-cover object-right group-hover:scale-105 transition-transform duration-700"
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-[#0F2942]/10 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
            
            {/* 2nd Card (Metrics Card) */}
            <div className="w-full bg-white/90 backdrop-blur-md text-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0070F3]">Cluster Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> All Systems Nominal
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900">142</div>
                  <div className="text-xs text-slate-500 mt-0.5">Active Tenants</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900">99.99%</div>
                  <div className="text-xs text-slate-500 mt-0.5">Partition Uptime</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex items-center justify-between">
                <span>Isolated DB Latency: <strong className="text-slate-900">12ms</strong></span>
                <i className="fa-solid fa-server text-[#0070F3]"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Features Grid */}
      <section className="w-full bg-slate-50 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 lg:py-28 max-w-[1800px] mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600">Enterprise Architecture</span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Built for Enterprise Scale and Institutional Security
          </h2>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
            Designed from the ground up to support seamless multi-tenant isolation, precise administrative control, and complete financial auditing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100">
              <i className="fa-solid fa-database"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Strict Tenant Isolation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Each institution operates within a partitioned database schema guaranteeing zero cross-tenant data leakage.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100">
              <i className="fa-solid fa-lock"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Granular RBAC Matrix</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Role matrices designed specifically for super admins, institutional directors, department leads, and bursars.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Immutable Audit Trails</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Full traceability of administrative actions, fee collections, and grade modifications with secure audit logs.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Showcase 1 */}
      <section className="w-full bg-white border-y border-slate-200/80 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600">Interactive Curriculum Integration</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Bridging Traditional Classrooms with Modern Multi-Tenant Workflows
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Elimix unites teachers, learners, and administrators across primary, secondary, and tertiary levels. Our platform effortlessly manages complex curricula like CBC, IGCSE, and college semester units without breaking performance.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                <i className="fa-solid fa-check-circle text-emerald-500 text-lg"></i> Real-time CBC Rubrics
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                <i className="fa-solid fa-check-circle text-emerald-500 text-lg"></i> Branded Report Cards
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
              <Image
                src="/15.png"
                alt="Interactive Classroom Curriculum and Mapping"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Operational Workflow Section */}
      <section className="w-full bg-[#F0F4F8] border-b border-slate-200/80 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-20 lg:py-28">
        <div className="max-w-[1800px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">Seamless Institutional Onboarding</h2>
            <p className="text-slate-600 text-sm sm:text-base">Get your school or university fully provisioned in under three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
              <div className="text-blue-600 font-extrabold text-sm tracking-wider">STEP 01</div>
              <h3 className="text-lg font-bold text-slate-900">Select Tenant Tier</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Choose your student capacity bracket ranging from Starter up to Enterprise custom deployments.</p>
            </div>

            <div className="space-y-3 p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
              <div className="text-blue-600 font-extrabold text-sm tracking-wider">STEP 02</div>
              <h3 className="text-lg font-bold text-slate-900">Provision Workspace</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Instantly instantiate your isolated database schema and configure initial administrative credentials.</p>
            </div>

            <div className="space-y-3 p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
              <div className="text-blue-600 font-extrabold text-sm tracking-wider">STEP 03</div>
              <h3 className="text-lg font-bold text-slate-900">Manage & Scale</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Monitor student admissions, automated term billings, and academic performance metrics in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase 2 */}
      <section className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600">Cloud-Native LMS Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Empowering Students with Digital Workspaces and Real-Time Collaboration
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Equip your institution with integrated e-learning modules, automated quiz marking, and digital assignment portals. Powered by Cloudinary media storage and isolated Neon PostgreSQL databases for maximum security.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button className="bg-[#0F2942] hover:bg-slate-800 text-white font-semibold px-6 py-3 h-11 text-sm rounded-xl">
                  Explore LMS Features <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
              <Image
                src="/24.png"
                alt="Cloud-Native LMS Digital Workspace"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="w-full bg-slate-50 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 max-w-[1800px] mx-auto text-center">
        <div className="bg-[#0B1727] text-white rounded-3xl p-8 md:p-16 lg:p-20 shadow-2xl shadow-slate-900/10 border border-slate-800 space-y-8 relative overflow-hidden group">
          {/* Decorative Background Image matching target institutions */}
          <Image 
            src="/10.png"
            alt="University Graduation and Education Success"
            fill
            className="object-cover object-right opacity-15 mix-blend-overlay pointer-events-none group-hover:opacity-25 transition-opacity duration-700"
            sizes="(max-width: 1800px) 100vw, 1800px"
          />
          <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
          
          <div className="space-y-4 max-w-3xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Ready to Transform Your Institution?</h2>
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed">
              Join leading schools and universities relying on Mavora SRMS for secure academic and financial management.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0B1727] font-bold px-8 py-3.5 text-sm shadow-md h-12 border border-slate-200 transition-all">
                Launch Workspace Now
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-slate-600 bg-transparent text-white hover:bg-slate-800 font-semibold px-8 py-3.5 text-sm h-12 transition-all">
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