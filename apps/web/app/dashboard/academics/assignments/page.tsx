// apps/web/app/dashboard/academics/assignments/page.tsx
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

interface Assignment {
  id: string;
  title: string;
  subject: string;
  subjectId?: string;
  gradeStream: string;
  streamId?: string;
  teacherName: string;
  teacherId?: string;
  instructions?: string;
  dueDate: string;
  submissionProgress: string;
  status: 'Active' | 'Grading' | 'Closed' | 'Draft';
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAsn, setSelectedAsn] = useState<Assignment | null>(null);

  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    teacherId: '',
    streamId: '',
    dueDate: '',
    instructions: '',
    status: 'Active',
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

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const headers = getHeaders();
      const [asnRes, subRes, teachRes, streamsRes] = await Promise.all([
        fetch('http://localhost:3001/api/v1/academics/assignments', { headers }),
        fetch('http://localhost:3001/api/v1/academics/subjects', { headers }),
        fetch('http://localhost:3001/api/v1/teachers', { headers }),
        fetch('http://localhost:3001/api/v1/academics/timetables/streams', { headers })
      ]);

      if (asnRes.ok) setAssignments((await asnRes.json()).data || []);
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
  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const url = isEditing 
        ? `http://localhost:3001/api/v1/academics/assignments/${selectedAsn?.id}` 
        : 'http://localhost:3001/api/v1/academics/assignments';
        
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Submission failed');

      await fetchPageData();
      setSuccessBanner(isEditing ? 'Assignment updated successfully.' : 'New assignment successfully published.');
      setIsModalOpen(false);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAsn) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/academics/assignments/${selectedAsn.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete assignment');
      
      await fetchPageData();
      setIsDeleteModalOpen(false);
      setSuccessBanner('Assignment deleted.');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`http://localhost:3001/api/v1/academics/assignments/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      await fetchPageData();
    } catch (e) {}
  };

  // --- UI TRIGGERS ---
  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedAsn(null);
    setFormError(null);
    setFormData({ title: '', subjectId: '', teacherId: '', streamId: '', dueDate: '', instructions: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const openEditModal = (asn: Assignment) => {
    setIsEditing(true);
    setSelectedAsn(asn);
    setFormError(null);
    
    const subj = subjects.find(s => s.name === asn.subject);
    const stream = streams.find(s => s.name === asn.gradeStream);
    const teach = teachers.find(t => `${t.firstName} ${t.lastName}`.trim() === asn.teacherName);

    setFormData({ 
      title: asn.title, 
      subjectId: subj ? subj.id : '', 
      teacherId: teach ? teach.id : '', 
      streamId: stream ? stream.id : '', 
      dueDate: asn.dueDate.replace(' ', 'T'), // Format for datetime-local input
      instructions: asn.instructions || '', 
      status: asn.status 
    });
    setIsModalOpen(true);
  };

  const openDeletePrompt = (asn: Assignment) => {
    setSelectedAsn(asn);
    setFormError(null);
    setIsDeleteModalOpen(true);
  };

  const filteredAssignments = assignments.filter((asn) => {
    const matchesSearch = asn.title.toLowerCase().includes(searchQuery.toLowerCase()) || asn.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) || asn.gradeStream.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || asn.status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || asn.subject === subjectFilter;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'Grading': return 'bg-[#006FBF]/10 text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20';
      case 'Closed': return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
      case 'Draft': return 'bg-amber-50/80 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      default: return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
    }
  };

  const availableSubjectsFilter = Array.from(new Set(assignments.map(p => p.subject)));
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
            <span className="text-slate-900 truncate">Assignments</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Assignments & Homework</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Monitor student submissions, grading progress, and due dates.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={openCreateModal} className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-plus text-[10px]"></i><span>New Assignment</span>
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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Active Assignments</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{assignments.filter(a => a.status === 'Active').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-[#006FBF] uppercase tracking-wider truncate">Pending Grading</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{assignments.filter(a => a.status === 'Grading').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Total Records</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{assignments.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider truncate">Drafts</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{assignments.filter(a => a.status === 'Draft').length}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input type="text" placeholder="Search title, teacher, or class stream..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 sm:py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white" />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white">
            <option value="All">All Subjects</option>
            {availableSubjectsFilter.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white">
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Grading">Grading</option>
            <option value="Closed">Closed</option>
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
                <th className="py-4 pl-5 pr-3 w-[25%]">Assignment Title / ID</th>
                <th className="py-4 px-4 w-[15%]">Subject & Stream</th>
                <th className="py-4 px-4 w-[15%]">Teacher</th>
                <th className="py-4 px-4 w-[15%]">Due Date</th>
                <th className="py-4 px-4 w-[10%]">Submissions</th>
                <th className="py-4 pl-3 pr-5 text-right w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading assignments...</td></tr>
              ) : filteredAssignments.length > 0 ? (
                filteredAssignments.map((asn) => (
                  <tr key={asn.id} className="hover:bg-slate-50/40 transition-colors text-xs group">
                    <td className="py-4 pl-5 pr-3">
                      <div className="font-semibold text-slate-900 truncate max-w-[280px]">{asn.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{asn.id}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-700">{asn.subject}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{asn.gradeStream}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 font-medium text-slate-700">
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200/80">
                          {getInitials(asn.teacherName)}
                        </div>
                        <span className="truncate max-w-[120px]">{asn.teacherName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono">{asn.dueDate}</td>
                    <td className="py-4 px-4 text-slate-800 font-semibold font-mono">
                      {asn.submissionProgress}
                    </td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 transition-opacity">
                        <span className={`mr-2 inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(asn.status)}`}>{asn.status}</span>
                        <button onClick={() => openEditModal(asn)} className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-[#006FBF] hover:bg-[#006FBF]/10 flex items-center justify-center border border-slate-200/60 transition-colors" title="Edit Assignment">
                          <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                        </button>
                        <button onClick={() => openDeletePrompt(asn)} className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200/60 transition-colors" title="Delete Assignment">
                          <i className="fa-solid fa-trash-can text-[10px]"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-xs">No matching assignments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</div>
        ) : filteredAssignments.length > 0 ? (
          filteredAssignments.map((asn) => (
            <div key={asn.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
              <div className="flex justify-between items-start gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]"><i className="fa-solid fa-file-pen text-sm" /></span>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-900 block truncate text-sm">{asn.title}</span>
                    <span className="inline-flex items-center mt-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700 border border-slate-200">{asn.id}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-solid fa-book text-slate-400 w-5 text-center flex-shrink-0" />
                  <span className="truncate flex-1 font-medium text-slate-700">{asn.subject} <span className="text-slate-400">({asn.gradeStream})</span></span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                  <span className="font-mono text-[10px] text-rose-500 font-semibold"><i className="fa-regular fa-clock mr-1"></i>{asn.dueDate}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(asn.status)}`}>{asn.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => openEditModal(asn)} className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/60">
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button onClick={() => openDeletePrompt(asn)} className="flex justify-center items-center gap-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-100">
                  <i className="fa-solid fa-trash-can"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm">No assignments found.</div>
        )}
      </div>

      {/* CREATE / EDIT ASSIGNMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{isEditing ? 'Edit Assignment' : 'New Assignment'}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{isEditing ? 'Update assignment details.' : 'Publish coursework and set deadlines.'}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"><i className="fa-solid fa-xmark text-sm"></i></button>
            </div>

            <form onSubmit={handleSaveAssignment}>
              <div className="p-6 space-y-4 text-xs max-h-[60vh] overflow-y-auto">
                {formError && <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium mb-3"><i className="fa-solid fa-triangle-exclamation mr-2"></i>{formError}</div>}
                
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Assignment Title *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned By (Teacher) *</label>
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
                    <label className="block font-semibold text-slate-700 mb-1">Grade Stream *</label>
                    <select required value={formData.streamId} onChange={(e) => setFormData({ ...formData, streamId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors">
                      <option value="">Select class...</option>
                      {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Due Date & Time *</label>
                    <input type="datetime-local" required value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors">
                      <option value="Active">Active</option>
                      <option value="Grading">Grading</option>
                      <option value="Closed">Closed</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Instructions & Guidelines *</label>
                  <textarea rows={4} required value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" placeholder="Outline instructions..."></textarea>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition-colors" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>{isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Publish Assignment')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedAsn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <i className="fa-solid fa-triangle-exclamation text-xl text-rose-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Assignment</h3>
              <p className="mt-1.5 text-xs text-slate-500">Are you sure you want to permanently delete "<span className="font-semibold text-slate-700">{selectedAsn.title}</span>"? This action cannot be undone.</p>
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