import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function AcademicsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans w-full overflow-x-hidden relative">
      <Header />

      <section className="w-full bg-[#F0F4F8] border-b border-slate-200/80 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pt-6 pb-14 md:pt-10 md:pb-24 lg:pt-16 lg:pb-32 relative overflow-hidden flex items-center">
        <div className="absolute bottom-0 left-0 w-[20rem] sm:w-[30rem] lg:w-[40rem] h-[20rem] sm:h-[30rem] lg:h-[40rem] bg-emerald-500/15 rounded-tr-full blur-[80px] sm:blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[2000px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-14 lg:gap-16 xl:gap-24 relative z-10">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left w-full lg:w-1/2 flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#0F2942] border border-blue-100/60 shadow-sm">
              <i className="fa-solid fa-book-open text-[#0070F3]"></i>
              <span>Configurable Curriculum & Timetable Engine</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-extrabold tracking-tight text-[#0F2942] leading-[1.15] w-full">
              Multi-Curriculum Academic Administration
            </h1>
            <p className="text-slate-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl lg:max-w-none w-full">
              Full support for Kenya CBC (Strands, Sub-strands, Competencies, Rubrics), IGCSE, IB, ACE, and higher education college semester progressions.
            </p>
            <div className="pt-2 w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#0F2942] hover:bg-slate-800 text-white font-semibold px-8 py-4 h-14 shadow-md transition-all text-base">
                  Explore Curricula
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 group">
              <Image
                src="/7.png"
                alt="Academic Management"
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2942]">Curriculum & Timetable Features</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-[#0070F3] flex items-center justify-center text-xl font-bold"><i className="fa-solid fa-puzzle-piece"></i></div>
            <h3 className="text-xl font-bold text-[#0F2942]">Kenya CBC Engine</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Configurable rubrics, formative/summative assessments, teacher observations, and descriptive report generation.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="h-12 w-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl font-bold"><i className="fa-solid fa-calendar-days"></i></div>
            <h3 className="text-xl font-bold text-[#0F2942]">Smart Timetable Engine</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Automated conflict detection for teachers, rooms, and classes supporting double lessons and periods.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl font-bold"><i className="fa-solid fa-chalkboard-user"></i></div>
            <h3 className="text-xl font-bold text-[#0F2942]">Lesson Plans & Schemes</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Connected lesson planning, term schemes, digital student diaries, and completion tracking for teachers.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}