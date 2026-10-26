import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { SoftwareAppJsonLd, WebPageJsonLd } from "@/components/seo/JsonLd";

const homeFaqs = [
  {
    question: "What is Elimix School Management System?",
    answer:
      "Elimix is an enterprise, multi-tenant school administration platform engineered by Mavora Technologies. It connects student lifecycle records, fee invoicing, attendance tracking, examination grading, e-learning portals, library logistics, hostel management, transport routing, and staff payroll into one secure, unified system.",
  },
  {
    question: "Which educational institutions are supported by Elimix?",
    answer:
      "Elimix is built to serve primary schools, secondary academies, private learning institutions, and multi-campus tertiary colleges operating under Competency-Based Curriculum (CBC), IGCSE, IB, or college semester frameworks.",
  },
  {
    question: "How does Elimix guarantee data security and tenant isolation?",
    answer:
      "Each educational institution operates within a strictly partitioned PostgreSQL database schema, protected by a granular Role-Based Access Control (RBAC) matrix and immutable audit trails to ensure absolute data confidentiality and integrity.",
  },
  {
    question: "How can our school schedule a product demonstration or view pricing?",
    answer:
      "School directors, principals, and administrators can review student capacity tiers on our Pricing page or connect with our enterprise team via the Contact page to arrange a personalized platform walkthrough.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
      <SoftwareAppJsonLd />
      <WebPageJsonLd
        title="Elimix School Management System in Kenya"
        description="Manage school administration with Elimix. Connect student records, fees, attendance and academic operations in one school management platform."
        path=""
        faqs={homeFaqs}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Banner Section */}
        <section className="w-full bg-[#F0F4F8] text-slate-900 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 pt-6 pb-12 md:pt-10 md:pb-20 lg:pt-12 lg:pb-28 border-b border-slate-200/80 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-emerald-500/15 rounded-tr-full blur-[100px] pointer-events-none"></div>

          <div className="w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16 relative z-10">
            <div className="space-y-6 flex-1 w-full text-center lg:text-left pr-0 lg:pr-8 xl:pr-12 lg:pt-2">
              <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#0F2942] border border-blue-100/60 shadow-sm">
                <i
                  className="fa-solid fa-shield-halved text-[#0070F3]"
                  aria-hidden="true"
                ></i>
                Mavora Technologies • Secure Multi-Tenant Architecture • Automated ERP
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Elimix School Management System &amp;{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Institutional Governance Console
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed">
                Automate administrative workflows, optimize stakeholder communication,
                and govern academic operations through an advanced cloud platform built for modern educational institutions.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 h-12 shadow-md shadow-blue-600/20 text-sm transition-all">
                    <i
                      className="fa-solid fa-right-to-bracket mr-2"
                      aria-hidden="true"
                    ></i>{" "}
                    Launch Workspace
                  </Button>
                </Link>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold px-8 py-3.5 h-12 text-sm shadow-sm transition-all"
                  >
                    <i className="fa-solid fa-tags mr-2" aria-hidden="true"></i>{" "}
                    View Pricing Tiers
                  </Button>
                </Link>
              </div>

              {/* Crawlable Module Navigation */}
              <nav
                aria-label="Core Platform Modules"
                className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-600"
              >
                <span className="font-semibold text-slate-800">
                  Quick Access:
                </span>
                <Link
                  href="/features/cbc-assessment"
                  className="text-blue-600 hover:underline font-medium"
                >
                  CBC &amp; Curriculum
                </Link>
                <Link
                  href="/features/fees-management"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Fees &amp; Finance
                </Link>
                <Link
                  href="/students"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Student Records
                </Link>
                <Link
                  href="/attendance"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Attendance
                </Link>
                <Link
                  href="/exams"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Exams &amp; Reports
                </Link>
              </nav>
            </div>

            {/* Hero Image & Metrics */}
            <div className="w-full lg:w-[450px] xl:w-[550px] shrink-0 flex flex-col items-center gap-6 mt-8 lg:mt-0">
              <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100 group">
                <Image
                  src="/1.png"
                  alt="Elimix School Management System dashboard overview"
                  fill
                  className="object-cover object-right group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-[#0F2942]/10 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
              </div>

              <div className="w-full bg-white/90 backdrop-blur-md text-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0070F3]">
                    Infrastructure Telemetry
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                    Active Cluster Nominal
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div>
                    <div className="text-3xl font-extrabold text-slate-900">
                      Isolated
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Dedicated DB Schema
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-slate-900">
                      99.99%
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Partition Uptime
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span>
                    Query Latency:{" "}
                    <strong className="text-slate-900">12ms</strong>
                  </span>
                  <i
                    className="fa-solid fa-server text-[#0070F3]"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overview & Efficiency Section */}
        <section className="w-full bg-slate-50 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
                <Image
                  src="/15.png"
                  alt="Elimix Comprehensive Institutional Overview"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1200px) 100vw, 800px"
                />
              </div>
              <div className="text-center">
                <Link href="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 h-12 shadow-md">
                    Contact Our Specialists
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="title_sections space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Platform Overview
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Comprehensive Institutional Management Architecture
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Elimix delivers an integrated ERP solution featuring dedicated
                  portals for Administrators, Directors, Educators, Learners, and
                  Guardians. Available via secure cloud deployment, the platform
                  integrates with messaging gateways and financial networks to
                  streamline communication and fee collection.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="text-4xl font-extrabold text-blue-600 shrink-0">
                  89%
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    Administrative Efficiency Gain
                  </h3>
                  <p className="text-sm text-slate-600">
                    Institutions leveraging Elimix benefit from accelerated turnaround
                    times, synchronized stakeholder engagement, and precise academic tracking.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Image
                  src="/smsh2.png"
                  alt="Elimix Emblem"
                  width={48}
                  height={48}
                  className="shrink-0"
                />
                <h3 className="text-lg font-bold text-slate-900">
                  Empowering Smart Academic Ecosystems Across Modern Education.
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Frameworks Section */}
        <section className="w-full bg-[#F0F4F8] border-y border-slate-200/80 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24">
          <div className="max-w-[1800px] mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Curriculum Scope
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Designed to Support Diverse Educational Frameworks
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                  <i className="fa fa-lightbulb-o" aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Competency-Based Curriculum (CBC)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pre-configured rubric tracking and formative evaluation tools
                  enable educators to record competencies, observe learner progress,
                  and generate compliant reports instantly.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                  <i className="fa fa-globe" aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  IGCSE / IB / International Standards
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Flexible examination management modules tailored for international
                  curriculums, featuring robust grading scales, effort tracking,
                  and detailed assessment analytics.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                  <i className="fa fa-mortar-board" aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Tertiary &amp; College Programs
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Scalable multi-campus support incorporating integrated e-learning workspaces,
                  semester unit registration, lecturer portals, and academic transcript generation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App Callout Section */}
        <section className="w-full bg-white px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 max-w-[1800px] mx-auto">
          <div className="bg-gradient-to-br from-slate-100 to-blue-50 rounded-3xl p-8 md:p-16 border border-slate-200 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 max-w-xl">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/10 text-blue-600">
                Elimix Mobile Companion
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Stay Connected to Every Milestone
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Empower parents with a secure, intuitive mobile experience to monitor academic progress, fee statements, attendance logs, and school bulletins anywhere, anytime.
              </p>
              <ul className="space-y-3 text-sm font-semibold text-slate-700">
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    ✓
                  </span>{" "}
                  Real-time push notifications for institutional bulletins
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    ✓
                  </span>{" "}
                  Transparent attendance and academic performance tracking
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    ✓
                  </span>{"   "}
                  Direct parent-teacher communication channels
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    ✓
                  </span>{" "}
                  Instant fee balance checks and digital receipt access
                </li>
              </ul>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://play.google.com/store/apps/details?id=io.keypad.smartshule"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
              </div>
            </div>

            <div className="relative w-full lg:w-[360px] h-[500px] flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full"></div>
              <div className="relative w-[280px] h-[540px] bg-slate-900 rounded-[40px] p-4 shadow-2xl border-4 border-slate-800 flex items-center justify-center overflow-hidden">
                <div className="absolute top-2 w-32 h-4 bg-slate-800 rounded-full"></div>
                <Image
                  src="/smsh2.png"
                  alt="Elimix Mobile Application Interface Preview"
                  fill
                  className="object-cover pt-6"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Custom System Features Grid */}
        <section className="w-full bg-[#F0F4F8] px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 max-w-[1800px] mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Core Modules
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered Capabilities for Modern Schools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <i className="fa fa-users" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Student Lifecycle Management
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Oversee student records from admission through alumni status, maintaining comprehensive academic histories and administrative logs in one secure repository.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <i className="fa fa-credit-card" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Financial Operations &amp; Billing
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track fee invoices, payment receipts, and outstanding ledgers in real time with automated financial reconciliation designed to ease administrative burdens.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Automated Messaging &amp; Alerts
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Broadcast instant SMS and email notifications, fee reminders, and event announcements to parents and staff for dependable communication.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <i className="fa fa-money" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Automated Term Invoicing
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Configure fee structures and voteheads once; the system automatically generates student invoices each term while connecting securely with payment gateways.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <i className="fa fa-graduation-cap" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Examination &amp; Grade Processing
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Capture examination scores, generate professional report forms, compute merit rankings, and distribute results to parents instantly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <i className="fa fa-bar-chart" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Executive Reporting &amp; Analytics
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Produce robust operational dashboards and data insights that empower school boards and directors to make informed strategic choices.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link href="/features">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 h-12">
                Explore All Features <i className="fa fa-arrow-right ml-2"></i>
              </Button>
            </Link>
          </div>
        </section>

        {/* Available Portals Section */}
        <section className="w-full bg-white px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 max-w-[1800px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Role-Based Access
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Dedicated Stakeholder Portals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="text-lg font-bold text-blue-600">Admin Console</h3>
              <p className="text-sm text-slate-600">
                Centralized control center for managing user permissions, operational parameters, and inter-departmental workflows.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="text-lg font-bold text-blue-600">
                Director&apos;s Dashboard
              </h3>
              <p className="text-sm text-slate-600">
                Holistic financial intelligence providing real-time revenue visibility, fee collection metrics, and academic progress indicators.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="text-lg font-bold text-blue-600">
                Educator Portal
              </h3>
              <p className="text-sm text-slate-600">
                Dedicated workspace for planning lessons, recording continuous assessments, taking attendance, and collaborating with parents.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="text-lg font-bold text-blue-600">Parent Hub</h3>
              <p className="text-sm text-slate-600">
                Secure portal allowing guardians to monitor student development, verify attendance records, and review fee statements online.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section className="w-full bg-[#F0F4F8] px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 max-w-[1800px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Pricing Options
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Scalable Packages for Every Institution
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Starter Tier</h3>
                <p className="text-xs text-slate-500">Subscription</p>
              </div>
              <div className="text-3xl font-extrabold text-blue-600">
                15,000 <span className="text-xs font-normal">KES/term</span>
              </div>
              <Link href="/contact">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 shadow-md text-center space-y-6 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
                Most Popular
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Standard Tier
                </h3>
                <p className="text-xs text-slate-500">Subscription</p>
              </div>
              <div className="text-3xl font-extrabold text-blue-600">
                35,000 <span className="text-xs font-normal">KES/term</span>
              </div>
              <Link href="/contact">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Advanced Tier
                </h3>
                <p className="text-xs text-slate-500">Subscription</p>
              </div>
              <div className="text-3xl font-extrabold text-blue-600">
                60,000 <span className="text-xs font-normal">KES/term</span>
              </div>
              <Link href="/contact">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Enterprise Tier
                </h3>
                <p className="text-xs text-slate-500">Custom Deployment</p>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 py-1">
                Contact Us
              </div>
              <Link href="/contact">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                  Request Quote
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link href="/pricing">
              <Button
                variant="outline"
                className="border-slate-300 bg-white font-semibold px-8"
              >
                View Full Pricing &amp; Features
              </Button>
            </Link>
          </div>
        </section>

        {/* Buyer FAQ Section */}
        <section className="w-full bg-white px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Support &amp; Guidance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {homeFaqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2"
              >
                <h3 className="text-base font-bold text-slate-900">
                  {faq.question}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}