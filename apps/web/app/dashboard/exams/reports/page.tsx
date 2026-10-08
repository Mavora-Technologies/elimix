// apps/web/app/dashboard/academics/exams/reports/page.tsx
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

interface ExamReport {
  id: string;
  title: string;
  term: string;
  gradeLevel: string;
  totalStudents: number;
  averageGpa: number;
  passRate: number;
  status: 'Published' | 'Pending Approval' | 'Draft';
  generatedDate: string;
}

export default function ExamReportsPage() {
  const [reports, setReports] = useState<ExamReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [termFilter, setTermFilter] = useState('All');
  
  const [isLoading, setIsLoading] = useState(true);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ExamReport | null>(null);

  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    term: 'Term 3',
    gradeLevel: 'All Grades',
    status: 'Draft',
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

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/v1/academics/exam-reports', { headers: getHeaders() });
      if (res.ok) {
        const result = await res.json();
        setReports(result.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const url = isEditing 
        ? `http://localhost:3001/api/v1/academics/exam-reports/${selectedReport?.id}` 
        : 'http://localhost:3001/api/v1/academics/exam-reports';
        
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Generation failed');

      await fetchReports();
      setSuccessBanner(isEditing ? 'Report metadata updated.' : 'New examination analytics report generated.');
      setGenerateModalOpen(false);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedReport) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/academics/exam-reports/${selectedReport.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete report');
      
      await fetchReports();
      setIsDeleteModalOpen(false);
      setSuccessBanner('Exam report securely deleted.');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedReport(null);
    setFormError(null);
    setFormData({ title: '', term: 'Term 3', gradeLevel: 'All Grades', status: 'Draft' });
    setGenerateModalOpen(true);
  };

  const openEditModal = (rep: ExamReport) => {
    setIsEditing(true);
    setSelectedReport(rep);
    setFormError(null);
    setFormData({ title: rep.title, term: rep.term, gradeLevel: rep.gradeLevel, status: rep.status });
    setGenerateModalOpen(true);
  };

  const openDeletePrompt = (rep: ExamReport) => {
    setSelectedReport(rep);
    setFormError(null);
    setIsDeleteModalOpen(true);
  };

  const filteredReports = reports.filter((rep) => {
    const matchesSearch = rep.title.toLowerCase().includes(searchQuery.toLowerCase()) || rep.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || rep.status === statusFilter;
    const matchesTerm = termFilter === 'All' || rep.term === termFilter;
    return matchesSearch && matchesStatus && matchesTerm;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'Pending Approval': return 'bg-amber-50/80 text-amber-700 ring-1 ring-inset ring-amber-600/20';
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
            <Link href="/dashboard/academics/exams" className="hover:text-[#006FBF] transition-colors">Exams</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">Reports</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Examination Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Generate and review academic report cards and GPA summaries.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/exams" className="hidden sm:flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <i className="fa-solid fa-file-lines text-[#006FBF]"></i><span>All Exams</span>
          </Link>
          <button onClick={openCreateModal} className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-plus text-[10px]"></i><span>Generate Report</span>
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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Total Reports</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{reports.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Campus Avg GPA</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {reports.length > 0 ? (reports.reduce((acc, curr) => acc + curr.averageGpa, 0) / reports.length).toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider truncate">Overall Pass Rate</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {reports.length > 0 ? (reports.reduce((acc, curr) => acc + curr.passRate, 0) / reports.length).toFixed(1) : '0.0'}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider truncate">Pending Approval</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{reports.filter(r => r.status === 'Pending Approval').length}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input type="text" placeholder="Search report title or grade level..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 sm:py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white" />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white">
            <option value="All">All Terms</option>
            <option value="Term 3">Term 3</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 1">Term 1</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white">
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Pending Approval">Pending Approval</option>
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
                <th className="py-4 pl-5 pr-3 w-[30%]">Report Title / ID</th>
                <th className="py-4 px-4 w-[15%]">Term & Grade</th>
                <th className="py-4 px-4 w-[15%]">Avg GPA & Pass Rate</th>
                <th className="py-4 px-4 w-[15%]">Generated Date</th>
                <th className="py-4 px-4 w-[10%]">Status</th>
                <th className="py-4 pl-3 pr-5 text-right w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading reports...</td></tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/40 transition-colors text-xs group">
                    <td className="py-4 pl-5 pr-3">
                      <div className="font-semibold text-slate-900 truncate max-w-[300px]">{rep.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{rep.id}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-700">{rep.term}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{rep.gradeLevel}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-800 font-semibold">{rep.averageGpa.toFixed(2)}</span>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <span className="font-mono text-emerald-600 font-bold">{rep.passRate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono">{rep.generatedDate}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold ${getStatusBadge(rep.status)}`}>{rep.status}</span>
                    </td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 transition-opacity">
                        <button onClick={() => openEditModal(rep)} className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-[#006FBF] hover:bg-[#006FBF]/10 flex items-center justify-center border border-slate-200/60 transition-colors" title="Edit Metadata">
                          <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                        </button>
                        <button onClick={() => openDeletePrompt(rep)} className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200/60 transition-colors" title="Delete Report">
                          <i className="fa-solid fa-trash-can text-[10px]"></i>
                        </button>
                        <button className="rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60 shadow-sm ml-1 flex items-center gap-1.5">
                          <i className="fa-regular fa-file-pdf"></i> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-xs">No matching reports found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</div>
        ) : filteredReports.length > 0 ? (
          filteredReports.map((rep) => (
            <div key={rep.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
              <div className="flex justify-between items-start gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]"><i className="fa-solid fa-chart-pie text-sm" /></span>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-900 block truncate text-sm">{rep.title}</span>
                    <span className="inline-flex items-center mt-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700 border border-slate-200">{rep.id}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-regular fa-calendar-days text-slate-400 w-5 text-center flex-shrink-0" />
                  <span className="truncate flex-1 font-medium text-slate-700">{rep.term} <span className="text-slate-400">({rep.gradeLevel})</span></span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                  <span className="font-mono text-[10px] text-slate-800 font-semibold">GPA: {rep.averageGpa.toFixed(2)} | Pass: {rep.passRate.toFixed(1)}%</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(rep.status)}`}>{rep.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => openEditModal(rep)} className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/60">
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60">
                  <i className="fa-regular fa-file-pdf"></i> PDF
                </button>
                <button onClick={() => openDeletePrompt(rep)} className="flex justify-center items-center gap-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-100">
                  <i className="fa-solid fa-trash-can"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm">No reports found.</div>
        )}
      </div>

      {/* GENERATE / EDIT REPORT MODAL */}
      {generateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{isEditing ? 'Edit Report Metadata' : 'Generate New Analytics Report'}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{isEditing ? 'Update the details for this report.' : 'Compile grades into a comprehensive document.'}</p>
              </div>
              <button onClick={() => setGenerateModalOpen(false)} className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"><i className="fa-solid fa-xmark text-sm"></i></button>
            </div>

            <form onSubmit={handleGenerateReport}>
              <div className="p-6 space-y-4 text-xs max-h-[60vh] overflow-y-auto">
                {formError && <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium mb-3"><i className="fa-solid fa-triangle-exclamation mr-2"></i>{formError}</div>}
                
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Report Title *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" placeholder="e.g. Term 3 Comprehensive Grade Summary" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Academic Term *</label>
                    <select required value={formData.term} onChange={(e) => setFormData({ ...formData, term: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors">
                      <option value="Term 3">Term 3</option>
                      <option value="Term 2">Term 2</option>
                      <option value="Term 1">Term 1</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Grade Level / Stream *</label>
                    <select required value={formData.gradeLevel} onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors">
                      <option value="All Grades">All Grades</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors">
                    <option value="Published">Published</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                {!isEditing && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2 mt-2">Data Inclusions</label>
                    <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#006FBF] focus:ring-[#006FBF]" />
                        <span className="font-medium text-slate-700">GPA & Cumulative Score Distribution</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#006FBF] focus:ring-[#006FBF]" />
                        <span className="font-medium text-slate-700">Subject-wise Performance Breakdown</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-end gap-3">
                <button type="button" onClick={() => setGenerateModalOpen(false)} disabled={isSubmitting} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition-colors" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>{isSubmitting ? 'Processing...' : (isEditing ? 'Save Changes' : 'Generate Document')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <i className="fa-solid fa-triangle-exclamation text-xl text-rose-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Report</h3>
              <p className="mt-1.5 text-xs text-slate-500">Are you sure you want to permanently delete this report data? This action cannot be undone.</p>
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