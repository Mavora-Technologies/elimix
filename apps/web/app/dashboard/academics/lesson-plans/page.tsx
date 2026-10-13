// apps/web/app/dashboard/academics/lesson-plans/page.tsx
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

// Dynamic API URL for Local/Production compatibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  subjectId?: string; // For editing
  teacherName: string;
  teacherId?: string; // For editing
  gradeStream: string;
  streamId?: string; // For editing
  objectives?: string;
  submissionDate: string;
  status: 'Approved' | 'Pending Review' | 'Draft' | 'Needs Revision';
}

export default function LessonPlansPage() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);

  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    teacherId: '',
    streamId: '',
    objectives: '',
    status: 'Pending Review',
  });

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const userStr = localStorage.getItem('elimix_user');
    let tenantId = '00000000-0000-0000-0000-000000000000';
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try { tenantId = JSON.parse(userStr).tenantId || tenantId; } catch (e) { }
    }
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-tenant-id': tenantId };
  };

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const headers = getHeaders();
      const [lpRes, subRes, teachRes, streamsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/academics/lesson-plans`, { headers }),
        fetch(`${API_BASE_URL}/academics/subjects`, { headers }),
        fetch(`${API_BASE_URL}/teachers`, { headers }),
        fetch(`${API_BASE_URL}/academics/timetables/streams`, { headers })
      ]);

      if (lpRes.ok) setLessonPlans((await lpRes.json()).data || []);
      if (subRes.ok) setSubjects((await subRes.json()).data || []);
      if (teachRes.ok) setTeachers((await teachRes.json()).data || []);
      if (streamsRes.ok) setStreams((await streamsRes.json()).data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPageData(); }, []);

  // --- ACTIONS ---
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const url = isEditing
        ? `${API_BASE_URL}/academics/lesson-plans/${selectedPlan?.id}`
        : `${API_BASE_URL}/academics/lesson-plans`;

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Submission failed');

      await fetchPageData();
      setSuccessBanner(isEditing ? 'Lesson plan updated successfully.' : 'New lesson plan successfully created.');
      setCreateModalOpen(false);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPlan) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/academics/lesson-plans/${selectedPlan.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete lesson plan');

      await fetchPageData();
      setDeleteModalOpen(false);
      setSuccessBanner('Lesson plan permanently deleted.');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_BASE_URL}/academics/lesson-plans/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      await fetchPageData();
      if (viewDetailsModalOpen && selectedPlan?.id === id) {
        setSelectedPlan({ ...selectedPlan, status: status as any });
      }
    } catch (e) { }
  };

  // --- UI TRIGGERS ---
  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedPlan(null);
    setFormError(null);
    setFormData({ title: '', subjectId: '', teacherId: '', streamId: '', objectives: '', status: 'Pending Review' });
    setCreateModalOpen(true);
  };

  const openEditModal = (plan: LessonPlan) => {
    setIsEditing(true);
    setSelectedPlan(plan);
    setFormError(null);

    const subj = subjects.find(s => s.name === plan.subject);
    const stream = streams.find(s => s.name === plan.gradeStream);
    const teach = teachers.find(t => `${t.firstName} ${t.lastName}`.trim() === plan.teacherName || t.fullName === plan.teacherName);

    setFormData({
      title: plan.title,
      subjectId: subj ? subj.id : '',
      teacherId: teach ? teach.id : '',
      streamId: stream ? stream.id : '',
      objectives: plan.objectives || '',
      status: plan.status
    });
    setCreateModalOpen(true);
  };

  const openViewModal = (plan: LessonPlan) => {
    setSelectedPlan(plan);
    setViewDetailsModalOpen(true);
  };

  const openDeletePrompt = (plan: LessonPlan) => {
    setSelectedPlan(plan);
    setFormError(null);
    setDeleteModalOpen(true);
  };

  // --- HELPERS ---
  const filteredPlans = lessonPlans.filter((plan) => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || plan.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) || plan.gradeStream.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || plan.status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || plan.subject === subjectFilter;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const getStatusBadge = (status: LessonPlan['status']) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'Pending Review': return 'bg-amber-50/80 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      case 'Needs Revision': return 'bg-rose-50/80 text-rose-700 ring-1 ring-inset ring-rose-600/20';
      case 'Draft': return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
      default: return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
    }
  };

  const availableSubjectsFilter = Array.from(new Set(lessonPlans.map(p => p.subject)));
  const getInitials = (name: string) => name ? name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'T';

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
            <span className="text-slate-900 truncate">Lesson Plans</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Lesson Plans & Curriculum</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Review, approve, and manage weekly lesson plans submitted by faculty.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/academics" className="hidden sm:flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <i className="fa-solid fa-book-open text-[#006FBF]"></i><span>Academics</span>
          </Link>
          <button onClick={openCreateModal} className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-plus text-[10px]"></i><span>New Lesson Plan</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <i className="fa-solid fa-check text-[10px] bg-emerald-100/80 text-emerald-600 p-1.5 rounded-lg" />
          <p className="flex-1">{successBanner}</p>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Total Plans</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{lessonPlans.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Approved</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{lessonPlans.filter(p => p.status === 'Approved').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider truncate">Pending Review</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{lessonPlans.filter(p => p.status === 'Pending Review').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider truncate">Needs Revision</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{lessonPlans.filter(p => p.status === 'Needs Revision').length}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input type="text" placeholder="Search title, teacher, or class stream..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white" />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none">
            <option value="All">All Subjects</option>
            {availableSubjectsFilter.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none">
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Needs Revision">Needs Revision</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-5 pr-3 w-[25%]">Lesson Title / ID</th>
                <th className="py-4 px-4 w-[15%]">Subject & Stream</th>
                <th className="py-4 px-4 w-[15%]">Teacher</th>
                <th className="py-4 px-4 w-[12%]">Date</th>
                <th className="py-4 px-4 w-[13%]">Status</th>
                <th className="py-4 pl-3 pr-5 text-right w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading plans...</td></tr>
              ) : filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/40 transition-colors text-xs">
                    <td className="py-4 pl-5 pr-3">
                      <div className="font-semibold text-slate-900 truncate max-w-[280px]">{plan.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{plan.id}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-700">{plan.subject}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{plan.gradeStream}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 font-medium text-slate-700">
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200/80">
                          {getInitials(plan.teacherName)}
                        </div>
                        <span className="truncate max-w-[120px]">{plan.teacherName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono">{plan.submissionDate}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold ${getStatusBadge(plan.status)}`}>{plan.status}</span>
                    </td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 transition-opacity">
                        <button onClick={() => openEditModal(plan)} className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-[#006FBF] hover:bg-[#006FBF]/10 flex items-center justify-center border border-slate-200/60 transition-colors" title="Edit Plan">
                          <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                        </button>
                        <button onClick={() => openDeletePrompt(plan)} className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200/60 transition-colors" title="Delete Plan">
                          <i className="fa-solid fa-trash-can text-[10px]"></i>
                        </button>
                        <button onClick={() => openViewModal(plan)} className="rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60 shadow-sm ml-1">
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-xs">No matching lesson plans found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</div>
        ) : filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <div key={plan.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
              <div className="flex justify-between items-start gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]"><i className="fa-solid fa-file-lines text-sm" /></span>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-900 block truncate text-sm">{plan.title}</span>
                    <span className="inline-flex items-center mt-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700 border border-slate-200">{plan.id}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-solid fa-book text-slate-400 w-5 text-center flex-shrink-0" />
                  <span className="truncate flex-1 font-medium text-slate-700">{plan.subject} <span className="text-slate-400">({plan.gradeStream})</span></span>
                </div>
                <div className="flex items-center gap-2 min-w-0 mt-1">
                  <i className="fa-solid fa-user-tie text-slate-400 w-5 text-center flex-shrink-0" />
                  <span className="truncate flex-1 text-slate-600">{plan.teacherName}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                  <span className="font-mono text-[10px] text-slate-400">{plan.submissionDate}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(plan.status)}`}>{plan.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => openEditModal(plan)} className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/60">
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button onClick={() => openViewModal(plan)} className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60">
                  <i className="fa-solid fa-eye"></i> View
                </button>
                <button onClick={() => openDeletePrompt(plan)} className="flex justify-center items-center gap-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-100">
                  <i className="fa-solid fa-trash-can"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm">No plans found.</div>
        )}
      </div>

      {/* CREATE / EDIT LESSON PLAN MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{isEditing ? 'Edit Lesson Plan' : 'New Lesson Plan'}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{isEditing ? 'Update the curriculum objectives and details.' : 'Submit curriculum plans for review.'}</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"><i className="fa-solid fa-xmark text-sm"></i></button>
            </div>

            <form onSubmit={handleSavePlan}>
              <div className="p-6 space-y-4 text-xs max-h-[60vh] overflow-y-auto">
                {formError && <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium mb-3"><i className="fa-solid fa-triangle-exclamation mr-2"></i>{formError}</div>}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lesson Title *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teacher *</label>
                  <select required value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors">
                    <option value="">Select instructor...</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName || `${t.firstName} ${t.lastName}`}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                    <select required value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors">
                      <option value="">Select subject...</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Class / Stream *</label>
                    <select required value={formData.streamId} onChange={(e) => setFormData({ ...formData, streamId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors">
                      <option value="">Select class...</option>
                      {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Curriculum Objectives & Notes *</label>
                  <textarea rows={5} required value={formData.objectives} onChange={(e) => setFormData({ ...formData, objectives: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" placeholder="Outline core objectives, materials, and steps..."></textarea>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-end gap-3">
                <button type="button" onClick={() => setCreateModalOpen(false)} disabled={isSubmitting} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-50" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>{isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Submit Plan')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewDetailsModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex-shrink-0">
              <div>
                <h3 className="font-bold text-slate-900 text-lg pr-4">{selectedPlan.title}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadge(selectedPlan.status)}`}>{selectedPlan.status}</span>
                  <span className="text-[11px] font-mono text-slate-400">{selectedPlan.id}</span>
                </div>
              </div>
              <button onClick={() => setViewDetailsModalOpen(false)} className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50 flex-shrink-0"><i className="fa-solid fa-xmark text-sm"></i></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-sm space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <div><p className="text-slate-500 font-medium mb-1">Subject</p><p className="font-bold text-slate-800">{selectedPlan.subject}</p></div>
                <div><p className="text-slate-500 font-medium mb-1">Class/Stream</p><p className="font-bold text-slate-800">{selectedPlan.gradeStream}</p></div>
                <div><p className="text-slate-500 font-medium mb-1">Teacher</p><p className="font-bold text-slate-800">{selectedPlan.teacherName}</p></div>
                <div><p className="text-slate-500 font-medium mb-1">Submitted</p><p className="font-bold text-slate-800 font-mono">{selectedPlan.submissionDate}</p></div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Curriculum Objectives & Notes</h4>
                <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-700 whitespace-pre-wrap leading-relaxed shadow-sm min-h-[200px]">
                  {selectedPlan.objectives || 'No detailed objectives were provided for this lesson plan.'}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-between items-center flex-shrink-0">
              <button onClick={() => { setViewDetailsModalOpen(false); openEditModal(selectedPlan); }} className="text-xs font-semibold text-[#006FBF] hover:underline"><i className="fa-solid fa-pen-to-square mr-1"></i> Edit Plan</button>
              <div className="flex gap-3">
                <button onClick={() => updateStatus(selectedPlan.id, 'Needs Revision')} className="rounded-xl bg-white border border-rose-200 text-rose-600 px-4 py-2 text-xs font-semibold hover:bg-rose-50 transition-colors">Request Revision</button>
                <button onClick={() => updateStatus(selectedPlan.id, 'Approved')} className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"><i className="fa-solid fa-check mr-1.5"></i>Approve Plan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <i className="fa-solid fa-triangle-exclamation text-xl text-rose-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Lesson Plan</h3>
              <p className="mt-1.5 text-xs text-slate-500">Are you sure you want to permanently delete "<span className="font-semibold text-slate-700">{selectedPlan.title}</span>"? This action cannot be undone.</p>
            </div>
            {formError && <div className="text-xs text-rose-600 font-medium">{formError}</div>}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button type="button" onClick={() => setDeleteModalOpen(false)} disabled={isSubmitting} className="w-full sm:w-auto rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
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