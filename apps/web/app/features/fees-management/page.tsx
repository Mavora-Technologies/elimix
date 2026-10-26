import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "School Fees Management & M-Pesa Integration System",
  description: "Automate school fee collection, real-time M-Pesa reconciliation, digital invoicing, and financial tracking with Elimix by Mavora Technologies.",
  keywords: [
    "School fees management system Kenya",
    "M-Pesa school fees integration",
    "School accounting and billing software Kenya",
    "Elimix fee collection platform"
  ],
  alternates: {
    canonical: "https://elimix.mavoratechnologies.com/features/fees-management",
  },
  openGraph: {
    title: "School Fees Management & M-Pesa Integration | Elimix",
    description: "Automate fee collections, bank reconciliations, and parent billing securely.",
    url: "https://elimix.mavoratechnologies.com/features/fees-management",
    type: "website",
  }
};

export default function FeesManagementPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "School Fees Management & M-Pesa Integration",
    "description": "Automate school fee collection, real-time M-Pesa reconciliation, and digital invoicing with Elimix.",
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
          <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-emerald-600 border border-emerald-100 shadow-sm">
            <i className="fa-solid fa-wallet"></i> Automated Financial Auditing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            School Fees Management & <span className="text-emerald-600">M-Pesa Integration</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Eliminate manual reconciliation headaches. Allow parents to pay tuition via M-Pesa and bank transfers with instant automated ledger updates and SMS receipts.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/contact">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 h-12 shadow-md">
                Talk to Finance Specialists
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <i className="fa-solid fa-mobile-screen-button"></i>
            </div>
            <h3 className="text-lg font-bold">M-Pesa & Bank Paybill C2B</h3>
            <p className="text-sm text-slate-600">Automatic payment attribution using admission numbers as account references without manual spreadsheet reconciliation.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <i className="fa-solid fa-receipt"></i>
            </div>
            <h3 className="text-lg font-bold">Digital Invoicing & Statements</h3>
            <p className="text-sm text-slate-600">Instantly generate termly fee structures, digital receipts, and up-to-date student balance statements accessible via the parent portal.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 className="text-lg font-bold">Immutable Audit Trails</h3>
            <p className="text-sm text-slate-600">Board of Management (BoM) ready financial reports, vote-head tracking, and secure audit logs for every transaction.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}