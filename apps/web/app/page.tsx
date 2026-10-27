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
      "Elimix is an all-in-one school management platform that helps schools manage students, fees, attendance, academics, staff, and parent communication in one place.",
  },
  {
    question: "Which schools can use Elimix?",
    answer:
      "Elimix is built for primary schools, secondary academies, private learning institutions, and colleges operating under the Competency-Based Curriculum (CBC), IGCSE, or semester frameworks.",
  },
  {
    question: "How does Elimix handle fee collection and parent communication?",
    answer:
      "Elimix automates term invoicing, payment tracking, fee balances, and sends instant SMS and email alerts so parents stay fully informed of their children's school activities.",
  },
  {
    question: "How can our school get started or request a demo?",
    answer:
      "School principals, directors, and administrators can check our pricing plans or contact our support team to schedule a personalized platform demonstration.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans w-full overflow-x-hidden">
      <SoftwareAppJsonLd />
      <WebPageJsonLd
        title="Elimix School Management System in Kenya"
        description="Manage school administration with Elimix. Connect student records, fees, attendance and academic operations in one school management platform."
        path=""
        faqs={homeFaqs}
      />
      <Header />

      <main className="flex-1 w-full flex flex-col">
        {/* Hero Banner Section */}
        <section className="w-full bg-[#F0F4F8] text-slate-900 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pt-8 pb-14 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32 border-b border-slate-200/80 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-emerald-500/15 rounded-tr-full blur-[100px] pointer-events-none"></div>

          <div className="w-full max-w-[2000px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">
            <div className="space-y-6 flex-1 w-full text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#0F2942] border border-blue-100/60 shadow-sm">
                <i
                  className="fa-solid fa-school text-[#0070F3]"
                  aria-hidden="true"
                ></i>
                Complete School Management Platform by Mavora Technologies
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Manage Students, Fees, Attendance &amp; Academics{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  All in One Place
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl lg:max-w-none">
                Elimix helps schools streamline daily administration, track student performance, simplify fee collections, and keep parents closely connected.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 h-12 shadow-md shadow-blue-600/20 text-sm transition-all">
                    <i
                      className="fa-solid fa-right-to-bracket mr-2"
                      aria-hidden="true"
                    ></i>{" "}
                    Launch Portal
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

              {/* Quick Access Links */}
              <nav
                aria-label="Core Platform Modules"
                className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-600"
              >
                <span className="font-semibold text-slate-800">
                  Explore Modules:
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

            {/* Hero Image & Dashboard Highlight */}
            <div className="w-full lg:w-[450px] xl:w-[550px] shrink-0 flex flex-col items-center gap-6">
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

              <div className="w-full bg-white/90 backdrop-blur-md text-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0070F3]">
                    Trusted School Solution
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>{" "}
                    Reliable &amp; Secure
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Elimix brings your entire school community together on a single, easy-to-use platform designed for teachers, parents, and administrators.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Overview & Efficiency Section */}
        <section className="w-full bg-slate-50 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 md:py-24 max-w-[2000px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-6 w-full">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
                <Image
                  src="/15.png"
                  alt="Elimix Comprehensive School Management Overview"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1200px) 100vw, 800px"
                />
              </div>
              <div className="text-center">
                <Link href="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 h-12 shadow-md">
                    Speak With Our Team
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6 w-full">
              <div className="title_sections space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Unified Platform
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Everything Your School Needs in One Place
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Elimix eliminates paperwork and disconnected spreadsheets by unifying student admissions, term billing, exam processing, teacher grading, and parent announcements into a single workflow.
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
                    Schools using Elimix save hours of administrative time each week, allowing staff to focus more on student learning and mentorship.
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
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                  Empowering Digital Schools Across Modern Education.
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Frameworks Section */}
        <section className="w-full bg-[#F0F4F8] border-y border-slate-200/80 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 md:py-24">
          <div className="max-w-[2000px] mx-auto space-y-12 w-full">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Curriculum Support
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Built for CBC, IGCSE &amp; College Curriculums
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all flex flex-col h-full">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                  <i className="fa fa-lightbulb-o" aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Competency-Based Curriculum (CBC)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">
                  Pre-configured rubric tracking and formative evaluation tools allow teachers to easily assess competencies and generate professional report cards.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all flex flex-col h-full">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                  <i className="fa fa-globe" aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  IGCSE &amp; International Standards
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">
                  Flexible grading scales, effort tracking, and detailed exam analytics designed specifically for international curriculum schools.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all flex flex-col h-full">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                  <i className="fa fa-mortar-board" aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Tertiary &amp; College Programs
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">
                  Comprehensive semester unit registration, lecturer portals, and academic transcript management for colleges and training institutes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App Callout Section */}
        <section className="w-full bg-white px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 md:py-24 max-w-[2000px] mx-auto">
          <div className="bg-gradient-to-br from-slate-100 to-blue-50 rounded-3xl p-8 md:p-16 border border-slate-200 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
            <div className="space-y-6 max-w-xl w-full">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/10 text-blue-600">
                Elimix Mobile Companion
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Stay Connected to Every School Moment
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Give parents a secure, easy-to-use mobile experience to monitor academic progress, fee balances, attendance logs, and school announcements anywhere, anytime.
              </p>
              <ul className="space-y-3 text-sm font-semibold text-slate-700">
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0">
                    ✓
                  </span>{" "}
                  Instant push notifications for school bulletins
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0">
                    ✓
                  </span>{" "}
                  Transparent attendance and grade tracking
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0">
                    ✓
                  </span>{" "}
                  Direct parent-teacher communication channels
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0">
                    ✓
                  </span>{" "}
                  Quick fee balance checks and digital receipts
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

            <div className="relative w-full lg:w-[360px] h-[500px] flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full"></div>
              <div className="relative w-[280px] h-[540px] bg-slate-900 rounded-[40px] p-4 shadow-2xl border-4 border-slate-800 flex items-center justify-center overflow-hidden">
                <div className="absolute top-2 w-32 h-4 bg-slate-800 rounded-full"></div>
                <Image
                  src="/smsh2.png"
                  alt="Elimix Mobile App Interface Preview"
                  fill
                  className="object-cover pt-6"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="w-full bg-[#F0F4F8] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 md:py-24 max-w-[2000px] mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Core Features
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything Your School Needs in One Place
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col h-full">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <i className="fa fa-users" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Student Management
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                Maintain comprehensive student profiles, admissions, attendance records, and medical histories from enrollment to graduation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col h-full">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <i className="fa fa-credit-card" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Fees &amp; Financial Tracking
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                Streamline school fee collections, track payment ledgers, issue digital receipts, and generate financial reports effortlessly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col h-full">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Parent Communication
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                Send instant SMS and email announcements, fee reminders, and student progress updates directly to parents.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col h-full">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <i className="fa fa-money" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Automated Invoicing
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                Set up termly fee structures and voteheads once, and let the system automatically generate student invoices every term.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col h-full">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <i className="fa fa-graduation-cap" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Academics &amp; Exams
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                Record exam marks, compute merit rankings, track subject performance, and print professional report cards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col h-full">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <i className="fa fa-bar-chart" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Staff &amp; Operations
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                Manage teacher timetables, staff attendance, library inventories, hostel allocations, and school transport logs.
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

        {/* Dedicated Stakeholder Portals */}
        <section className="w-full bg-white px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 md:py-24 max-w-[2000px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Role-Based Access
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Dedicated Portals for Everyone
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col h-full">
              <h3 className="text-lg font-bold text-blue-600">Admin Portal</h3>
              <p className="text-sm text-slate-600 flex-1">
                Centralized dashboard for managing school settings, user accounts, timetables, and daily administrative workflows.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col h-full">
              <h3 className="text-lg font-bold text-blue-600">
                Director&apos;s Portal
              </h3>
              <p className="text-sm text-slate-600 flex-1">
                Gain complete oversight of school financial performance, fee collection trends, and academic progress indicators.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col h-full">
              <h3 className="text-lg font-bold text-blue-600">
                Teachers Portal
              </h3>
              <p className="text-sm text-slate-600 flex-1">
                Dedicated workspace for recording exam marks, logging lesson attendance, managing assignments, and updating parents.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col h-full">
              <h3 className="text-lg font-bold text-blue-600">Parents Portal</h3>
              <p className="text-sm text-slate-600 flex-1">
                Secure access for parents to review student report cards, track attendance, check fee balances, and receive school notices.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section className="w-full bg-[#F0F4F8] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 md:py-24 max-w-[2000px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Pricing Options
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Flexible Packages for Every School
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Starter Tier</h3>
                <p className="text-xs text-slate-500">Subscription</p>
              </div>
              <div className="text-3xl font-extrabold text-blue-600 py-2">
                15,000 <span className="text-xs font-normal">KES/term</span>
              </div>
              <Link href="/contact" className="block w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 shadow-md text-center space-y-6 relative flex flex-col justify-between h-full">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
                Most Popular
              </span>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Standard Tier
                </h3>
                <p className="text-xs text-slate-500">Subscription</p>
              </div>
              <div className="text-3xl font-extrabold text-blue-600 py-2">
                35,000 <span className="text-xs font-normal">KES/term</span>
              </div>
              <Link href="/contact" className="block w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Advanced Tier
                </h3>
                <p className="text-xs text-slate-500">Subscription</p>
              </div>
              <div className="text-3xl font-extrabold text-blue-600 py-2">
                60,000 <span className="text-xs font-normal">KES/term</span>
              </div>
              <Link href="/contact" className="block w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Enterprise Tier
                </h3>
                <p className="text-xs text-slate-500">Custom Deployment</p>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 py-3">
                Contact Us
              </div>
              <Link href="/contact" className="block w-full">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                  Request Quote
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center pt-4">
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

        {/* Buyer FAQ Section - Revamped with Exclusive Accordion (Only one open at a time) */}
        <section className="w-full bg-white px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 md:py-24 max-w-[2000px] mx-auto">
          <div className="max-w-4xl mx-auto space-y-12 w-full">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/10 text-blue-600">
                Support &amp; Guidance
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 text-base max-w-2xl mx-auto">
                Got questions about how Elimix simplifies school administration? Find clear answers below.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
              {homeFaqs.map((faq, idx) => (
                <details
                  key={faq.question}
                  name="faq-accordion"
                  className="group bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 p-6 transition-all duration-300 w-full open:bg-white open:shadow-md open:border-blue-200"
                  defaultChecked={idx === 0}
                  {...(idx === 0 ? { open: true } : {})}
                >
                  <summary className="flex items-center justify-between cursor-pointer font-bold text-base sm:text-lg text-slate-900 list-none gap-4">
                    <span>{faq.question}</span>
                    <span className="h-8 w-8 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 transition-transform duration-300 group-open:rotate-180">
                      <i className="fa-solid fa-chevron-down text-xs" aria-hidden="true"></i>
                    </span>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-slate-200/60 text-slate-600 text-sm sm:text-base leading-relaxed">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}