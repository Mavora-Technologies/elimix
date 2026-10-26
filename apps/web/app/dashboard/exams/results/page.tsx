// apps/web/app/dashboard/exams/results/page.tsx
// (Also copy to apps/web/app/dashboard/academics/exams/results/page.tsx if both routes exist)
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

interface ExamResult {
  id: string;
  dbStudentId: string;
  studentId: string;
  studentName: string;
  examId: string;
  examTitle: string;
  examTerm?: string;
  subjectId: string;
  subject: string;
  subjectCode?: string;
  streamId: string;
  gradeStream: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  knecGrade: string;
  knecPoints: number;
  cbcRubric: 'EE' | 'ME' | 'AE' | 'BE';
  cbcLabel: string;
  remarks: string;
  status: 'Passed' | 'Failed' | 'Pending Review';
}

function evaluateAutoGrade(marksObtained: number, totalMarks: number) {
  const safeTotal = totalMarks > 0 ? totalMarks : 100;
  const pct = Math.max(0, Math.min(100, Math.round(((marksObtained / safeTotal) * 100) * 10) / 10));

  let knecGrade = 'E';
  let knecPoints = 1;
  let cbcRubric: 'EE' | 'ME' | 'AE' | 'BE' = 'BE';
  let cbcLabel = 'Below Expectations';
  let remarks = 'Requires immediate academic intervention';

  if (pct >= 80) {
    knecGrade = 'A'; knecPoints = 12; cbcRubric = 'EE'; cbcLabel = 'Exceeding Expectations';
    remarks = 'Exemplary mastery of subject competencies';
  } else if (pct >= 75) {
    knecGrade = 'A-'; knecPoints = 11; cbcRubric = 'ME'; cbcLabel = 'Meeting Expectations (High)';
    remarks = 'Very good mastery of learning outcomes';
  } else if (pct >= 70) {
    knecGrade = 'B+'; knecPoints = 10; cbcRubric = 'ME'; cbcLabel = 'Meeting Expectations';
    remarks = 'Commendable performance; keep aiming higher';
  } else if (pct >= 65) {
    knecGrade = 'B'; knecPoints = 9; cbcRubric = 'ME'; cbcLabel = 'Meeting Expectations';
    remarks = 'Good understanding of core concepts';
  } else if (pct >= 60) {
    knecGrade = 'B-'; knecPoints = 8; cbcRubric = 'ME'; cbcLabel = 'Meeting Expectations';
    remarks = 'Satisfactory progress; revise weak topics';
  } else if (pct >= 55) {
    knecGrade = 'C+'; knecPoints = 7; cbcRubric = 'ME'; cbcLabel = 'Meeting Expectations';
    remarks = 'Fairly good effort; room for improvement';
  } else if (pct >= 50) {
    knecGrade = 'C'; knecPoints = 6; cbcRubric = 'ME'; cbcLabel = 'Meeting Expectations';
    remarks = 'Average performance; more practice needed';
  } else if (pct >= 45) {
    knecGrade = 'C-'; knecPoints = 5; cbcRubric = 'AE'; cbcLabel = 'Approaching Expectations';
    remarks = 'Below average; requires guided revision';
  } else if (pct >= 40) {
    knecGrade = 'D+'; knecPoints = 4; cbcRubric = 'AE'; cbcLabel = 'Approaching Expectations';
    remarks = 'Marginal pass; closer remedial follow-up needed';
  } else if (pct >= 35) {
    knecGrade = 'D'; knecPoints = 3; cbcRubric = 'AE'; cbcLabel = 'Approaching Expectations';
    remarks = 'Weak performance; remedial support required';
  } else if (pct >= 30) {
    knecGrade = 'D-'; knecPoints = 2; cbcRubric = 'AE'; cbcLabel = 'Approaching Expectations';
    remarks = 'Low mastery; structured tutoring recommended';
  }

  const status: 'Passed' | 'Failed' = pct >= 40 ? 'Passed' : 'Failed';
  return { percentage: pct, knecGrade, knecPoints, cbcRubric, cbcLabel, remarks, status };
}

