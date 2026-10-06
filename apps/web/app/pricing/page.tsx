import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white font-sans w-full overflow-x-hidden relative">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-[#F0F4F8] border-b border-slate-200/80 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pt-6 pb-14 md:pt-10 md:pb-24 lg:pt-16 lg:pb-32 relative overflow-hidden flex items-center">
        {/* Green accent positioned exactly at the bottom left corner */}
        <div className="absolute bottom-0 left-0 w-[20rem] sm:w-[30rem] lg:w-[40rem] h-[20rem] sm:h-[30rem] lg:h-[40rem] bg-emerald-500/15 rounded-tr-full blur-[80px] sm:blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[2000px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-14 lg:gap-16 xl:gap-24 relative z-10">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left w-full lg:w-1/2 flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#0F2942] border border-blue-100/60 shadow-sm transition-all hover:shadow-md">
              <i className="fa-solid fa-tags text-[#0070F3]"></i>
              <span>Flexible SaaS Subscription Models</span>
            </div>
            
            {/* Added Gradient Color to the Wordings */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-extrabold tracking-tight text-[#0F2942] leading-[1.15] sm:leading-[1.1] w-full">
              Transparent Pricing <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Scaled for Every Institution</span>
            </h1>
            
            <p className="text-slate-600 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl lg:max-w-none w-full">
              Choose the ideal multi-tenant tier for your school, college, or multi-campus educational organization. Upgrade, scale, or customize features seamlessly.
            </p>
            <div className="pt-2 sm:pt-4 w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
               <Link href="/contact" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#0F2942] hover:bg-slate-800 text-white font-semibold px-8 py-4 h-14 sm:h-12 shadow-md transition-all text-base">
                  Contact Sales for Custom Plan
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Hero Image Addition */}
          <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
            <div className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[4/3] xl:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 group">
              <Image
                src="/19.png"
                alt="Institutional Financial Analytics and Growth"
                fill
                className="object-cover object-right group-hover:scale-105 transition-transform duration-700 ease-in-out"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              />
              <div className="absolute inset-0 bg-cyan-900/10 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
            <div className="absolute -inset-4 sm:-inset-6 bg-cyan-400/20 blur-2xl sm:blur-3xl -z-10 rounded-[3rem]"></div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Grid */}
      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 sm:py-20 md:py-24 lg:py-32 max-w-[2000px] mx-auto space-y-12 sm:space-y-16 flex-1">
        <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F2942] tracking-tight leading-tight">
            Institutional Subscription Plans
          </h2>
          <p className="text-slate-600 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
            All plans include tenant data isolation, secure cloud backup routines, and core role-based access control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-8 pt-4 sm:pt-8 w-full items-stretch">
          
          {/* Starter Plan */}
          <div className="bg-white p-6 sm:p-8 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8 flex flex-col justify-between hover:border-cyan-400 transition-all duration-300 h-full w-full">
            <div className="space-y-5 sm:space-y-6">
              <div className="inline-block px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                Starter
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] leading-tight">Starter Plan</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Ideal for smaller schools and tuition centers starting their digital administration journey.
                </p>
              </div>
              <div className="py-5 sm:py-6 border-y border-slate-100 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl lg:text-3xl 2xl:text-4xl font-extrabold text-[#0F2942]">KSh 3,000</span>
                <span className="text-slate-500 text-sm sm:text-base font-medium"> / month</span>
              </div>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-700 font-medium">
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0.5 text-lg"></i> Up to 300 students</li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0.5 text-lg"></i> Core Admissions & Attendance</li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0.5 text-lg"></i> Basic Fee Invoicing</li>
              </ul>
            </div>
            <Link href="/contact" className="w-full pt-4 mt-auto">
              <Button variant="outline" className="w-full border-slate-300 font-semibold h-12 sm:h-14 hover:bg-slate-50 text-base">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Business Plan */}
          <div className="bg-white p-6 sm:p-8 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8 flex flex-col justify-between hover:border-cyan-400 transition-all duration-300 h-full w-full">
            <div className="space-y-5 sm:space-y-6">
              <div className="inline-block px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                Business
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] leading-tight">Business Plan</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Advanced tracking and automated operations for growing primary and secondary schools.
                </p>
              </div>
              <div className="py-5 sm:py-6 border-y border-slate-100 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl lg:text-3xl 2xl:text-4xl font-extrabold text-[#0F2942]">KSh 6,000</span>
                <span className="text-slate-500 text-sm sm:text-base font-medium"> / month</span>
              </div>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-700 font-medium">
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0.5 text-lg"></i> Up to 800 students</li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0.5 text-lg"></i> Standard Email Notifications</li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0.5 text-lg"></i> Basic Academic Engine</li>
              </ul>
            </div>
            <Link href="/contact" className="w-full pt-4 mt-auto">
              <Button variant="outline" className="w-full border-slate-300 font-semibold h-12 sm:h-14 hover:bg-slate-50 text-base">
                Deploy Business
              </Button>
            </Link>
          </div>

          {/* Professional Plan (Featured) */}
          <div className="bg-[#0F2942] text-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-[#0F2942] shadow-2xl space-y-6 sm:space-y-8 flex flex-col justify-between relative transform xl:scale-105 z-10 h-full w-full">
            <div className="absolute -top-4 right-6 sm:right-8 bg-cyan-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg">
              Most Popular
            </div>
            <div className="space-y-5 sm:space-y-6">
              <div className="inline-block px-3 py-1.5 rounded-full bg-white/10 text-cyan-300 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                Professional
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">Professional Campus</h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Designed for established primary, secondary, and mid-sized training institutions.
                </p>
              </div>
              <div className="py-5 sm:py-6 border-y border-white/10 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl lg:text-3xl 2xl:text-4xl font-extrabold text-white">KSh 10,000</span>
                <span className="text-slate-300 text-sm sm:text-base font-medium"> / month</span>
              </div>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-200 font-medium">
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-cyan-400 mt-1 sm:mt-0.5 text-lg"></i> Up to 2,000 students</li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-cyan-400 mt-1 sm:mt-0.5 text-lg"></i> CBC & IGCSE Academic Engines</li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-cyan-400 mt-1 sm:mt-0.5 text-lg"></i> Automated M-Pesa & Bank Sync</li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-cyan-400 mt-1 sm:mt-0.5 text-lg"></i> Meta WhatsApp & SMS Alerts</li>
              </ul>
            </div>
            <Link href="/contact" className="w-full pt-4 mt-auto">
              <Button className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0F2942] font-extrabold h-12 sm:h-14 shadow-md transition-all text-base">
                Deploy Professional
              </Button>
            </Link>
          </div>

          {/* Enterprise / Custom Plan */}
          <div className="bg-white p-6 sm:p-8 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8 flex flex-col justify-between hover:border-cyan-400 transition-all duration-300 h-full w-full">
            <div className="space-y-5 sm:space-y-6">
              <div className="inline-block px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                Enterprise
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] leading-tight">Enterprise Custom</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Tailored architectures for large colleges, universities, and multi-campus networks.
                </p>
              </div>
              <div className="py-5 sm:py-6 border-y border-slate-100 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl lg:text-3xl 2xl:text-4xl font-extrabold text-[#0F2942]">KSh 15,000</span>
                <span className="text-slate-500 text-sm sm:text-base font-medium"> / month</span>
              </div>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-700 font-medium">
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0.5 text-lg"></i> 2,000+ / custom students</li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0.5 text-lg"></i> Multi-Campus Partitioning</li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0.5 text-lg"></i> Advanced HR & Payroll Engine</li>
                <li className="flex items-start gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1 sm:mt-0.5 text-lg"></i> Dedicated Custom Integrations</li>
              </ul>
            </div>
            <Link href="/contact" className="w-full pt-4 mt-auto">
              <Button variant="outline" className="w-full border-slate-300 font-semibold h-12 sm:h-14 hover:bg-slate-50 text-base">
                Contact Architecture
              </Button>
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}