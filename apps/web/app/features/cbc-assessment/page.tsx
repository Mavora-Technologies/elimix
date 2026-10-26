import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { WebPageJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "CBC Assessment & Curriculum Management Software in Kenya",
  description:
    "Manage Competency-Based Curriculum (CBC) rubrics, subject allocations, lesson plans, timetables and report cards with Elimix by Mavora Technologies.",
  keywords: [
    "CBC assessment management software",
    "CBC school management system Kenya",
    "report card generation software",
    "school examination management software",
    "school timetable management software",
    "Elimix Mavora Technologies",
  ],
  alternates: {
    canonical: "/features/cbc-assessment",
  },
  openGraph: {
    title: "CBC Assessment & Curriculum Management Software | Elimix",
    description:
      "Manage Competency-Based Curriculum (CBC) rubrics, lesson plans, timetables, and automated report cards for Kenyan schools.",
    url: "/features/cbc-assessment",
    type: "website",
    images: [
      {
        url: "/15.png",
        width: 1200,
        height: 630,
        alt: "Elimix CBC Assessment & Curriculum Management Interface",
      },
    ],
  },
};

const cbcFaqs = [
  {
    question: "How does Elimix support CBC assessment workflows in Kenya?",
    answer:
      "Elimix structures academic administration around curriculum strands, department and subject configurations, teacher lesson plans, continuous assessment rubrics, and examination papers, compiling learner progress into branded report cards.",
  },
  {
    question: "Can schools manage CBC alongside IGCSE or college semester units?",
    answer:
      "Yes. Elimix is architected for primary schools, secondary academies, and tertiary institutions, supporting CBC rubrics, IGCSE grading, and college semester units within each institution's isolated workspace.",
  },
  {
    question: "How do teachers and heads of department collaborate on assessments?",
    answer:
      "Subject teachers log rubric evaluations and exam scores for their allocated classes, while department leads and school principals review subject analytics and approve final report cards under role-based access controls.",
  },
];

export default function CbcAssessmentPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans">
      <WebPageJsonLd
        title="CBC Assessment & Curriculum Management Software in Kenya"
        description="Manage Competency-Based Curriculum (CBC) rubrics, subject allocations, lesson plans, timetables and report cards with Elimix."
        path="/features/cbc-assessment"
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Features", path: "/features" },
          { name: "CBC Assessment & Curriculum", path: "/features/cbc-assessment" },
        ]}
        faqs={cbcFaqs}
      />
      <Header />

      <main className="flex-1">
        <nav
          aria-label="Breadcrumb"
          className="bg-[#F0F4F8] px-4 sm:px-8 pt-6 text-xs text-slate-600"
        >
          <ol className="max-w-6xl mx-auto flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/features" className="hover:text-blue-600">
                Features
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-slate-900" aria-current="page">
              CBC Assessment &amp; Curriculum
            </li>
          </ol>
        </nav>

        <section className="w-full bg-[#F0F4F8] py-12 md:py-20 px-4 sm:px-8 border-b border-slate-200">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-100 shadow-sm">
                <i
                  className="fa-solid fa-graduation-cap"
                  aria-hidden="true"
                ></i>{" "}
                Academic &amp; CBC Operations
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Competency-Based Curriculum (CBC){" "}
                <span className="text-blue-600">
                  Assessment &amp; Academic Reporting
                </span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Replace manual spreadsheets with a unified academic workspace.
                Elimix connects curriculum structure, subject allocations,
                lesson plans, CBC rubrics, timetables, and examination report
                cards for schools in Kenya.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 h-12 shadow-md">
                    Request a Live Demo
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    className="border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-semibold px-6 py-3 h-12"
                  >
                    View Pricing Tiers
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
              <Image
                src="/15.png"
                alt="Elimix CBC curriculum tracking, rubric grading, and academic report card interface"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 600px"
                priority
              />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Verified Academic &amp; Assessment Capabilities
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Designed for school principals, heads of department, and teachers
              to manage daily academic delivery and learner evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <i className="fa-solid fa-book-open" aria-hidden="true"></i>
              </div>
              <h3 className="text-lg font-bold">
                Curriculum &amp; Lesson Plans
              </h3>
              <p className="text-sm text-slate-600">
                Structure academic departments, subjects, teacher allocations,
                lesson plans, and CBC competency rubrics across grade levels.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <i className="fa-solid fa-file-lines" aria-hidden="true"></i>
              </div>
              <h3 className="text-lg font-bold">
                Examinations &amp; Report Cards
              </h3>
              <p className="text-sm text-slate-600">
                Manage exam papers, record continuous and summative results, and
                generate branded student report cards with subject analytics.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <i className="fa-solid fa-calendar-days" aria-hidden="true"></i>
              </div>
              <h3 className="text-lg font-bold">
                Timetables &amp; Academic Reports
              </h3>
              <p className="text-sm text-slate-600">
                Build conflict-free class schedules and review subject and
                teacher performance reports from the academic dashboard.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Connected School Administration Modules
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Academic operations link directly with student records,
                attendance tracking, and school fee management.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-semibold">
              <Link
                href="/academics"
                className="text-blue-600 hover:underline"
              >
                Academics Module →
              </Link>
              <Link href="/exams" className="text-blue-600 hover:underline">
                Examinations →
              </Link>
              <Link
                href="/features/fees-management"
                className="text-blue-600 hover:underline"
              >
                Fees Management →
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-16 space-y-8">
          <h2 className="text-2xl font-extrabold text-slate-900 text-center">
            Frequently Asked Questions on CBC &amp; Academic Management
          </h2>
          <div className="space-y-4">
            {cbcFaqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2"
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