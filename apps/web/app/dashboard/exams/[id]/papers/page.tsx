// apps/web/app/dashboard/exams/[id]/papers/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

interface ExamPaper {
  id: string;
  subject: string;
  paperName: string;
  date: string;
  startTime: string;
  durationMins: number;
  maxMarks: number;
  status: 'Scheduled' | 'Completed' | 'Draft';
}

export default function ManageExamPapersPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  // Mock data for the UI engine
  const [papers, setPapers] = useState<ExamPaper[]>([
    { id: 'PPR-001', subject: 'Mathematics', paperName: 'Paper 1 (Core)', date: '2026-10-25', startTime: '08:00 AM', durationMins: 120, maxMarks: 100, status: 'Scheduled' },
    { id: 'PPR-002', subject: 'General Science', paperName: 'Theory & Practical', date: '2026-10-26', startTime: '10:30 AM', durationMins: 90, maxMarks: 80, status: 'Scheduled' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    subject: 'English Literature',
    paperName: 'Paper 2 (Comprehension)',
    date: '',
    startTime: '08:00 AM',
    durationMins: 90,
    maxMarks: 100,
    status: 'Scheduled' as const,
  });

  const handleSavePaper = (e: React.FormEvent) => {
    e.preventDefault();
    const newPaper: ExamPaper = {
      id: `PPR-00${papers.length + 1}`,
      ...formData,
    };
    setPapers([...papers, newPaper]);
    setSuccessBanner(`${formData.paperName} has been successfully added to the exam schedule.`);
    setIsModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-50/80 text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20';
      case 'Completed': return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'Draft': return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
      default: return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
            <Link href="/dashboard" className="hover:text-[#006FBF] transition-colors">Dashboard</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/exams" className="hover:text-[#006FBF] transition-colors">Exams</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">Manage Papers</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Exam Papers & Subjects</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Configure individual subject papers, durations, and marks for this exam block.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={() => router.back()} className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <i className="fa-solid fa-arrow-left text-[10px]"></i> Back to Exams
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-plus text-[10px]"></i><span>Add Paper</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <i className="fa-solid fa-check text-[10px] bg-emerald-100/80 text-emerald-600 p-1.5 rounded-lg" />
          <p className="flex-1">{successBanner}</p>
        </div>
      )}

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-5 pr-3 w-[25%]">Subject & Paper</th>
                <th className="py-4 px-4 w-[20%]">Date & Time</th>
                <th className="py-4 px-4 w-[15%]">Duration</th>
                <th className="py-4 px-4 w-[15%]">Max Marks</th>
                <th className="py-4 px-4 w-[10%]">Status</th>
                <th className="py-4 pl-3 pr-5 text-right w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {papers.length > 0 ? (
                papers.map((paper) => (
                  <tr key={paper.id} className="hover:bg-slate-50/40 transition-colors text-xs group">
                    <td className="py-4 pl-5 pr-3">
                      <div className="font-semibold text-slate-900 truncate">{paper.subject}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{paper.paperName} <span className="text-slate-300 mx-1">•</span> <span className="font-mono text-slate-400">{paper.id}</span></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-700">{paper.date || 'TBD'}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{paper.startTime}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      <i className="fa-regular fa-clock mr-1.5 text-slate-400"></i>{paper.durationMins} Mins
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-slate-800 font-semibold">{paper.maxMarks}</span> pts
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold ${getStatusBadge(paper.status)}`}>{paper.status}</span>
                    </td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 transition-opacity">
                        <button className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-[#006FBF] hover:bg-[#006FBF]/10 flex items-center justify-center border border-slate-200/60 transition-colors" title="Edit Paper">
                          <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                        </button>
                        <button className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200/60 transition-colors" title="Delete Paper">
                          <i className="fa-solid fa-trash-can text-[10px]"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-xs">No papers configured for this exam yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 gap-4 w-full">
        {papers.map((paper) => (
          <div key={paper.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-3 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="font-semibold text-slate-900 block truncate text-sm">{paper.subject}</span>
                <span className="text-xs text-slate-500">{paper.paperName}</span>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(paper.status)}`}>{paper.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 border-t border-slate-100 pt-2">
              <div><i className="fa-regular fa-calendar mr-1 text-slate-400"></i> {paper.date || 'TBD'}</div>
              <div><i className="fa-regular fa-clock mr-1 text-slate-400"></i> {paper.durationMins} Mins</div>
              <div className="col-span-2 font-mono font-semibold text-slate-800">Max Marks: {paper.maxMarks}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD PAPER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Add Exam Paper</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Configure a subject paper for this block.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"><i className="fa-solid fa-xmark text-sm"></i></button>
            </div>

            <form onSubmit={handleSavePaper}>
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700">Subject *</label>
                    <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700">Paper Name *</label>
                    <input type="text" required value={formData.paperName} onChange={(e) => setFormData({ ...formData, paperName: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700">Date</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700">Start Time</label>
                    <input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700">Duration (Mins) *</label>
                    <input type="number" required min="1" value={formData.durationMins} onChange={(e) => setFormData({ ...formData, durationMins: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white font-mono transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700">Max Marks *</label>
                    <input type="number" required min="1" value={formData.maxMarks} onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white font-mono transition-colors" />
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>Save Paper</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}