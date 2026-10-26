// apps/web/app/dashboard/exams/reports/page.tsx
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

interface SubjectLineItem {
  resultId: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  knecGrade: string;
  knecPoints: number;
  cbcRubric: 'EE' | 'ME' | 'AE' | 'BE';
  cbcLabel: string;
  remarks: string;
}

interface ReportCardRecord {
  id: string;
  studentId: string;
  dbStudentId: string;
  studentName: string;
  gender: string;
  examId: string;
  examTitle: string;
  term: string;
  academicYearName: string;
  streamId: string;
  gradeStream: string;
  subjectsCount: number;
  totalMarksObtained: number;
  totalMaxMarks: number;
  meanPercentage: number;
  totalKnecPoints: number;
  meanKnecPoints: number;
  meanGrade: string;
  cbcRubric: 'EE' | 'ME' | 'AE' | 'BE';
  cbcLabel: string;
  streamRank: number;
  streamOutOf: number;
  overallRank: number;
  overallOutOf: number;
  classTeacherRemarks: string;
  principalRemarks: string;
  attendanceDaysPresent: number;
  attendanceTotalDays: number;
  nextTermBegins: string;
  status: 'Draft' | 'Published' | 'Withheld';
  subjectBreakdown: SubjectLineItem[];
}

export default function ExamReportsPage() {
  const [reports, setReports] = useState<ReportCardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState('All');
  const [streamFilter, setStreamFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Official Printable Report Card Modal
  const [selectedReport, setSelectedReport] = useState<ReportCardRecord | null>(null);
  const [transcriptModalOpen, setTranscriptModalOpen] = useState(false);

  // Edit Endorsement / Remarks Modal
  const [endorseModalOpen, setEndorseModalOpen] = useState(false);
  const [endorseForm, setEndorseForm] = useState({
    classTeacherRemarks: '',
    principalRemarks: '',
    attendanceDaysPresent: 62,
    attendanceTotalDays: 65,
    nextTermBegins: '2027-01-06',
    status: 'Published' as 'Draft' | 'Published' | 'Withheld',
  });
  const [isSaving, setIsSaving] = useState(false);
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

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/academics/exam-reports`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setReports(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const openTranscriptModal = (rep: ReportCardRecord) => {
    setSelectedReport(rep);
    setTranscriptModalOpen(true);
  };

  const openEndorseModal = (rep: ReportCardRecord) => {
    setSelectedReport(rep);
    setEndorseForm({
      classTeacherRemarks: rep.classTeacherRemarks,
      principalRemarks: rep.principalRemarks,
      attendanceDaysPresent: rep.attendanceDaysPresent,
      attendanceTotalDays: rep.attendanceTotalDays,
      nextTermBegins: rep.nextTermBegins || '2027-01-06',
      status: rep.status,
    });
    setEndorseModalOpen(true);
  };

  const handleSaveEndorsement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/academics/exam-reports/endorse`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          studentId: selectedReport.dbStudentId,
          examId: selectedReport.examId,
          streamId: selectedReport.streamId,
          ...endorseForm,
        }),
      });

      if (res.ok) {
        await fetchReports();
        setEndorseModalOpen(false);
        setSuccessBanner(`Official report card remarks saved for ${selectedReport.studentName}.`);
        setTimeout(() => setSuccessBanner(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.examTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExam = examFilter === 'All' || r.examTitle === examFilter;
      const matchesStream = streamFilter === 'All' || r.gradeStream === streamFilter;
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

      return matchesSearch && matchesExam && matchesStream && matchesStatus;
    });
  }, [reports, searchQuery, examFilter, streamFilter, statusFilter]);

  const kpis = useMemo(() => {
    const count = filteredReports.length;
    if (count === 0) {
      return { count: 0, publishedCount: 0, schoolMeanPct: 0, topScore: 0 };
    }
    const publishedCount = filteredReports.filter((r) => r.status === 'Published').length;
    const schoolMeanPct = Math.round(
      filteredReports.reduce((acc, r) => acc + r.meanPercentage, 0) / count
    );
    const topScore = Math.max(...filteredReports.map((r) => r.meanPercentage));
    return { count, publishedCount, schoolMeanPct, topScore };
  }, [filteredReports]);

  const uniqueExams = Array.from(new Set(reports.map((r) => r.examTitle)));
  const uniqueStreams = Array.from(new Set(reports.map((r) => r.gradeStream)));

  const getGradeBadge = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (grade.startsWith('B')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (grade.startsWith('C')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (grade.startsWith('D')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const getStatusBadge = (status: ReportCardRecord['status']) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Link href="/dashboard" className="hover:text-[#006FBF]">
              Dashboard
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/exams" className="hover:text-[#006FBF]">
              Exams
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900">Report Cards & Transcripts</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Official Student Report Cards & Academic Transcripts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live multi-subject aggregation, stream ranking, KNEC mean points, CBC rubrics, and printable transcripts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/exams/results"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <i className="fa-solid fa-pen-clip text-[#006FBF]"></i> Marks Entry Sheet
          </Link>
        </div>
      </div>

      {successBanner && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-emerald-800 text-xs font-medium flex items-center shadow-sm">
          <i className="fa-solid fa-circle-check text-emerald-600 mr-2 text-sm"></i>
          <span>{successBanner}</span>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Generated Transcripts
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{kpis.count}</p>
          <span className="text-[11px] text-emerald-600 font-medium">
            Aggregated from exam results
          </span>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            Published Report Cards
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{kpis.publishedCount}</p>
          <span className="text-[11px] text-slate-500">Ready for parent portal & print</span>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold text-[#006FBF] uppercase tracking-wider">
            Cohort Mean Score
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{kpis.schoolMeanPct}%</p>
          <span className="text-[11px] text-[#006FBF] font-medium">Across all sat subjects</span>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
            Top Candidate Mean
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{kpis.topScore}%</p>
          <span className="text-[11px] text-purple-600 font-medium">Rank #1 performance</span>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search candidate name, admission number, or exam..."
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
            <option value="All">All Examinations</option>
            {uniqueExams.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700"
          >
            <option value="All">All Streams</option>
            {uniqueStreams.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Withheld">Withheld</option>
          </select>
        </div>
      </div>

      {/* REPORTS TABLE */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-5 pr-3">Stream Rank</th>
                <th className="py-4 px-4">Candidate / Adm No</th>
                <th className="py-4 px-4">Examination & Stream</th>
                <th className="py-4 px-4">Subjects Sat</th>
                <th className="py-4 px-4">Total Marks & Mean %</th>
                <th className="py-4 px-4">Mean Grade & CBC</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>Aggregating student report cards...
                  </td>
                </tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pl-5 pr-3">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-extrabold text-[#012E54]">
                        #{rep.streamRank}{' '}
                        <span className="text-[10px] font-normal text-slate-400">
                          / {rep.streamOutOf}
                        </span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{rep.studentName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{rep.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{rep.examTitle}</div>
                      <div className="text-[10px] text-[#006FBF] font-medium">
                        {rep.gradeStream} • {rep.term}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      {rep.subjectsCount} subjects
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">
                        {rep.totalMarksObtained}{' '}
                        <span className="text-slate-400 font-normal">/ {rep.totalMaxMarks}</span>
                      </div>
                      <div className="text-[11px] font-mono font-bold text-[#006FBF]">
                        Mean: {rep.meanPercentage}% ({rep.meanKnecPoints} pts)
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded text-xs font-extrabold border ${getGradeBadge(
                            rep.meanGrade
                          )}`}
                        >
                          {rep.meanGrade}
                        </span>
                        <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-[#006FBF] border border-sky-200">
                          {rep.cbcRubric}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          rep.status
                        )}`}
                      >
                        {rep.status}
                      </span>
                    </td>
                    <td className="py-3.5 pl-3 pr-5 text-right space-x-1.5">
                      <button
                        onClick={() => openTranscriptModal(rep)}
                        className="rounded-lg bg-[#006FBF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#012E54] transition-colors shadow-xs"
                      >
                        <i className="fa-solid fa-print mr-1.5 text-[10px]"></i>View / Print Transcript
                      </button>
                      <button
                        onClick={() => openEndorseModal(rep)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        title="Edit Remarks & Endorsement"
                      >
                        <i className="fa-solid fa-signature text-[10px]"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No student report cards available yet. Enter scores in{' '}
                    <Link
                      href="/dashboard/exams/results"
                      className="text-[#006FBF] font-bold underline"
                    >
                      Marks Entry
                    </Link>{' '}
                    to automatically generate official report cards.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: PRINTABLE OFFICIAL KENYAN SCHOOL REPORT CARD / TRANSCRIPT
         ===================================================================== */}
      {transcriptModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            {/* Action Bar (Hidden when printing) */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3.5 print:hidden">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-700">
                  Official Academic Transcript Preview — {selectedReport.studentName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#006FBF] px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#012E54]"
                >
                  <i className="fa-solid fa-print"></i> Print Official Transcript
                </button>
                <button
                  onClick={() => setTranscriptModalOpen(false)}
                  className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/60"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Printable Report Card Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-900">
              {/* School Banner */}
              <div className="border-b-2 border-[#012E54] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#006FBF]">
                    Republic of Kenya • Ministry of Education Standard Format
                  </p>
                  <h2 className="text-2xl font-black tracking-tight text-[#012E54] mt-0.5">
                    OFFICIAL ACADEMIC REPORT FORM
                  </h2>
                  <p className="text-xs font-semibold text-slate-600">
                    {selectedReport.examTitle} • {selectedReport.academicYearName} (
                    {selectedReport.term})
                  </p>
                </div>
                <div className="text-right font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block">
                    Mean Grade / Rubric
                  </span>
                  <span className="text-2xl font-black text-[#006FBF]">
                    {selectedReport.meanGrade} ({selectedReport.cbcRubric})
                  </span>
                </div>
              </div>

              {/* Candidate Biodata & Ranking Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Candidate Name
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedReport.studentName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Admission Number
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedReport.studentId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Class / Stream
                  </span>
                  <span className="font-bold text-slate-800">{selectedReport.gradeStream}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Class Position / Rank
                  </span>
                  <span className="font-mono font-extrabold text-[#006FBF]">
                    Position {selectedReport.streamRank} out of {selectedReport.streamOutOf}
                  </span>
                </div>
              </div>

              {/* Subject-by-Subject Breakdown Table */}
              <div className="rounded-xl border border-slate-300 overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#012E54] text-white text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Code & Subject</th>
                      <th className="py-3 px-3 text-center">Marks</th>
                      <th className="py-3 px-3 text-center">%</th>
                      <th className="py-3 px-3 text-center">KNEC Grade</th>
                      <th className="py-3 px-3 text-center">Pts</th>
                      <th className="py-3 px-3 text-center">CBC Rubric</th>
                      <th className="py-3 px-4">Subject Teacher Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedReport.subjectBreakdown.map((sub) => (
                      <tr key={sub.resultId} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          <span className="font-mono text-slate-400 mr-2">{sub.subjectCode}</span>
                          {sub.subjectName}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold">
                          {sub.marksObtained} / {sub.totalMarks}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                          {sub.percentage}%
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-extrabold text-[#006FBF]">
                          {sub.knecGrade}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                          {sub.knecPoints}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                          {sub.cbcRubric}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 italic">{sub.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-xs">
                      <td className="py-3 px-4">
                        AGGREGATE SUMMARY ({selectedReport.subjectsCount} Subjects)
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        {selectedReport.totalMarksObtained} / {selectedReport.totalMaxMarks}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-[#006FBF]">
                        {selectedReport.meanPercentage}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-purple-700">
                        {selectedReport.meanGrade}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        {selectedReport.meanKnecPoints}
                      </td>
                      <td className="py-3 px-3 text-center text-emerald-800">
                        {selectedReport.cbcRubric} ({selectedReport.cbcLabel})
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        Overall Rank: #{selectedReport.overallRank} / {selectedReport.overallOutOf}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Remarks & Endorsement Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Class Teacher's Remarks
                  </span>
                  <p className="text-slate-800 font-medium italic">
                    "{selectedReport.classTeacherRemarks}"
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Principal's / Headteacher's Endorsement
                  </span>
                  <p className="text-slate-800 font-medium italic">
                    "{selectedReport.principalRemarks}"
                  </p>
                </div>
              </div>

              {/* Footer Attendance & Signature Line */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs text-slate-600">
                <div>
                  <strong>Term Attendance:</strong> {selectedReport.attendanceDaysPresent} /{' '}
                  {selectedReport.attendanceTotalDays} Days
                </div>
                <div>
                  <strong>Next Term Opens:</strong> {selectedReport.nextTermBegins}
                </div>
                <div className="text-right">
                  <strong>Official Stamp & Signature:</strong> ______________________
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: EDIT CLASS TEACHER & PRINCIPAL REMARKS
         ===================================================================== */}
      {endorseModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Endorse Official Report Card — {selectedReport.studentName}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Mean: {selectedReport.meanPercentage}% ({selectedReport.meanGrade} /{' '}
                  {selectedReport.cbcRubric})
                </p>
              </div>
              <button
                onClick={() => setEndorseModalOpen(false)}
                className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSaveEndorsement} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Class Teacher's Remarks
                </label>
                <textarea
                  rows={2}
                  required
                  value={endorseForm.classTeacherRemarks}
                  onChange={(e) =>
                    setEndorseForm({ ...endorseForm, classTeacherRemarks: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 resize-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Principal's Remarks
                </label>
                <textarea
                  rows={2}
                  required
                  value={endorseForm.principalRemarks}
                  onChange={(e) =>
                    setEndorseForm({ ...endorseForm, principalRemarks: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Days Present</label>
                  <input
                    type="number"
                    value={endorseForm.attendanceDaysPresent}
                    onChange={(e) =>
                      setEndorseForm({
                        ...endorseForm,
                        attendanceDaysPresent: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Term Days</label>
                  <input
                    type="number"
                    value={endorseForm.attendanceTotalDays}
                    onChange={(e) =>
                      setEndorseForm({
                        ...endorseForm,
                        attendanceTotalDays: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={endorseForm.status}
                    onChange={(e) =>
                      setEndorseForm({ ...endorseForm, status: e.target.value as any })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-semibold"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Withheld">Withheld</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEndorseModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl px-5 py-2 font-semibold text-white shadow-sm disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
                >
                  {isSaving ? 'Saving...' : 'Save Endorsement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}