import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans w-full overflow-x-hidden relative">
      <Header />

      <section className="w-full bg-[#F0F4F8] border-b border-slate-200/80 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#0F2942] border border-blue-100/60 shadow-sm">
            <i className="fa-solid fa-file-contract text-[#0070F3]"></i> Legal & Licensing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2942] tracking-tight">Terms of Service</h1>
          <p className="text-slate-600 text-base sm:text-lg">Last updated: October 2026</p>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 max-w-4xl mx-auto space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-[#0F2942]">1. Acceptance of Terms</h2>
          <p>By accessing or deploying the Elimix School Resource Management System (SRMS) provided by Mavora Technologies, you agree to be bound by these Terms of Service and all applicable institutional compliance standards.</p>
          
          <h2 className="text-2xl font-bold text-[#0F2942]">2. SaaS Subscriptions & Usage</h2>
          <p>Subscription tiers (Starter, Business, Professional, Enterprise) govern access limits including student counts, storage quotas, and module feature flags. Institutions agree not to bypass tenant isolation controls or share administrative credentials.</p>

          <h2 className="text-2xl font-bold text-[#0F2942]">3. Financial Transactions & Webhooks</h2>
          <p>All fee collections utilizing M-Pesa or bank integrations rely on verified backend callbacks. Mavora Technologies is not liable for frontend network timeouts prior to webhook confirmation.</p>

          <h2 className="text-2xl font-bold text-[#0F2942]">4. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of Kenya. For inquiries, contact us at Wood Garden Road, Kilimani, Nairobi.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}