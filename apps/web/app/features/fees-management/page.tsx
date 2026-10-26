import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { WebPageJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "School Fees & Finance Management Software in Kenya",
  description:
    "Track school fee structures, student invoices, fee payments, reconciliation, defaulter lists and balance statements with Elimix by Mavora Technologies.",
  keywords: [
    "school fees management system",
    "school fee collection software",
    "school fees payment tracking",
    "school accounting software",
    "school finance management system",
    "school fee balances and statements",
    "Elimix Mavora Technologies",
  ],
  alternates: {
    canonical: "/features/fees-management",
  },
  openGraph: {
    title: "School Fees & Finance Management Software | Elimix",
    description:
      "Manage term fee structures, student invoicing, payment reconciliation, and financial reporting with immutable audit trails.",
    url: "/features/fees-management",
    type: "website",
  },
};

const financeFaqs = [
  {
    question: "How can schools track fees, balances, and payments in Elimix?",
    answer:
      "School bursars configure termly fee structures, generate student invoices, record fee payments, reconcile transactions, and issue updated fee balance statements from the Finance workspace.",
  },
  {
    question: "What financial reports are available for school principals and boards?",
    answer:
      "Elimix provides dedicated financial reports covering fee collections, fee defaulters, income-expenditure summaries, hostel and transport fee tracking, and procurement invoices.",
  },
  {
    question: "How does Elimix protect financial records from unauthorized edits?",
    answer:
      "Access to invoicing, payment reconciliation, and fee structures is governed by Role-Based Access Control (RBAC), and all financial actions are recorded in immutable audit logs.",
  },
];

export default function FeesManagementPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans">
      <WebPageJsonLd
        title="School Fees & Finance Management Software in Kenya"
        description="Track school fee structures, student invoices, fee payments, reconciliation, defaulter lists and balance statements with Elimix."
        path="/features/fees-management"
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Features", path: "/features" },
          { name: "School Fees Management", path: "/features/fees-management" },
        ]}
        faqs={financeFaqs}
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
              School Fees &amp; Finance Management
            </li>
          </ol>
        </nav>

        <section className="w-full bg-[#F0F4F8] py-12 md:py-20 px-4 sm:px-8 border-b border-slate-200">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-emerald-600 border border-emerald-100 shadow-sm">
              <i className="fa-solid fa-wallet" aria-hidden="true"></i>{" "}
              Institutional Finance &amp; Auditing
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              School Fees Management, Invoicing &amp;{" "}
              <span className="text-emerald-600">Financial Reconciliation</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Equip school bursars, principals, and administrators with structured
              term billing, student invoicing, payment reconciliation, balance
              statements, and audit-ready financial reporting.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/contact">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 h-12 shadow-md">
                  Schedule a Finance Walkthrough
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
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Verified School Finance &amp; Accounting Capabilities
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Built directly into the Elimix Finance, Procurement, and Reporting
              modules for transparent institutional governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <i
                  className="fa-solid fa-file-invoice-dollar"
                  aria-hidden="true"
                ></i>
              </div>
              <h3 className="text-lg font-bold">
                Fee Structures &amp; Invoicing
              </h3>
              <p className="text-sm text-slate-600">
                Define termly fee structures across classes, manage hostel and
                transport fee schedules, and generate student invoices.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
              </div>
              <h3 className="text-lg font-bold">
                Payments &amp; Reconciliation
              </h3>
              <p className="text-sm text-slate-600">
                Record student fee payments, reconcile transactions against
                outstanding invoices, and produce accurate fee statements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              </div>
              <h3 className="text-lg font-bold">
                Defaulter Reports &amp; Audit Trails
              </h3>
              <p className="text-sm text-slate-600">
                Track fee collection progress, identify outstanding balances,
                review income-expenditure reports, and inspect immutable audit
                logs.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Explore Related School Modules
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Connect school finance with student admissions, parent portals,
                and academic reporting.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-semibold">
              <Link href="/finance" className="text-emerald-600 hover:underline">
                Finance Module →
              </Link>
              <Link href="/students" className="text-emerald-600 hover:underline">
                Student Records →
              </Link>
              <Link
                href="/features/cbc-assessment"
                className="text-emerald-600 hover:underline"
              >
                CBC Assessment →
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-16 space-y-8">
          <h2 className="text-2xl font-extrabold text-slate-900 text-center">
            Frequently Asked Questions on School Fee Management
          </h2>
          <div className="space-y-4">
            {financeFaqs.map((faq) => (
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