import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans w-full overflow-x-hidden relative">
      <Header />

      <section className="w-full bg-[#F0F4F8] border-b border-slate-200/80 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#0F2942] border border-blue-100/60 shadow-sm">
            <i className="fa-solid fa-shield-dog text-[#0070F3]"></i> Data Protection & Compliance
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2942] tracking-tight">Privacy Policy</h1>
          <p className="text-slate-600 text-base sm:text-lg">Last updated: October 2026</p>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 max-w-4xl mx-auto space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-[#0F2942]">1. Commitment to Tenant Isolation</h2>
          <p>Mavora Technologies (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the Elimix School Resource Management System (SRMS). We are deeply committed to protecting the privacy and confidentiality of institutional data, student records, staff details, and financial transactions.</p>
          
          <h2 className="text-2xl font-bold text-[#0F2942]">2. Data Collection & Multi-Tenancy</h2>
          <p>Every educational institution is hosted as a secure independent tenant. Data entered by Tenant A is strictly partitioned and inaccessible to Tenant B. We collect personal and academic information strictly required for institutional administration under authorized administrative roles.</p>

          <h2 className="text-2xl font-bold text-[#0F2942]">3. Media & Cloudinary Storage</h2>
          <p>Uploaded student photos, documents, PDFs, and library resources are securely managed via Cloudinary with tenant-aware file paths. No large binary files are stored directly inside core database tables.</p>

          <h2 className="text-2xl font-bold text-[#0F2942]">4. Contact Us</h2>
          <p>For any privacy-related inquiries, please contact our data protection officer at <a href="mailto:info@mavoratechnologies.com" className="text-[#0070F3] font-semibold underline">info@mavoratechnologies.com</a> or visit our headquarters at Wood Garden Road, Kilimani, Nairobi.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}