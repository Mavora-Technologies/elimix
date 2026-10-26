import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { WebPageJsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "About Elimix & Mavora Technologies",
  description: "Learn about Mavora Technologies and how Elimix delivers secure, cloud-native school management architecture for modern institutions.",
  alternates: {
    canonical: "/about",
  },
};

const aboutFaqs = [
  {
    question: "Who develops and maintains Elimix School Management System?",
    answer:
      "Elimix is engineered, developed, and maintained by Mavora Technologies, a software engineering and digital transformation company.",
  },
  {
    question: "What engineering standards does Elimix use?",
    answer:
      "Elimix utilizes strict multi-tenancy with isolated database schemas, cloud-native scalability built on Neon PostgreSQL, Node.js, and Next.js, and dedicated SLA support.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans w-full overflow-x-hidden relative">
      <WebPageJsonLd
        title="About Elimix & Mavora Technologies"
        description="Learn about Mavora Technologies and how Elimix delivers secure, cloud-native school management architecture for modern institutions."
        path="/about"
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "About", path: "/about" },
        ]}
        faqs={aboutFaqs}
      />
      <Header />

      <main className="flex-1">
        <section className="w-full bg-[#F0F4F8] border-b border-slate-200/80 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pt-6 pb-14 md:pt-10 md:pb-24 lg:pt-16 lg:pb-32 relative overflow-hidden flex items-center">
          <div className="absolute bottom-0 left-0 w-[20rem] sm:w-[30rem] lg:w-[40rem] h-[20rem] sm:h-[30rem] lg:h-[40rem] bg-emerald-500/15 rounded-tr-full blur-[80px] sm:blur-[100px] pointer-events-none"></div>

          <div className="w-full max-w-[2000px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-14 lg:gap-16 xl:gap-24 relative z-10">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left w-full lg:w-1/2 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#0F2942] border border-blue-100/60 shadow-sm">
                <i
                  className="fa-solid fa-building text-[#0070F3]"
                  aria-hidden="true"
                ></i>
                <span>Powered by Mavora Technologies Ltd</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-extrabold tracking-tight text-[#0F2942] leading-[1.15] w-full">
                Transforming Educational Operations Worldwide
              </h1>
              <p className="text-slate-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl lg:max-w-none w-full">
                Elimix is built by Mavora Technologies to simplify school
                administration, connect educational communities, and empower
                decision-making through secure cloud architecture.
              </p>
              <div className="pt-2 w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-[#0F2942] hover:bg-slate-800 text-white font-semibold px-8 py-4 h-14 shadow-md transition-all text-base">
                    Contact Architecture Team
                  </Button>
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 group">
                <Image
                  src="/8.png"
                  alt="Mavora Technologies Engineering Team Workspace"
                  fill
                  className="object-cover object-right group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-16 sm:py-24 max-w-[2000px] mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2942]">
              Our Engineering Standards
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-[#0070F3] flex items-center justify-center text-xl font-bold">
                <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-[#0F2942]">
                Strict Multi-Tenancy
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every institution operates within isolated database schemas
                guaranteeing absolute data security and zero leakage.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl font-bold">
                <i className="fa-solid fa-cloud" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-[#0F2942]">
                Cloud-Native Scale
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Built on Neon PostgreSQL, Node.js, and Next.js, hosted globally
                via Cloudflare and Render/Vercel.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl font-bold">
                <i className="fa-solid fa-headset" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-[#0F2942]">
                Dedicated SLA Support
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dedicated solution architects ready to assist educational
                institutions with seamless onboarding and deployment.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}