// apps/web/app/dashboard/exams/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

interface Exam {
  id: string;
  title: string;
  term: string;
  academicYearName: string;
  academicYearId?: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Grading' | 'Published' | 'Archived';
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  // Mock data for academic years dropdown
  const academicYearsList = [
    { id: '44444444-0000-0000-0000-000000000001', name: '2026/2027 Academic Year' },
    { id: '44444444-0000-0000-0000-000000000002', name: '2027/2028 Academic Year' }
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [termFilter, setTermFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    academicYearId: '',
    term: 'Term 1',
    startDate: '',
    endDate: '',
    status: 'Upcoming',
  });

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const userStr = localStorage.getItem('elimix_user');
    let tenantId = '00000000-0000-0000-0000-000000000000';
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try { tenantId = JSON.parse(userStr).tenantId || tenantId; } catch (e) {}
    }
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-tenant-id': tenantId };
  };

  const fetchExams = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/v1/academics/exams', { headers: getHeaders() });
      if (res.ok) {
        const result = await res.json();
        setExams(result.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchExams(); }, []);

  // --- ACTIONS ---
  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const url = isEditing 
        ? `http://localhost:3001/api/v1/academics/exams/${selectedExam?.id}` 
        : 'http://localhost:3001/api/v1/academics/exams';
        
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Submission failed');

      await fetchExams();
      setSuccessBanner(isEditing ? 'Exam updated successfully.' : 'New exam officially scheduled.');
      setIsModalOpen(false);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedExam) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/academics/exams/${selectedExam.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete exam');
      
      await fetchExams();
      setIsDeleteModalOpen(false);
      setSuccessBanner('Exam schedule removed.');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- QUICK ACTION: UPDATE STATUS ---
  const updateExamStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/academics/exams/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      await fetchExams();
      setSuccessBanner(`Exam status successfully updated to ${newStatus}.`);
      setTimeout(() => setSuccessBanner(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // --- UI TRIGGERS ---
  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedExam(null);
    setFormError(null);
    setFormData({ title: '', academicYearId: '', term: 'Term 1', startDate: '', endDate: '', status: 'Upcoming' });
    setIsModalOpen(true);
  };

  const openEditModal = (exam: Exam) => {
    setIsEditing(true);
    setSelectedExam(exam);
    setFormError(null);
    
    const academicYearMatch = academicYearsList.find(a => a.name === exam.academicYearName);
    
    setFormData({ 
      title: exam.title, 
      academicYearId: academicYearMatch ? academicYearMatch.id : '', 
      term: exam.term, 
      startDate: exam.startDate, 
      endDate: exam.endDate, 
      status: exam.status 
    });
    setIsModalOpen(true);
  };

  const openDeletePrompt = (exam: Exam) => {
    setSelectedExam(exam);
    setFormError(null);
    setIsDeleteModalOpen(true);
  };

  // --- HELPERS ---
  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || exam.status === statusFilter;
    const matchesTerm = termFilter === 'All' || exam.term === termFilter;
    return matchesSearch && matchesStatus && matchesTerm;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-50/80 text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20';
      case 'Ongoing': return 'bg-amber-50/80 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      case 'Grading': return 'bg-purple-50/80 text-purple-700 ring-1 ring-inset ring-purple-600/20';
      case 'Published': return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      default: return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
    }
  };

  const getFormatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
            <Link href="/dashboard" className="hover:text-[#006FBF] transition-colors">Dashboard</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/academics" className="hover:text-[#006FBF] transition-colors">Academics</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">Exams</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Formal Exams & Assessments</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Schedule termly exams, monitor grading windows, and publish results.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={openCreateModal} className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-plus text-[10px]"></i><span>Schedule Exam</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {successBanner && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <i className="fa-solid fa-check text-[10px] bg-emerald-100/80 text-emerald-600 p-1.5 rounded-lg" />
          <p className="flex-1">{successBanner}</p>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Total Exams</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{exams.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Published Results</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{exams.filter(a => a.status === 'Published').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-[#006FBF] uppercase tracking-wider truncate">Upcoming</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{exams.filter(a => a.status === 'Upcoming').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider truncate">Currently Grading</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{exams.filter(a => a.status === 'Grading').length}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input type="text" placeholder="Search exam titles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 sm:py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white" />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white">
            <option value="All">All Terms</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white">
            <option value="All">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Grading">Grading</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-5 pr-3 w-[25%]">Exam Title & ID</th>
                <th className="py-4 px-4 w-[15%]">Academic Year & Term</th>
                <th className="py-4 px-4 w-[15%]">Exam Period</th>
                <th className="py-4 px-4 w-[15%]">Status</th>
                <th className="py-4 pl-3 pr-5 text-right w-[30%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading exams...</td></tr>
              ) : filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50/40 transition-colors text-xs group">
                    <td className="py-4 pl-5 pr-3">
                      <div className="font-semibold text-slate-900 truncate max-w-[280px]">{exam.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{exam.id}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-700">{exam.academicYearName}</div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">{exam.term}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-slate-600">
                        <span>{getFormatDate(exam.startDate)}</span>
                        <i className="fa-solid fa-arrow-right text-[8px] text-slate-300"></i>
                        <span>{getFormatDate(exam.endDate)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold ${getStatusBadge(exam.status)}`}>{exam.status}</span>
                    </td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        
                        {/* QUICK ACTIONS (Dynamic based on Status) */}
                        {exam.status === 'Upcoming' && (
                          <button onClick={() => updateExamStatus(exam.id, 'Ongoing')} className="rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1.5 text-[10px] font-bold transition-colors border border-amber-200/50" title="Start Exam">
                            <i className="fa-solid fa-play mr-1"></i> Start
                          </button>
                        )}
                        {exam.status === 'Ongoing' && (
                          <button onClick={() => updateExamStatus(exam.id, 'Grading')} className="rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 px-2.5 py-1.5 text-[10px] font-bold transition-colors border border-purple-200/50" title="Move to Grading">
                            <i className="fa-solid fa-marker mr-1"></i> Grade
                          </button>
                        )}
                        {exam.status === 'Grading' && (
                          <button onClick={() => updateExamStatus(exam.id, 'Published')} className="rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1.5 text-[10px] font-bold transition-colors border border-emerald-200/50" title="Publish Results">
                            <i className="fa-solid fa-bullhorn mr-1"></i> Publish
                          </button>
                        )}

                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        {/* STANDARD ACTIONS */}
                        <button onClick={() => openEditModal(exam)} className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-[#006FBF] hover:bg-[#006FBF]/10 flex items-center justify-center border border-slate-200/60 transition-colors" title="Edit Exam">
                          <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                        </button>
                        <button onClick={() => openDeletePrompt(exam)} className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200/60 transition-colors" title="Delete Exam">
                          <i className="fa-solid fa-trash-can text-[10px]"></i>
                        </button>
                        
                        {/* Manage Papers Link */}
                        <Link href={`/dashboard/exams/${exam.id}/papers`} className="rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60 shadow-sm ml-1 flex items-center gap-1.5">
                          Manage Papers <i className="fa-solid fa-arrow-right text-[9px]"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-xs">No matching exams found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</div>
        ) : filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <div key={exam.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
              <div className="flex justify-between items-start gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]"><i className="fa-solid fa-file-signature text-sm" /></span>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-900 block truncate text-sm">{exam.title}</span>
                    <span className="inline-flex items-center mt-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700 border border-slate-200">{exam.id}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-regular fa-calendar-days text-slate-400 w-5 text-center flex-shrink-0" />
                  <span className="truncate flex-1 font-medium text-slate-700">{exam.academicYearName} <span className="text-slate-400">({exam.term})</span></span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                  <span className="font-mono text-[10px] text-slate-500">{getFormatDate(exam.startDate)} - {getFormatDate(exam.endDate)}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(exam.status)}`}>{exam.status}</span>
                </div>
              </div>

              {/* Mobile Quick Actions */}
              <div className="pt-2">
                {exam.status === 'Upcoming' && <button onClick={() => updateExamStatus(exam.id, 'Ongoing')} className="w-full rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-2 text-xs font-bold transition-colors border border-amber-200/50 mb-2"><i className="fa-solid fa-play mr-1"></i> Start Exam</button>}
                {exam.status === 'Ongoing' && <button onClick={() => updateExamStatus(exam.id, 'Grading')} className="w-full rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-2 text-xs font-bold transition-colors border border-purple-200/50 mb-2"><i className="fa-solid fa-marker mr-1"></i> Move to Grading</button>}
                {exam.status === 'Grading' && <button onClick={() => updateExamStatus(exam.id, 'Published')} className="w-full rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-2 text-xs font-bold transition-colors border border-emerald-200/50 mb-2"><i className="fa-solid fa-bullhorn mr-1"></i> Publish Results</button>}

                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2">
                  <button onClick={() => openEditModal(exam)} className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/60">
                    <i className="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <Link href={`/dashboard/exams/${exam.id}/papers`} className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60">
                    <i className="fa-regular fa-file-lines"></i> Papers
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm">No exams scheduled.</div>
        )}
      </div>

      {/* CREATE / EDIT EXAM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{isEditing ? 'Edit Exam Schedule' : 'Schedule New Exam'}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Define exam dates, terms, and academic year.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"><i className="fa-solid fa-xmark text-sm"></i></button>
            </div>

            <form onSubmit={handleSaveExam}>
              <div className="p-6 space-y-4 text-xs max-h-[60vh] overflow-y-auto">
                {formError && <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium mb-3"><i className="fa-solid fa-triangle-exclamation mr-2"></i>{formError}</div>}
                
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Exam Title *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" placeholder="e.g. End of Year Finals" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Academic Year *</label>
                    <select required value={formData.academicYearId} onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors">
                      <option value="">Select year...</option>
                      {academicYearsList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Term *</label>
                    <select required value={formData.term} onChange={(e) => setFormData({ ...formData, term: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors">
                      <option value="Term 1">Term 1</option>
                      <option value="Term 2">Term 2</option>
                      <option value="Term 3">Term 3</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Start Date *</label>
                    <input type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">End Date *</label>
                    <input type="date" required value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Grading">Grading</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition-colors" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>{isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Schedule Exam')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <i className="fa-solid fa-triangle-exclamation text-xl text-rose-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Exam</h3>
              <p className="mt-1.5 text-xs text-slate-500">Are you sure you want to permanently delete "<span className="font-semibold text-slate-700">{selectedExam.title}</span>"? This action cannot be undone.</p>
            </div>
            {formError && <div className="text-xs text-rose-600 font-medium">{formError}</div>}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting} className="w-full sm:w-auto rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="button" onClick={handleDelete} disabled={isSubmitting} className="w-full sm:w-auto rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}