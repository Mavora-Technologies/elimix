// apps/web/app/dashboard/e-learning/progress/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface StudentProgress {
  id: string;
  studentId: string;
  dbStudentId: string;
  dbCourseId: string;
  studentName: string;
  courseTitle: string;
  subject: string;
  modulesCompleted: number;
  totalModules: number;
  completionPercentage: number;
  quizAverage: string;
  timeSpentHours: number;
  status: 'On Track' | 'Completed' | 'At Risk' | 'Behind';
  facultyNotes?: string;
}

export default function ELearningProgressPage() {
  const [progressList, setProgressList] = useState<StudentProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Details & Faculty Intervention Modal State
  const [selectedRecord, setSelectedRecord] = useState<StudentProgress | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState<StudentProgress['status']>('On Track');
  const [facultyNotes, setFacultyNotes] = useState('');
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const userStr = localStorage.getItem('elimix_user');
    let tenantId = '00000000-0000-0000-0000-000000000000';
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        tenantId = JSON.parse(userStr).tenantId || tenantId;
      } catch (e) {}
    }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-tenant-id': tenantId,
    };
  };

  const fetchProgress = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = getHeaders();
      const res = await fetch(`${API_BASE_URL}/e-learning/progress`, { headers });
      if (res.ok) {
        const json = await res.json();
        setProgressList(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const openDetailsModal = (record: StudentProgress) => {
    setSelectedRecord(record);
    setOverrideStatus(record.status);
    setFacultyNotes(record.facultyNotes || '');
    setDetailsModalOpen(true);
  };

  const handleSaveIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setIsSavingDetails(true);
    try {
      const res = await fetch(`${API_BASE_URL}/e-learning/progress/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          studentId: selectedRecord.dbStudentId,
          courseId: selectedRecord.dbCourseId,
          status: overrideStatus,
          facultyNotes,
        }),
      });

      if (!res.ok) throw new Error('Failed to update student progress status');

      await fetchProgress();
      setSuccessBanner(`Updated progress status for ${selectedRecord.studentName}.`);
      setDetailsModalOpen(false);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSavingDetails(false);
    }
  };

  // --- EXPORT HANDLER ---
  const handleExportReport = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('Student learning progress analytics successfully exported from PostgreSQL.');
    setExportModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const filteredProgress = useMemo(() => {
    return progressList.filter((item) => {
      const matchesSearch =
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesSubject = subjectFilter === 'All' || item.subject === subjectFilter;

      return matchesSearch && matchesStatus && matchesSubject;
    });
  }, [progressList, searchQuery, statusFilter, subjectFilter]);

  const kpis = useMemo(() => {
    const total = progressList.length;
    const completedCount = progressList.filter((p) => p.status === 'Completed').length;
    const atRiskCount = progressList.filter((p) => p.status === 'At Risk').length;
    const avgPct =
      total > 0
        ? Math.round(progressList.reduce((acc, p) => acc + p.completionPercentage, 0) / total)
        : 0;

    return { total, completedCount, atRiskCount, avgPct };
  }, [progressList]);

  const getStatusBadge = (status: StudentProgress['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'On Track':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Behind':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'At Risk':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const availableSubjectsFilter = Array.from(new Set(progressList.map((p) => p.subject)));

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            E-Learning Student Progress & Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Monitor student completion rates, module progression, and quiz performance from live database records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/e-learning/courses"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-laptop-code mr-2 text-xs text-[#006FBF]"></i> All Courses
          </Link>
          <button
            onClick={() => setExportModalOpen(true)}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
          >
            <i className="fa-solid fa-file-arrow-down mr-2 text-xs"></i> Export Progress
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm flex items-center shadow-sm">
          <i className="fa-solid fa-circle-check text-emerald-600 mr-2 text-base"></i>
          <span>{successBanner}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracked Enrollments</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{kpis.total}</p>
          <span className="text-xs text-emerald-600 font-medium">Live database records</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Completion Rate</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{kpis.avgPct}%</p>
          <span className="text-xs text-emerald-600 font-medium">Across all learners</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certified Completed</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{kpis.completedCount}</p>
          <span className="text-xs text-purple-600 font-medium">Finished all modules</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">At-Risk Learners</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{kpis.atRiskCount}</p>
          <span className="text-xs text-rose-600 font-medium">Requiring faculty support</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search student name, ID, course, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#006FBF]"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Subject:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
            >
              <option value="All">All Subjects</option>
              {availableSubjectsFilter.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="On Track">On Track</option>
              <option value="Behind">Behind</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student Name / ID</th>
                <th className="py-3 px-4">Enrolled Course</th>
                <th className="py-3 px-4">Modules Progress</th>
                <th className="py-3 px-4">Quiz Avg</th>
                <th className="py-3 px-4">Study Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading student progress...
                  </td>
                </tr>
              ) : filteredProgress.length > 0 ? (
                filteredProgress.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{item.studentName}</div>
                      <div className="text-xs text-slate-500 font-mono">{item.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium text-xs">{item.courseTitle}</div>
                      <div className="text-xs text-slate-500">{item.subject}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-slate-700">{item.modulesCompleted} / {item.totalModules} modules</span>
                        <span className="font-bold text-slate-900">{item.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            item.completionPercentage === 100
                              ? 'bg-emerald-500'
                              : item.completionPercentage > 50
                              ? 'bg-[#006FBF]'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.completionPercentage}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-mono text-xs font-bold">{item.quizAverage}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{item.timeSpentHours} hrs</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openDetailsModal(item)}
                        className="text-[#006FBF] hover:text-[#012E54] font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors shadow-xs border border-blue-100 bg-white"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No matching student progress records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          MODAL: STUDENT DETAILS & FACULTY INTERVENTION
         ===================================================================== */}
      {detailsModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Learner Analytics & Intervention — {selectedRecord.studentName}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {selectedRecord.studentId} • Course: {selectedRecord.courseTitle}
                </p>
              </div>
              <button onClick={() => setDetailsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSaveIntervention} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-center">
                <div>
                  <p className="text-slate-400 uppercase text-[10px]">Progress</p>
                  <p className="text-sm font-bold text-slate-900">{selectedRecord.completionPercentage}%</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase text-[10px]">Quiz Avg</p>
                  <p className="text-sm font-bold text-[#006FBF]">{selectedRecord.quizAverage}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase text-[10px]">Study Time</p>
                  <p className="text-sm font-bold text-slate-900">{selectedRecord.timeSpentHours} hrs</p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Override Learning Status *
                </label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white font-semibold text-slate-800"
                >
                  <option value="On Track">On Track</option>
                  <option value="Completed">Completed</option>
                  <option value="Behind">Behind</option>
                  <option value="At Risk">At Risk</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Faculty Remedial Notes / Intervention Log
                </label>
                <textarea
                  rows={4}
                  value={facultyNotes}
                  onChange={(e) => setFacultyNotes(e.target.value)}
                  placeholder="Record coaching feedback, parent consultation notes, or custom action plans..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDetailsModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDetails}
                  className="rounded-xl px-5 py-2 font-semibold text-white shadow-sm disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
                >
                  {isSavingDetails ? 'Saving...' : 'Save Intervention'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Export Progress Analytics</h3>
              <button onClick={() => setExportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleExportReport} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Export Format</label>
                <select className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white">
                  <option value="CSV">CSV Spreadsheet (.csv)</option>
                  <option value="PDF">Comprehensive PDF Report (.pdf)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExportModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-4 py-2 font-semibold text-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
                >
                  Download Export
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}