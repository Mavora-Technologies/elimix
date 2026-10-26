import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { SoftwareAppJsonLd, WebPageJsonLd } from "@/components/seo/JsonLd";

const homeFaqs = [
  {
    question: "What is a school management system and what does Elimix do?",
    answer:
      "Elimix School Management System (Mavora SRMS) is a cloud-based administrative platform developed by Mavora Technologies. It connects student admissions, academic curriculum tracking, attendance, examinations, fee management, e-learning, library, hostel, transport, HR payroll, and procurement inside an isolated workspace for each institution.",
  },
  {
    question: "Which institutions can use Elimix in Kenya?",
    answer:
      "Elimix supports primary schools, junior and senior secondary schools, private academies, colleges, and multi-campus tertiary institutions running Competency-Based Curriculum (CBC), IGCSE, or semester-based academic structures.",
  },
  {
    question: "How does Elimix secure student records and financial data?",
    answer:
      "Each institution operates within a partitioned PostgreSQL database schema with granular Role-Based Access Control (RBAC) for directors, principals, department heads, bursars, teachers, and parents, backed by immutable audit trails.",
  },
  {
    question: "How can a school evaluate features, pricing, or request a demo?",
    answer:
      "School decision-makers can review institutional capacity tiers on the Pricing page, explore module documentation under Features, or contact Mavora Technologies via the Contact page to schedule a live product walkthrough.",
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
        {/* Hero Section */}
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
                Elimix by Mavora Technologies • Secure • Scalable • Multi-Tenant
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Elimix School Management System &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Institutional Operations Console
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed">
                Manage school administration with Elimix. Connect student
                records, fee structures, attendance tracking, CBC assessments,
                and real-time academic analytics for primary schools, secondary
                academies, colleges, and universities.
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

              {/* Crawlable Internal Navigation to Core Public Feature Pages */}
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
                  School Fees &amp; Finance
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
                  Exams &amp; Report Cards
                </Link>
                <Link
                  href="/communication"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Parent Portal
                </Link>
              </nav>
            </div>

            {/* Quick System Metrics & Feature Image Container */}
            <div className="w-full lg:w-[450px] xl:w-[550px] shrink-0 flex flex-col items-center gap-6 mt-8 lg:mt-0">
              <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100 group">
                <Image
                  src="/1.png"
                  alt="Elimix School Management System dashboard displaying student records, fee tracking, and academic analytics"
                  fill
                  className="object-cover object-right group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-[#0F2942]/10 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
              </div>

              {/* 2nd Card (Clearly Labeled Illustrative Telemetry Preview) */}
              <div className="w-full bg-white/90 backdrop-blur-md text-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0070F3]">
                    Workspace Telemetry (Illustrative Preview)
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                    Multi-Tenant Architecture
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      Isolated
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Per-School DB Schema
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      RBAC
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Role Permission Matrix
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span>
                    Security Governance:{" "}
                    <strong className="text-slate-900">
                      Immutable Audit Logs
                    </strong>
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

        {/* Enterprise Features Grid */}
        <section className="w-full bg-slate-50 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 lg:py-28 max-w-[1800px] mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600">
              Enterprise Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Built for Enterprise Scale and Institutional Security
            </h2>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
              Designed from the ground up to support seamless multi-tenant
              isolation, precise administrative control, and complete financial
              auditing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100">
                <i className="fa-solid fa-database" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Strict Tenant Isolation
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Each institution operates within a partitioned database schema
                guaranteeing zero cross-tenant data leakage across student,
                staff, and financial records.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100">
                <i className="fa-solid fa-lock" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Granular RBAC Matrix
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Role matrices designed specifically for super admins,
                institutional directors, principals, department leads, teachers,
                and school bursars.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100">
                <i className="fa-solid fa-chart-line" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Immutable Audit Trails
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Full traceability of administrative actions, fee collections,
                reconciliations, and grade modifications with secure audit logs.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Showcase 1 */}
        <section className="w-full bg-white border-y border-slate-200/80 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24">
          <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600">
                Interactive Curriculum Integration
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Bridging Traditional Classrooms with Modern Multi-Tenant
                Workflows
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Elimix unites teachers, learners, and administrators across
                primary, secondary, and tertiary levels. Our platform
                effortlessly manages complex curricula like CBC, IGCSE, and
                college semester units without breaking performance.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <i
                    className="fa-solid fa-check-circle text-emerald-500 text-lg"
                    aria-hidden="true"
                  ></i>{" "}
                  Real-time CBC Rubrics
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <i
                    className="fa-solid fa-check-circle text-emerald-500 text-lg"
                    aria-hidden="true"
                  ></i>{" "}
                  Branded Report Cards
                </div>
              </div>
              <div className="pt-2 flex flex-wrap gap-6 text-sm font-semibold">
                <Link
                  href="/features/cbc-assessment"
                  className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5"
                >
                  CBC Assessment Software{" "}
                  <i
                    className="fa-solid fa-arrow-right text-xs"
                    aria-hidden="true"
                  ></i>
                </Link>
                <Link
                  href="/features/fees-management"
                  className="text-slate-700 hover:text-blue-600 inline-flex items-center gap-1.5"
                >
                  School Fees Management{" "}
                  <i
                    className="fa-solid fa-arrow-right text-xs"
                    aria-hidden="true"
                  ></i>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
                <Image
                  src="/15.png"
                  alt="Elimix interactive classroom curriculum mapping, CBC rubrics, and report card workflow"
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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
                Seamless Institutional Onboarding
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Get your school or university fully provisioned in three
                structured steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
                <div className="text-blue-600 font-extrabold text-sm tracking-wider">
                  STEP 01
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Select Tenant Tier
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Choose your student capacity bracket ranging from Starter up
                  to Enterprise custom deployments.
                </p>
              </div>

              <div className="space-y-3 p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
                <div className="text-blue-600 font-extrabold text-sm tracking-wider">
                  STEP 02
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Provision Workspace
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Instantiate your isolated database schema and configure
                  initial administrative credentials.
                </p>
              </div>

              <div className="space-y-3 p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
                <div className="text-blue-600 font-extrabold text-sm tracking-wider">
                  STEP 03
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Manage &amp; Scale
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Monitor student admissions, automated term billings, and
                  academic performance metrics in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Showcase 2 */}
        <section className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24">
          <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600">
                Cloud-Native LMS Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Empowering Students with Digital Workspaces and Real-Time
                Collaboration
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Equip your institution with integrated e-learning modules,
                automated quiz marking, and digital assignment portals. Powered
                by Cloudinary media storage and isolated Neon PostgreSQL
                databases for maximum security.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link href="/features">
                  <Button className="bg-[#0F2942] hover:bg-slate-800 text-white font-semibold px-6 py-3 h-11 text-sm rounded-xl">
                    Explore All Platform Features{" "}
                    <i
                      className="fa-solid fa-arrow-right ml-2 text-xs"
                      aria-hidden="true"
                    ></i>
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
                <Image
                  src="/24.png"
                  alt="Elimix cloud-native LMS digital workspace showing student courses, quizzes, and resources"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Buyer FAQ Section for Decision-Makers & GEO */}
        <section className="w-full bg-slate-50 border-b border-slate-200/80 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Answers for School Owners, Principals &amp; Bursars
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {homeFaqs.map((faq) => (
                <div
                  key={faq.question}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2"
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
          </div>
        </section>

        {/* Final Call to Action Section */}
        <section className="w-full bg-slate-50 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 max-w-[1800px] mx-auto text-center">
          <div className="bg-[#0B1727] text-white rounded-3xl p-8 md:p-16 lg:p-20 shadow-2xl shadow-slate-900/10 border border-slate-800 space-y-8 relative overflow-hidden group">
            <Image
              src="/10.png"
              alt="Graduating students representing institutional academic excellence"
              fill
              className="object-cover object-right opacity-15 mix-blend-overlay pointer-events-none group-hover:opacity-25 transition-opacity duration-700"
              sizes="(max-width: 1800px) 100vw, 1800px"
            />
            <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>

            <div className="space-y-4 max-w-3xl mx-auto relative z-10">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Ready to Transform Your Institution?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                Partner with Mavora Technologies to deploy Elimix for secure
                academic, student, and financial management.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0B1727] font-bold px-8 py-3.5 text-sm shadow-md h-12 border border-slate-200 transition-all">
                  Launch Workspace Now
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-slate-600 bg-transparent text-white hover:bg-slate-800 font-semibold px-8 py-3.5 text-sm h-12 transition-all"
                >
                  Contact Enterprise Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}