// apps/web/app/dashboard/academics/exams/results/page.tsx
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  examTitle: string;
  subject: string;
  gradeStream: string;
  marksObtained: number;
  totalMarks: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'Passed' | 'Failed' | 'Pending Review';
}

export default function ExamResultsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [dbExams, setDbExams] = useState<any[]>([]);
  const [dbSubjects, setDbSubjects] = useState<any[]>([]);
  const [dbStreams, setDbStreams] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '',
    examId: '',
    subjectId: '',
    streamId: '',
    marksObtained: 0,
    totalMarks: 100,
    grade: 'A' as 'A+' | 'A' | 'B' | 'C' | 'D' | 'F',
    status: 'Passed' as 'Passed' | 'Failed' | 'Pending Review',
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
      const [resRes, stuRes, examRes, subRes, streamRes] = await Promise.all([
        fetch(`${API_BASE_URL}/academics/exam-results`, { headers }),
        fetch(`${API_BASE_URL}/students`, { headers }),
        fetch(`${API_BASE_URL}/academics/exams`, { headers }),
        fetch(`${API_BASE_URL}/academics/subjects`, { headers }),
        fetch(`${API_BASE_URL}/academics/timetables/streams`, { headers })
      ]);

      if (resRes.ok) setResults((await resRes.json()).data || []);
      if (stuRes.ok) setDbStudents((await stuRes.json()).data || []);
      if (examRes.ok) setDbExams((await examRes.json()).data || []);
      if (subRes.ok) setDbSubjects((await subRes.json()).data || []);
      if (streamRes.ok) setDbStreams((await streamRes.json()).data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPageData(); }, []);

  // --- KNEC / CBC AUTO-GRADING ENGINE ---
  const handleMarksChange = (obtained: number, total: number) => {
    const pct = total > 0 ? (obtained / total) * 100 : 0;
    let computedGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    let computedStatus: 'Passed' | 'Failed' = 'Passed';

    if (pct >= 80) computedGrade = 'A+';
    else if (pct >= 75) computedGrade = 'A';
    else if (pct >= 65) computedGrade = 'B';
    else if (pct >= 50) computedGrade = 'C';
    else if (pct >= 40) computedGrade = 'D';
    else {
      computedGrade = 'F';
      computedStatus = 'Failed';
    }

    setFormData(prev => ({
      ...prev,
      marksObtained: obtained,
      totalMarks: total,
      grade: computedGrade,
      status: computedStatus,
    }));
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const url = isEditing 
        ? `${API_BASE_URL}/academics/exam-results/${selectedResult?.id}` 
        : `${API_BASE_URL}/academics/exam-results`;
        
      const payload = {
        ...formData,
        marksObtained: Number(formData.marksObtained),
        totalMarks: Number(formData.totalMarks),
      };

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Submission failed');

      await fetchPageData();
      setSuccessBanner(isEditing ? 'Exam result updated successfully.' : 'New examination result auto-graded and recorded.');
      setIsModalOpen(false);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedResult) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/academics/exam-results/${selectedResult.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete record');
      
      await fetchPageData();
      setIsDeleteModalOpen(false);
      setSuccessBanner('Exam result permanently deleted.');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UI TRIGGERS ---
  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedResult(null);
    setFormError(null);
    setFormData({ studentId: '', examId: '', subjectId: '', streamId: '', marksObtained: 75, totalMarks: 100, grade: 'A', status: 'Passed' });
    setIsModalOpen(true);
  };

  const openEditModal = (rec: ExamResult) => {
    setIsEditing(true);
    setSelectedResult(rec);
    setFormError(null);
    
    const stu = dbStudents.find(s => s.admissionNumber === rec.studentId);
    const exm = dbExams.find(e => e.title === rec.examTitle);
    const sub = dbSubjects.find(s => s.name === rec.subject);
    const strm = dbStreams.find(s => s.name === rec.gradeStream);

    setFormData({ 
      studentId: stu ? stu.id : '',
      examId: exm ? exm.id : '',
      subjectId: sub ? sub.id : '',
      streamId: strm ? strm.id : '',
      marksObtained: rec.marksObtained,
      totalMarks: rec.totalMarks,
      grade: rec.grade,
      status: rec.status,
    });
    setIsModalOpen(true);
  };

  const openDeletePrompt = (rec: ExamResult) => {
    setSelectedResult(rec);
    setFormError(null);
    setIsDeleteModalOpen(true);
  };

  const filteredResults = results.filter((res) => {
    const matchesSearch = res.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || res.studentId.toLowerCase().includes(searchQuery.toLowerCase()) || res.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) || res.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || res.status === statusFilter;
    const matchesGrade = gradeFilter === 'All' || res.grade === gradeFilter;
    return matchesSearch && matchesStatus && matchesGrade;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'Failed': return 'bg-rose-50/80 text-rose-700 ring-1 ring-inset ring-rose-600/20';
      case 'Pending Review': return 'bg-amber-50/80 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      default: return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
    }
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'B': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'C': case 'D': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'F': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ST';

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
            <span className="text-slate-900 truncate">Results</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Examination Results & Auto-Grading</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">KNEC & CBC compliant automated grading, score entry, and pass/fail distribution.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/exams" className="hidden sm:flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <i className="fa-solid fa-file-lines text-[#006FBF]"></i><span>All Exams</span>
          </Link>
          <button onClick={openCreateModal} className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-plus text-[10px]"></i><span>Record Score</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-800 shadow-sm">
          <i className="fa-solid fa-check text-[10px] bg-emerald-100/80 text-emerald-600 p-1.5 rounded-lg" />
          <p className="flex-1">{successBanner}</p>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Results Recorded</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{results.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Pass Rate</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {results.length > 0 ? Math.round((results.filter(r => r.status === 'Passed').length / results.length) * 100) : 0}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider truncate">Average Score</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {results.length > 0 ? Math.round(results.reduce((acc, curr) => acc + (curr.marksObtained / curr.totalMarks * 100), 0) / results.length) : 0}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider truncate">Pending Review</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{results.filter(r => r.status === 'Pending Review').length}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input type="text" placeholder="Search student name, ID, or subject..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-800 outline-none" />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none">
            <option value="All">All Grades</option>
            <option value="A+">A+</option><option value="A">A</option>
            <option value="B">B</option><option value="C">C</option>
            <option value="D">D</option><option value="F">F</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none">
            <option value="All">All Statuses</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
            <option value="Pending Review">Pending</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-5 pr-3 w-[20%]">Student Name / ID</th>
                <th className="py-4 px-4 w-[25%]">Exam & Subject</th>
                <th className="py-4 px-4 w-[15%]">Stream</th>
                <th className="py-4 px-4 w-[10%]">Score</th>
                <th className="py-4 px-4 w-[15%]">Grade & Status</th>
                <th className="py-4 pl-3 pr-5 text-right w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading results...</td></tr>
              ) : filteredResults.length > 0 ? (
                filteredResults.map((res) => {
                  const percentage = Math.round((res.marksObtained / res.totalMarks) * 100);
                  return (
                    <tr key={res.id} className="hover:bg-slate-50/40 transition-colors text-xs group">
                      <td className="py-4 pl-5 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200/80 flex-shrink-0">
                            {getInitials(res.studentName)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 truncate max-w-[150px]">{res.studentName}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{res.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-700 truncate max-w-[200px]">{res.examTitle}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{res.subject}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">{res.gradeStream}</td>
                      <td className="py-4 px-4">
                        <div className="text-slate-900 font-mono font-medium">{res.marksObtained} <span className="text-slate-400">/ {res.totalMarks}</span></div>
                        <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{percentage}%</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold border ${getGradeBadge(res.grade)}`}>{res.grade}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(res.status)}`}>{res.status}</span>
                        </div>
                      </td>
                      <td className="py-4 pl-3 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEditModal(res)} className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-[#006FBF] hover:bg-[#006FBF]/10 flex items-center justify-center border border-slate-200/60 transition-colors" title="Edit Result">
                            <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                          </button>
                          <button onClick={() => openDeletePrompt(res)} className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200/60 transition-colors" title="Delete Result">
                            <i className="fa-solid fa-trash-can text-[10px]"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-xs">No matching results found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD / EDIT SCORE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{isEditing ? 'Edit Exam Result' : 'Record & Auto-Grade Score'}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">KNEC / CBC grades are computed automatically from marks entered.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"><i className="fa-solid fa-xmark text-sm"></i></button>
            </div>

            <form onSubmit={handleSaveResult}>
              <div className="p-6 space-y-4 text-xs max-h-[60vh] overflow-y-auto">
                {formError && <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium mb-3"><i className="fa-solid fa-triangle-exclamation mr-2"></i>{formError}</div>}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Student *</label>
                    <select required value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none">
                      <option value="">Select student...</option>
                      {dbStudents.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Grade Stream *</label>
                    <select required value={formData.streamId} onChange={(e) => setFormData({ ...formData, streamId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none">
                      <option value="">Select class...</option>
                      {dbStreams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Exam / Assessment *</label>
                    <select required value={formData.examId} onChange={(e) => setFormData({ ...formData, examId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none">
                      <option value="">Select exam...</option>
                      {dbExams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                    <select required value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none">
                      <option value="">Select subject...</option>
                      {dbSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-sky-50/50 p-4 rounded-xl border border-sky-100">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Marks Obtained *</label>
                    <input type="number" required min="0" step="0.5" value={formData.marksObtained} onChange={(e) => handleMarksChange(Number(e.target.value), formData.totalMarks)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono font-bold text-slate-900" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Marks *</label>
                    <input type="number" required min="1" step="0.5" value={formData.totalMarks} onChange={(e) => handleMarksChange(formData.marksObtained, Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono font-bold text-slate-900" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                  <div>
                    <label className="block font-semibold text-emerald-900 mb-1">Auto-Graded Letter</label>
                    <input type="text" disabled value={formData.grade} className="w-full rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 font-extrabold text-emerald-900 text-center text-sm" />
                  </div>
                  <div>
                    <label className="block font-semibold text-emerald-900 mb-1">Auto-Graded Status</label>
                    <input type="text" disabled value={formData.status} className="w-full rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 font-extrabold text-emerald-900 text-center text-sm" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-50" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>{isSubmitting ? 'Saving...' : 'Save & Auto-Grade'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <i className="fa-solid fa-triangle-exclamation text-xl text-rose-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Result</h3>
              <p className="mt-1.5 text-xs text-slate-500">Are you sure you want to permanently delete this exam result?</p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700">Cancel</button>
              <button type="button" onClick={handleDelete} className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}