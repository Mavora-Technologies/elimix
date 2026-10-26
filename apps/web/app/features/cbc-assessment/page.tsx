import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "CBC Assessment & Report Card Software for Kenyan Schools",
  description: "Streamline Competency-Based Curriculum (CBC) tracking, strand rubrics, formative assessments, and automated report cards with Elimix by Mavora Technologies.",
  keywords: [
    "CBC assessment software Kenya",
    "Competency based curriculum management system",
    "CBC report card generator Kenya",
    "School grading software Nairobi",
    "Elimix Mavora Technologies"
  ],
  alternates: {
    canonical: "https://elimix.mavoratechnologies.com/features/cbc-assessment",
  },
  openGraph: {
    title: "CBC Assessment & Report Card Software | Elimix",
    description: "Accurate, real-time CBC rubric tracking and automated reporting for modern schools in Kenya.",
    url: "https://elimix.mavoratechnologies.com/features/cbc-assessment",
    type: "website",
  }
};

export default function CbcAssessmentPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "CBC Assessment & Report Card Software",
    "description": "Streamline Competency-Based Curriculum (CBC) tracking, strand rubrics, and automated report cards with Elimix.",
    "provider": {
      "@type": "Organization",
      "name": "Mavora Technologies",
      "url": "https://mavoratechnologies.com"
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <section className="w-full bg-[#F0F4F8] py-16 md:py-24 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-100 shadow-sm">
            <i className="fa-solid fa-graduation-cap"></i> CBC Curriculum Compliance
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Competency-Based Curriculum (CBC) <span className="text-blue-600">Assessment & Reporting</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Elimix provides educators in Kenya with robust formative and summative assessment tracking, strand rubrics, and automated report card generation tailored for the 2-6-3-3-3 curriculum structure.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 h-12 shadow-md">
                Request a Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <i className="fa-solid fa-book-open"></i>
            </div>
            <h3 className="text-lg font-bold">Strand & Sub-Strand Tracking</h3>
            <p className="text-sm text-slate-600">Easily log core competencies, values, and specific learning outcomes across all primary and junior secondary grades.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <i className="fa-solid fa-file-lines"></i>
            </div>
            <h3 className="text-lg font-bold">Automated Report Cards</h3>
            <p className="text-sm text-slate-600">Generate professional, branded termly report cards featuring descriptive feedback and performance rubrics instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <i className="fa-solid fa-chart-pie"></i>
            </div>
            <h3 className="text-lg font-bold">Analytics & Teacher Portals</h3>
            <p className="text-sm text-slate-600">Equip teachers with streamlined marks entry portals while giving school directors clear visibility into academic performance.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}