export default function ExamResultsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [dbExams, setDbExams] = useState<any[]>([]);
  const [dbSubjects, setDbSubjects] = useState<any[]>([]);
  const [dbStreams, setDbStreams] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryMode, setEntryMode] = useState<'single' | 'bulk'>('single');
  const [gradingSystem, setGradingSystem] = useState<'KNEC' | 'CBC'>('KNEC');

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
    marksObtained: 76,
    totalMarks: 100,
    status: 'Passed' as 'Passed' | 'Failed' | 'Pending Review',
  });

  // Bulk Marks Entry State: { [studentUuid]: number | '' }
  const [bulkScores, setBulkScores] = useState<Record<string, string>>({});

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

  const fetchPageData = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = getHeaders();
      const [resRes, stuRes, examRes, subRes, streamRes, structRes] = await Promise.all([
        fetch(`${API_BASE_URL}/academics/exam-results`, { headers }),
        fetch(`${API_BASE_URL}/students`, { headers }),
        fetch(`${API_BASE_URL}/academics/exams`, { headers }),
        fetch(`${API_BASE_URL}/academics/subjects`, { headers }),
        fetch(`${API_BASE_URL}/academics/timetables/streams`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/academics/structure`, { headers }).catch(() => null),
      ]);

      if (resRes.ok) setResults((await resRes.json()).data || []);
      if (stuRes.ok) setDbStudents((await stuRes.json()).data || []);
      if (examRes.ok) setDbExams((await examRes.json()).data || []);
      if (subRes.ok) setDbSubjects((await subRes.json()).data || []);

      if (streamRes && streamRes.ok) {
        const sData = (await streamRes.json()).data || [];
        if (sData.length > 0) {
          setDbStreams(sData);
        } else if (structRes && structRes.ok) {
          setDbStreams((await structRes.json()).data?.streams || []);
        }
      } else if (structRes && structRes.ok) {
        setDbStreams((await structRes.json()).data?.streams || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const liveEvaluation = useMemo(
    () => evaluateAutoGrade(Number(formData.marksObtained) || 0, Number(formData.totalMarks) || 100),
    [formData.marksObtained, formData.totalMarks]
  );

  const handleSaveSingleResult = async (e: React.FormEvent) => {
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
        gradingSystem,
        grade: gradingSystem === 'CBC' ? liveEvaluation.cbcRubric : liveEvaluation.knecGrade,
        status:
          formData.status === 'Pending Review' ? 'Pending Review' : liveEvaluation.status,
      };

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(
          result.message || result.errors?.[0]?.message || 'Submission failed'
        );
      }

      await fetchPageData();
      setSuccessBanner(
        isEditing
          ? 'Exam score re-evaluated and updated.'
          : `Score auto-graded (${liveEvaluation.knecGrade} / ${liveEvaluation.cbcRubric}) and saved.`
      );
      setIsModalOpen(false);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveBulkResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.examId || !formData.subjectId || !formData.streamId) {
      setFormError('Please select Exam, Subject, and Stream first.');
      return;
    }

    const entries = Object.entries(bulkScores)
      .filter(([, val]) => val !== '' && !isNaN(Number(val)))
      .map(([studentId, val]) => ({
        studentId,
        marksObtained: Number(val),
      }));

    if (entries.length === 0) {
      setFormError('Enter marks for at least one student in the table below.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/academics/exam-results/bulk`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          examId: formData.examId,
          subjectId: formData.subjectId,
          streamId: formData.streamId,
          totalMarks: Number(formData.totalMarks) || 100,
          gradingSystem,
          entries,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Bulk grading failed');

      await fetchPageData();
      setSuccessBanner(json.message || `Auto-graded ${entries.length} student results.`);
      setIsModalOpen(false);
      setBulkScores({});
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

  const openCreateModal = (mode: 'single' | 'bulk' = 'single') => {
    setIsEditing(false);
    setEntryMode(mode);
    setSelectedResult(null);
    setFormError(null);
    setBulkScores({});
    setFormData({
      studentId: dbStudents[0]?.id || '',
      examId: dbExams[0]?.id || '',
      subjectId: dbSubjects[0]?.id || '',
      streamId: dbStreams[0]?.id || '',
      marksObtained: 76,
      totalMarks: 100,
      status: 'Passed',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (rec: ExamResult) => {
    setIsEditing(true);
    setEntryMode('single');
    setSelectedResult(rec);
    setFormError(null);

    const stu = dbStudents.find(
      (s) => s.id === rec.dbStudentId || s.admissionNumber === rec.studentId
    );
    const exm = dbExams.find((e) => e.id === rec.examId || e.title === rec.examTitle);
    const sub = dbSubjects.find((s) => s.id === rec.subjectId || s.name === rec.subject);
    const strm = dbStreams.find((s) => s.id === rec.streamId || s.name === rec.gradeStream);

    setFormData({
      studentId: rec.dbStudentId || (stu ? stu.id : ''),
      examId: rec.examId || (exm ? exm.id : ''),
      subjectId: rec.subjectId || (sub ? sub.id : ''),
      streamId: rec.streamId || (strm ? strm.id : ''),
      marksObtained: rec.marksObtained,
      totalMarks: rec.totalMarks,
      status: rec.status,
    });
    setIsModalOpen(true);
  };

  const openDeletePrompt = (rec: ExamResult) => {
    setSelectedResult(rec);
    setFormError(null);
    setIsDeleteModalOpen(true);
  };

  const filteredResults = useMemo(() => {
    return results.filter((res) => {
      const matchesSearch =
        res.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExam = examFilter === 'All' || res.examTitle === examFilter;
      const matchesSubject = subjectFilter === 'All' || res.subject === subjectFilter;
      const matchesStatus = statusFilter === 'All' || res.status === statusFilter;
      const matchesGrade =
        gradeFilter === 'All' ||
        res.knecGrade === gradeFilter ||
        res.cbcRubric === gradeFilter ||
        res.grade === gradeFilter;

      return matchesSearch && matchesExam && matchesSubject && matchesStatus && matchesGrade;
    });
  }, [results, searchQuery, examFilter, subjectFilter, statusFilter, gradeFilter]);

  const kpiStats = useMemo(() => {
    const count = filteredResults.length;
    if (count === 0) return { count: 0, passRate: 0, avgPct: 0, meanPoints: '0.0', meanGrade: '-' };

    const passed = filteredResults.filter((r) => r.status === 'Passed').length;
    const sumPct = filteredResults.reduce((acc, r) => acc + (r.percentage || 0), 0);
    const sumPts = filteredResults.reduce((acc, r) => acc + (r.knecPoints || 1), 0);
    const avgPct = Math.round(sumPct / count);
    const meanPts = (sumPts / count).toFixed(2);
    const overallEval = evaluateAutoGrade(avgPct, 100);

    return {
      count,
      passRate: Math.round((passed / count) * 100),
      avgPct,
      meanPoints: meanPts,
      meanGrade: `${overallEval.knecGrade} (${overallEval.cbcRubric})`,
    };
  }, [filteredResults]);

  const handleExportCSV = () => {
    const headers = [
      'Admission No',
      'Student Name',
      'Exam',
      'Subject',
      'Stream',
      'Marks Obtained',
      'Max Marks',
      'Percentage',
      'KNEC Grade',
      'KNEC Points',
      'CBC Rubric',
      'Status',
      'Teacher Remarks',
    ];
    const rows = filteredResults.map((r) => [
      `"${r.studentId}"`,
      `"${r.studentName}"`,
      `"${r.examTitle}"`,
      `"${r.subject}"`,
      `"${r.gradeStream}"`,
      r.marksObtained,
      r.totalMarks,
      `${r.percentage}%`,
      `"${r.knecGrade}"`,
      r.knecPoints,
      `"${r.cbcRubric} (${r.cbcLabel})"`,
      `"${r.status}"`,
      `"${r.remarks}"`,
    ]);

    const csv =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `elimix_exam_results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Passed':
        return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'Failed':
        return 'bg-rose-50/80 text-rose-700 ring-1 ring-inset ring-rose-600/20';
      default:
        return 'bg-amber-50/80 text-amber-700 ring-1 ring-inset ring-amber-600/20';
    }
  };

  const getGradeBadge = (knecGrade: string) => {
    if (knecGrade.startsWith('A')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (knecGrade.startsWith('B')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (knecGrade.startsWith('C')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (knecGrade.startsWith('D')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const getCbcBadge = (rubric: string) => {
    switch (rubric) {
      case 'EE':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ME':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'AE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getInitials = (name: string) =>
    name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : 'ST';

  const uniqueExams = Array.from(new Set(results.map((r) => r.examTitle)));
  const uniqueSubjects = Array.from(new Set(results.map((r) => r.subject)));

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
            <Link href="/dashboard" className="hover:text-[#006FBF] transition-colors">
              Dashboard
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/exams" className="hover:text-[#006FBF] transition-colors">
              Exams
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">Marks Entry & Results</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">
            Exam Marks Entry & KNEC / CBC Auto-Grading
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Automated 12-point KNEC mean grades (A to E) and 4-level CBC competency rubrics (EE, ME, AE, BE).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <i className="fa-solid fa-file-csv text-emerald-600"></i> Export Sheet
          </button>
          <button
            onClick={() => openCreateModal('bulk')}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#006FBF]/30 bg-sky-50 px-4 text-xs font-bold text-[#006FBF] hover:bg-sky-100"
          >
            <i className="fa-solid fa-table-list text-[11px]"></i> Bulk Class Entry
          </button>
          <button
            onClick={() => openCreateModal('single')}
            className="flex h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all"
            style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
          >
            <i className="fa-solid fa-plus text-[10px]"></i>
            <span>Record Score</span>
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
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Scores Recorded
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{kpiStats.count}</p>
          <span className="text-[11px] text-slate-500">Verified subject entries</span>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            Pass Rate (≥ 40%)
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{kpiStats.passRate}%</p>
          <span className="text-[11px] text-emerald-600 font-medium">KNEC / CBC threshold</span>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold text-[#006FBF] uppercase tracking-wider">
            Mean Percentage
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{kpiStats.avgPct}%</p>
          <span className="text-[11px] text-[#006FBF] font-medium">
            Mean Grade: {kpiStats.meanGrade}
          </span>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
            KNEC Mean Points
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {kpiStats.meanPoints} <span className="text-xs font-normal text-slate-400">/ 12.0</span>
          </p>
          <span className="text-[11px] text-purple-600 font-medium">12-point grading index</span>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search student name, admission number, exam, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700"
          >
            <option value="All">All Exams</option>
            {uniqueExams.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700"
          >
            <option value="All">All Subjects</option>
            {uniqueSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700"
          >
            <option value="All">All Grades & Rubrics</option>
            <optgroup label="CBC Competency">
              <option value="EE">EE (Exceeding)</option>
              <option value="ME">ME (Meeting)</option>
              <option value="AE">AE (Approaching)</option>
              <option value="BE">BE (Below)</option>
            </optgroup>
            <optgroup label="KNEC 12-Point">
              <option value="A">A (80-100%)</option>
              <option value="A-">A- (75-79%)</option>
              <option value="B+">B+ (70-74%)</option>
              <option value="B">B (65-69%)</option>
              <option value="B-">B- (60-64%)</option>
              <option value="C+">C+ (55-59%)</option>
              <option value="C">C (50-54%)</option>
              <option value="C-">C- (45-49%)</option>
              <option value="D+">D+ (40-44%)</option>
              <option value="D">D (35-39%)</option>
              <option value="D-">D- (30-34%)</option>
              <option value="E">E (&lt;30%)</option>
            </optgroup>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
            <option value="Pending Review">Pending Review</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-5 pr-3">Student Name / Adm No</th>
                <th className="py-4 px-4">Exam & Subject</th>
                <th className="py-4 px-4">Stream</th>
                <th className="py-4 px-4">Score & %</th>
                <th className="py-4 px-4">KNEC Grade (Pts)</th>
                <th className="py-4 px-4">CBC Rubric</th>
                <th className="py-4 px-4">Auto Remarks & Status</th>
                <th className="py-4 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading graded results...
                  </td>
                </tr>
              ) : filteredResults.length > 0 ? (
                filteredResults.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/40 transition-colors text-xs">
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-bold border border-slate-200/80">
                          {getInitials(res.studentName)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{res.studentName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{res.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{res.examTitle}</div>
                      <div className="text-[11px] text-[#006FBF] font-medium">{res.subject}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{res.gradeStream}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-mono font-bold">
                        {res.marksObtained}{' '}
                        <span className="text-slate-400 font-normal">/ {res.totalMarks}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono font-semibold">
                        {res.percentage}%
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded text-[11px] font-extrabold border ${getGradeBadge(
                            res.knecGrade
                          )}`}
                        >
                          {res.knecGrade}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 font-semibold">
                          {res.knecPoints} pts
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCbcBadge(
                          res.cbcRubric
                        )}`}
                      >
                        {res.cbcRubric} • {res.cbcLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(
                            res.status
                          )}`}
                        >
                          {res.status}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {res.remarks}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pl-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(res)}
                          className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-[#006FBF] hover:bg-[#006FBF]/10 flex items-center justify-center border border-slate-200/60"
                          title="Edit Score"
                        >
                          <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                        </button>
                        <button
                          onClick={() => openDeletePrompt(res)}
                          className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200/60"
                          title="Delete Score"
                        >
                          <i className="fa-solid fa-trash-can text-[10px]"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No exam scores recorded yet. Click <strong>Record Score</strong> or{' '}
                    <strong>Bulk Class Entry</strong> to begin grading.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          MODAL: SINGLE & BULK MARKS ENTRY WITH LIVE KNEC / CBC AUTO-GRADING
         ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div
            className={`w-full ${
              entryMode === 'bulk' ? 'max-w-3xl' : 'max-w-lg'
            } rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {isEditing
                    ? 'Edit & Re-Grade Student Score'
                    : entryMode === 'bulk'
                    ? 'Bulk Class Marks Sheet (Auto-Graded)'
                    : 'Record & Auto-Grade Exam Score'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Instant KNEC 12-point (A to E) and CBC Competency (EE, ME, AE, BE) computation.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <div className="flex rounded-xl bg-slate-200/70 p-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setEntryMode('single')}
                      className={`px-3 py-1 rounded-lg ${
                        entryMode === 'single' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Single Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setEntryMode('bulk')}
                      className={`px-3 py-1 rounded-lg ${
                        entryMode === 'bulk' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Bulk Class Sheet
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>
            </div>

            {entryMode === 'single' ? (
              <form onSubmit={handleSaveSingleResult} className="overflow-y-auto p-6 space-y-4 text-xs">
                {formError && (
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium">
                    <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Student *</label>
                    <select
                      required
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none"
                    >
                      <option value="">Select student...</option>
                      {dbStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.firstName} {s.lastName} ({s.admissionNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Class / Stream *
                    </label>
                    <select
                      required
                      value={formData.streamId}
                      onChange={(e) => setFormData({ ...formData, streamId: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none"
                    >
                      <option value="">Select stream...</option>
                      {dbStreams.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Exam / Assessment *
                    </label>
                    <select
                      required
                      value={formData.examId}
                      onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none"
                    >
                      <option value="">Select exam...</option>
                      {dbExams.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.title} ({e.term})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                    <select
                      required
                      value={formData.subjectId}
                      onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none"
                    >
                      <option value="">Select subject...</option>
                      {dbSubjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-sky-50/60 p-4 rounded-xl border border-sky-100">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Marks Obtained *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max={formData.totalMarks}
                      step="0.5"
                      value={formData.marksObtained}
                      onChange={(e) =>
                        setFormData({ ...formData, marksObtained: Number(e.target.value) })
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Marks *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.5"
                      value={formData.totalMarks}
                      onChange={(e) =>
                        setFormData({ ...formData, totalMarks: Number(e.target.value) })
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Primary Scale
                    </label>
                    <select
                      value={gradingSystem}
                      onChange={(e) => setGradingSystem(e.target.value as 'KNEC' | 'CBC')}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold text-[#006FBF]"
                    >
                      <option value="KNEC">KNEC (A to E)</option>
                      <option value="CBC">CBC (EE to BE)</option>
                    </select>
                  </div>
                </div>

                {/* Live Auto-Graded Preview Card */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Live Auto-Grading Evaluation ({liveEvaluation.percentage}%)
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(
                        liveEvaluation.status
                      )}`}
                    >
                      {liveEvaluation.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-white rounded-lg p-2.5 border border-emerald-100">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        KNEC 12-Point Grade
                      </span>
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        {liveEvaluation.knecGrade}{' '}
                        <span className="text-xs font-semibold text-[#006FBF]">
                          ({liveEvaluation.knecPoints} pts)
                        </span>
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-2.5 border border-emerald-100">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        CBC Competency Rubric
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        {liveEvaluation.cbcRubric}{' '}
                        <span className="text-[11px] font-medium text-slate-500">
                          ({liveEvaluation.cbcLabel})
                        </span>
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-900 font-medium pt-1">
                    <i className="fa-solid fa-comment-dots mr-1.5 text-emerald-600"></i>
                    Auto Remark: <em>"{liveEvaluation.remarks}"</em>
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                    }}
                  >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Result' : 'Save & Auto-Grade'}
                  </button>
                </div>
              </form>
            ) : (
              /* BULK CLASS MARKS SHEET */
              <form
                onSubmit={handleSaveBulkResults}
                className="flex-1 overflow-y-auto p-6 space-y-4 text-xs"
              >
                {formError && (
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Exam *</label>
                    <select
                      required
                      value={formData.examId}
                      onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5"
                    >
                      <option value="">Select exam...</option>
                      {dbExams.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                    <select
                      required
                      value={formData.subjectId}
                      onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5"
                    >
                      <option value="">Select subject...</option>
                      {dbSubjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stream *</label>
                    <select
                      required
                      value={formData.streamId}
                      onChange={(e) => setFormData({ ...formData, streamId: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5"
                    >
                      <option value="">Select stream...</option>
                      {dbStreams.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Marks</label>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={formData.totalMarks}
                      onChange={(e) =>
                        setFormData({ ...formData, totalMarks: Number(e.target.value) })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden max-h-[42vh] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500 sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3">Student</th>
                        <th className="py-2.5 px-3 w-36">Score (/ {formData.totalMarks})</th>
                        <th className="py-2.5 px-3">Live KNEC</th>
                        <th className="py-2.5 px-3">Live CBC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dbStudents.slice(0, 30).map((stu) => {
                        const rawVal = bulkScores[stu.id] ?? '';
                        const hasScore = rawVal !== '' && !isNaN(Number(rawVal));
                        const evalItem = hasScore
                          ? evaluateAutoGrade(Number(rawVal), formData.totalMarks)
                          : null;

                        return (
                          <tr key={stu.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3">
                              <div className="font-semibold text-slate-900">
                                {stu.firstName} {stu.lastName}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">
                                {stu.admissionNumber}
                              </div>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                min={0}
                                max={formData.totalMarks}
                                step="0.5"
                                placeholder="--"
                                value={rawVal}
                                onChange={(e) =>
                                  setBulkScores((prev) => ({
                                    ...prev,
                                    [stu.id]: e.target.value,
                                  }))
                                }
                                className="w-24 rounded-lg border border-slate-300 px-2.5 py-1 font-mono font-bold text-slate-900 focus:border-[#006FBF] outline-none"
                              />
                            </td>
                            <td className="py-2 px-3 font-mono font-bold text-slate-800">
                              {evalItem ? `${evalItem.knecGrade} (${evalItem.knecPoints}p)` : '-'}
                            </td>
                            <td className="py-2 px-3 font-semibold text-[#006FBF]">
                              {evalItem ? `${evalItem.cbcRubric} (${evalItem.percentage}%)` : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl px-5 py-2 font-semibold text-white shadow-sm disabled:opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                    }}
                  >
                    {isSubmitting ? 'Auto-Grading Batch...' : 'Save & Auto-Grade All Entered Scores'}
                  </button>
                </div>
              </form>
            )}
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
              <h3 className="text-lg font-bold text-slate-900">Delete Exam Result</h3>
              <p className="mt-1.5 text-xs text-slate-500">
                Permanently remove this score for{' '}
                <span className="font-semibold text-slate-700">{selectedResult.studentName}</span>?
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white"
              >
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}