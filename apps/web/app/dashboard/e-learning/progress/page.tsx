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
  quizAttemptsCount: number;
  quizAverageNumeric: number | null;
  quizAverage: string;
  timeSpentHours: number;
  status: 'On Track' | 'Completed' | 'At Risk' | 'Behind';
  facultyNotes?: string;
  lastUpdated?: string | null;
}

interface LessonChecklistItem {
  id: string;
  chapterNumber: number;
  title: string;
  contentType: string;
  durationMinutes: number;
  completed: boolean;
}

interface QuizAttemptHistory {
  id: string;
  quizTitle: string;
  earnedPoints: number;
  totalPoints: number;
  scorePercentage: number;
  passed: 'Pass' | 'Fail';
  submittedAt: string;
}

export default function ELearningProgressPage() {
  const [progressList, setProgressList] = useState<StudentProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');

  // Pagination for high-volume datasets
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Interactive Learner Mastery & Intervention Modal
  const [selectedRecord, setSelectedRecord] = useState<StudentProgress | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'lessons' | 'quizzes' | 'intervention'>('lessons');
  const [lessonChecklist, setLessonChecklist] = useState<LessonChecklistItem[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizAttemptHistory[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [togglingLessonId, setTogglingLessonId] = useState<string | null>(null);

  const [overrideStatus, setOverrideStatus] = useState<StudentProgress['status']>('On Track');
  const [facultyNotes, setFacultyNotes] = useState('');
  const [isSavingDetails, setIsSavingDetails] = useState(false);

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

  // --- OPEN LEARNER MASTERY DRAWER ---
  const openDetailsModal = async (
    record: StudentProgress,
    defaultTab: 'lessons' | 'quizzes' | 'intervention' = 'lessons'
  ) => {
    setSelectedRecord(record);
    setOverrideStatus(record.status);
    setFacultyNotes(record.facultyNotes || '');
    setActiveTab(defaultTab);
    setDetailsModalOpen(true);
    setIsLoadingDetail(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/e-learning/progress/details?studentId=${record.dbStudentId}&courseId=${record.dbCourseId}`,
        { headers: getHeaders() }
      );
      if (res.ok) {
        const json = await res.json();
        setLessonChecklist(json.data?.lessonChecklist || []);
        setQuizHistory(json.data?.quizHistory || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // --- TOGGLE REAL LESSON COMPLETION ---
  const handleToggleLesson = async (lesson: LessonChecklistItem) => {
    if (!selectedRecord) return;
    setTogglingLessonId(lesson.id);
    const nextCompleted = !lesson.completed;

    try {
      const res = await fetch(`${API_BASE_URL}/e-learning/progress/toggle-lesson`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          studentId: selectedRecord.dbStudentId,
          courseId: selectedRecord.dbCourseId,
          lessonId: lesson.id,
          completed: nextCompleted,
        }),
      });

      if (res.ok) {
        const updatedList = lessonChecklist.map((l) =>
          l.id === lesson.id ? { ...l, completed: nextCompleted } : l
        );
        setLessonChecklist(updatedList);

        const doneCount = updatedList.filter((l) => l.completed).length;
        const totCount = updatedList.length;
        const pct = totCount > 0 ? Math.round((doneCount / totCount) * 100) : 0;
        const mins = updatedList
          .filter((l) => l.completed)
          .reduce((acc, l) => acc + (Number(l.durationMinutes) || 40), 0);

        setSelectedRecord({
          ...selectedRecord,
          modulesCompleted: doneCount,
          totalModules: totCount,
          completionPercentage: pct,
          timeSpentHours: Number((mins / 60).toFixed(1)),
          status: pct === 100 ? 'Completed' : pct >= 60 ? 'On Track' : pct >= 25 ? 'Behind' : 'At Risk',
        });

        await fetchProgress();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTogglingLessonId(null);
    }
  };

  // --- SAVE FACULTY INTERVENTION & STATUS OVERRIDE ---
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
      setSuccessBanner(`Saved faculty intervention and status for ${selectedRecord.studentName}.`);
      setDetailsModalOpen(false);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSavingDetails(false);
    }
  };

  // --- REAL CLIENT-SIDE CSV DOWNLOAD ---
  const handleDownloadCSV = () => {
    const headers = [
      'Admission No',
      'Student Name',
      'Course Title',
      'Subject',
      'Lessons Completed',
      'Total Lessons',
      'Completion %',
      'Quiz Average',
      'Quiz Attempts',
      'Study Time (Hrs)',
      'Status',
      'Faculty Notes',
    ];

    const rows = filteredProgress.map((item) => [
      `"${item.studentId}"`,
      `"${item.studentName}"`,
      `"${item.courseTitle}"`,
      `"${item.subject}"`,
      item.modulesCompleted,
      item.totalModules,
      `${item.completionPercentage}%`,
      `"${item.quizAverage}"`,
      item.quizAttemptsCount || 0,
      item.timeSpentHours,
      `"${item.status}"`,
      `"${(item.facultyNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `elimix_elearning_progress_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessBanner(`Exported ${filteredProgress.length} student progress records to CSV.`);
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
      const matchesCourse = courseFilter === 'All' || item.courseTitle === courseFilter;

      return matchesSearch && matchesStatus && matchesSubject && matchesCourse;
    });
  }, [progressList, searchQuery, statusFilter, subjectFilter, courseFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProgress.length / pageSize));
  const paginatedProgress = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProgress.slice(start, start + pageSize);
  }, [filteredProgress, currentPage]);

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
  const availableCoursesFilter = Array.from(new Set(progressList.map((p) => p.courseTitle)));

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            E-Learning Student Progress & Mastery Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Real-time chapter completion checklists, auto-marked quiz averages, and faculty intervention logs.
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
            onClick={handleDownloadCSV}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
          >
            <i className="fa-solid fa-file-csv mr-2 text-xs"></i> Export CSV Report
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
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tracked Enrollments
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{kpis.total}</p>
          <span className="text-xs text-emerald-600 font-medium">Verified student-course records</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg Course Completion
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{kpis.avgPct}%</p>
          <span className="text-xs text-[#006FBF] font-medium">Calculated from completed lessons</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Certified Completed
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{kpis.completedCount}</p>
          <span className="text-xs text-purple-600 font-medium">100% syllabus mastery</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            At-Risk Learners
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{kpis.atRiskCount}</p>
          <span className="text-xs text-rose-600 font-medium">Requiring faculty intervention</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search student name, admission ID, course, or subject..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#006FBF]"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Course:</span>
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 max-w-[200px] truncate"
            >
              <option value="All">All Courses</option>
              {availableCoursesFilter.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Subject:</span>
            <select
              value={subjectFilter}
              onChange={(e) => {
                setSubjectFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
            >
              <option value="All">All Subjects</option>
              {availableSubjectsFilter.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
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
                <th className="py-3.5 px-4">Student Name / ID</th>
                <th className="py-3.5 px-4">Enrolled Course</th>
                <th className="py-3.5 px-4">Chapters / Lessons Progress</th>
                <th className="py-3.5 px-4">Real Quiz Avg</th>
                <th className="py-3.5 px-4">Study Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading live student progress...
                  </td>
                </tr>
              ) : paginatedProgress.length > 0 ? (
                paginatedProgress.map((item) => (
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
                        <span className="text-slate-700">
                          {item.modulesCompleted} / {item.totalModules} lessons
                        </span>
                        <span className="font-bold text-slate-900">
                          {item.completionPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            item.completionPercentage === 100
                              ? 'bg-emerald-500'
                              : item.completionPercentage >= 60
                              ? 'bg-[#006FBF]'
                              : item.completionPercentage >= 25
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.completionPercentage}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-mono text-xs font-bold">
                        {item.quizAverage}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.quizAttemptsCount || 0} quiz attempts
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                      {item.timeSpentHours} hrs
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openDetailsModal(item, 'lessons')}
                        className="rounded-lg bg-[#006FBF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#012E54] transition-colors shadow-xs"
                      >
                        <i className="fa-solid fa-list-check mr-1.5 text-[10px]"></i>Manage Mastery
                      </button>
                      <button
                        onClick={() => openDetailsModal(item, 'intervention')}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        title="Faculty Intervention & Status Override"
                      >
                        <i className="fa-solid fa-user-pen text-[10px]"></i>
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

        {/* Pagination Footer */}
        {filteredProgress.length > pageSize && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredProgress.length)} of{' '}
              {filteredProgress.length} enrollments
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1 font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <span className="font-mono font-bold">
                Page {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1 font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          MODAL: 3-TAB LEARNER MASTERY, QUIZ HISTORY & FACULTY INTERVENTION
         ===================================================================== */}
      {detailsModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {selectedRecord.studentName}{' '}
                  <span className="text-xs font-mono text-slate-500">
                    ({selectedRecord.studentId})
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Course: <strong className="text-slate-700">{selectedRecord.courseTitle}</strong> (
                  {selectedRecord.subject})
                </p>
              </div>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Live KPI Strip */}
            <div className="grid grid-cols-4 gap-2 bg-slate-100/70 px-6 py-3 border-b border-slate-200 text-center font-mono text-xs">
              <div>
                <span className="block text-[10px] uppercase text-slate-400 font-sans font-bold">
                  Lessons Done
                </span>
                <span className="font-bold text-slate-900">
                  {selectedRecord.modulesCompleted} / {selectedRecord.totalModules}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-slate-400 font-sans font-bold">
                  Completion
                </span>
                <span className="font-bold text-[#006FBF]">
                  {selectedRecord.completionPercentage}%
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-slate-400 font-sans font-bold">
                  Quiz Average
                </span>
                <span className="font-bold text-slate-900">{selectedRecord.quizAverage}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-slate-400 font-sans font-bold">
                  Study Hours
                </span>
                <span className="font-bold text-slate-900">
                  {selectedRecord.timeSpentHours} hrs
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-6 pt-3 gap-2">
              <button
                onClick={() => setActiveTab('lessons')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'lessons'
                    ? 'border-[#006FBF] text-[#006FBF]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Chapter & Lesson Checklist ({lessonChecklist.length})
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'quizzes'
                    ? 'border-[#006FBF] text-[#006FBF]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Auto-Graded Quiz Attempts ({quizHistory.length})
              </button>
              <button
                onClick={() => setActiveTab('intervention')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'intervention'
                    ? 'border-[#006FBF] text-[#006FBF]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Faculty Intervention & Status
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingDetail ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading learner mastery data...
                </div>
              ) : activeTab === 'lessons' ? (
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-500 mb-3">
                    Check off chapters/lessons completed by{' '}
                    <strong>{selectedRecord.studentName}</strong>. Completion percentage and active study hours recalculate automatically in PostgreSQL.
                  </p>
                  {lessonChecklist.length > 0 ? (
                    lessonChecklist.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => handleToggleLesson(lesson)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                          lesson.completed
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={lesson.completed}
                            disabled={togglingLessonId === lesson.id}
                            onChange={() => {}}
                            className="h-4 w-4 rounded border-slate-300 text-[#006FBF]"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              Chapter {lesson.chapterNumber}: {lesson.title}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {lesson.contentType} • {lesson.durationMinutes} mins study credit
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            lesson.completed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {togglingLessonId === lesson.id
                            ? 'Saving...'
                            : lesson.completed
                            ? 'Completed'
                            : 'Pending'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                      No chapters/lessons have been added to this course yet. Go to{' '}
                      <Link
                        href="/dashboard/e-learning/courses"
                        className="text-[#006FBF] underline font-semibold"
                      >
                        E-Learning Courses
                      </Link>{' '}
                      to add lessons.
                    </div>
                  )}
                </div>
              ) : activeTab === 'quizzes' ? (
                <div className="space-y-3">
                  {quizHistory.length > 0 ? (
                    quizHistory.map((q) => (
                      <div
                        key={q.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{q.quizTitle}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Submitted: {new Date(q.submittedAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-extrabold text-sm text-slate-900">
                            {q.scorePercentage}% ({q.earnedPoints}/{q.totalPoints} pts)
                          </div>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              q.passed === 'Pass'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {q.passed}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                      This learner has not submitted any auto-graded quizzes for this subject yet.
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSaveIntervention} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Override Academic Pacing Status *
                    </label>
                    <select
                      value={overrideStatus}
                      onChange={(e) => setOverrideStatus(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white font-semibold text-slate-800"
                    >
                      <option value="On Track">On Track</option>
                      <option value="Completed">Completed</option>
                      <option value="Behind">Behind</option>
                      <option value="At Risk">At Risk (Requires Remediation)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Faculty Coaching & Remediation Log
                    </label>
                    <textarea
                      rows={4}
                      value={facultyNotes}
                      onChange={(e) => setFacultyNotes(e.target.value)}
                      placeholder="Record remedial instructions, parent follow-up notes, or study goals..."
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs resize-none"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSavingDetails}
                      className="rounded-xl px-5 py-2 font-semibold text-white shadow-sm disabled:opacity-50"
                      style={{
                        background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                      }}
                    >
                      {isSavingDetails ? 'Saving...' : 'Save Intervention Log'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}