// apps/web/app/dashboard/reports/academics/exams/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

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
  status: 'Draft' | 'Published' | 'Withheld';
  subjectBreakdown: SubjectLineItem[];
}

interface CohortSummaryRow {
  cohortKey: string;
  examId: string;
  examTitle: string;
  academicYearName: string;
  term: string;
  gradeStream: string;
  candidatesCount: number;
  meanPercentage: number;
  meanKnecPoints: number;
  meanGrade: string;
  cbcRubric: string;
  passRate: number;
  qualityGradesRate: number; // C+ and above
  topStudentName: string;
  topStudentScore: number;
  status: string;
  students: ReportCardRecord[];
}

function getKnecGradeFromScore(pct: number): { grade: string; points: number; cbc: string } {
  if (pct >= 80) return { grade: 'A', points: 12, cbc: 'EE' };
  if (pct >= 75) return { grade: 'A-', points: 11, cbc: 'ME' };
  if (pct >= 70) return { grade: 'B+', points: 10, cbc: 'ME' };
  if (pct >= 65) return { grade: 'B', points: 9, cbc: 'ME' };
  if (pct >= 60) return { grade: 'B-', points: 8, cbc: 'ME' };
  if (pct >= 55) return { grade: 'C+', points: 7, cbc: 'ME' };
  if (pct >= 50) return { grade: 'C', points: 6, cbc: 'ME' };
  if (pct >= 45) return { grade: 'C-', points: 5, cbc: 'AE' };
  if (pct >= 40) return { grade: 'D+', points: 4, cbc: 'AE' };
  if (pct >= 35) return { grade: 'D', points: 3, cbc: 'AE' };
  if (pct >= 30) return { grade: 'D-', points: 2, cbc: 'AE' };
  return { grade: 'E', points: 1, cbc: 'BE' };
}

export default function ExamPerformanceReportPage() {
  const [reports, setReports] = useState<ReportCardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Filter States
  const [yearFilter, setYearFilter] = useState('All');
  const [termFilter, setTermFilter] = useState('All');
  const [examFilter, setExamFilter] = useState('All');
  const [streamFilter, setStreamFilter] = useState('All');
  const [distributionMode, setDistributionMode] = useState<'KNEC' | 'CBC'>('KNEC');

  // Drill-down Modal State
  const [selectedCohort, setSelectedCohort] = useState<CohortSummaryRow | null>(null);

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

  const fetchAnalyticsData = useCallback(async () => {
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
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Unique Filter Options derived from live database records
  const availableYears = useMemo(
    () => Array.from(new Set(reports.map((r) => r.academicYearName).filter(Boolean))),
    [reports]
  );
  const availableTerms = useMemo(
    () => Array.from(new Set(reports.map((r) => r.term).filter(Boolean))),
    [reports]
  );
  const availableExams = useMemo(
    () => Array.from(new Set(reports.map((r) => r.examTitle).filter(Boolean))),
    [reports]
  );
  const availableStreams = useMemo(
    () => Array.from(new Set(reports.map((r) => r.gradeStream).filter(Boolean))),
    [reports]
  );

  // Filtered candidate transcripts
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchYear = yearFilter === 'All' || r.academicYearName === yearFilter;
      const matchTerm = termFilter === 'All' || r.term === termFilter;
      const matchExam = examFilter === 'All' || r.examTitle === examFilter;
      const matchStream = streamFilter === 'All' || r.gradeStream === streamFilter;
      return matchYear && matchTerm && matchExam && matchStream;
    });
  }, [reports, yearFilter, termFilter, examFilter, streamFilter]);

  // Group filtered transcripts into Exam + Stream Cohorts for the Summary Table
  const cohortSummaries = useMemo<CohortSummaryRow[]>(() => {
    const map = new Map<string, ReportCardRecord[]>();

    for (const rep of filteredReports) {
      const key = `${rep.examId}__${rep.gradeStream}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(rep);
    }

    const rows: CohortSummaryRow[] = [];

    for (const [cohortKey, list] of map.entries()) {
      const sample = list[0];
      const candidatesCount = list.length;
      const meanPercentage =
        Math.round((list.reduce((s, r) => s + r.meanPercentage, 0) / candidatesCount) * 10) / 10;
      const meanKnecPoints =
        Math.round((list.reduce((s, r) => s + r.meanKnecPoints, 0) / candidatesCount) * 100) / 100;

      const evalGrade = getKnecGradeFromScore(meanPercentage);
      const passedCount = list.filter((r) => r.meanPercentage >= 50).length; // C & above
      const qualityCount = list.filter((r) => r.meanKnecPoints >= 7 || r.meanPercentage >= 55).length; // C+ & above

      const sorted = [...list].sort((a, b) => b.meanPercentage - a.meanPercentage);
      const top = sorted[0];

      rows.push({
        cohortKey,
        examId: sample.examId,
        examTitle: sample.examTitle,
        academicYearName: sample.academicYearName,
        term: sample.term,
        gradeStream: sample.gradeStream,
        candidatesCount,
        meanPercentage,
        meanKnecPoints,
        meanGrade: evalGrade.grade,
        cbcRubric: evalGrade.cbc,
        passRate: Math.round((passedCount / candidatesCount) * 1000) / 10,
        qualityGradesRate: Math.round((qualityCount / candidatesCount) * 1000) / 10,
        topStudentName: top ? top.studentName : 'N/A',
        topStudentScore: top ? top.meanPercentage : 0,
        status: list.every((r) => r.status === 'Published') ? 'Finalized' : 'In Progress',
        students: sorted,
      });
    }

    return rows.sort((a, b) => b.meanPercentage - a.meanPercentage);
  }, [filteredReports]);

  // Top 4 KPI Summary Metrics
  const kpiMetrics = useMemo(() => {
    const totalCandidates = filteredReports.length;
    if (totalCandidates === 0) {
      return {
        overallMeanPct: '0.0%',
        overallMeanSubtext: 'No exam results recorded yet',
        totalCandidates: 0,
        candidatesSubtext: 'Awaiting marks entry',
        qualityPassRate: '0.0%',
        qualitySubtext: 'C+ & Above (University Entry) / ME & EE',
        topStreamName: 'N/A',
        topStreamSubtext: 'Record scores to rank streams',
      };
    }

    const avgPct =
      Math.round(
        (filteredReports.reduce((s, r) => s + r.meanPercentage, 0) / totalCandidates) * 10
      ) / 10;
    const avgPts =
      Math.round(
        (filteredReports.reduce((s, r) => s + r.meanKnecPoints, 0) / totalCandidates) * 100
      ) / 100;
    const overallGrade = getKnecGradeFromScore(avgPct);

    const qualityCount = filteredReports.filter(
      (r) => r.meanKnecPoints >= 7 || r.meanPercentage >= 55
    ).length;
    const qualityRate = Math.round((qualityCount / totalCandidates) * 1000) / 10;

    // Best performing stream
    const streamGroups = new Map<string, { sumPct: number; sumPts: number; count: number }>();
    for (const r of filteredReports) {
      const st = r.gradeStream || 'General';
      const cur = streamGroups.get(st) || { sumPct: 0, sumPts: 0, count: 0 };
      cur.sumPct += r.meanPercentage;
      cur.sumPts += r.meanKnecPoints;
      cur.count += 1;
      streamGroups.set(st, cur);
    }

    let bestStream = 'N/A';
    let bestStreamMean = -1;
    let bestStreamPts = 0;

    for (const [streamName, agg] of streamGroups.entries()) {
      const m = agg.sumPct / agg.count;
      if (m > bestStreamMean) {
        bestStreamMean = m;
        bestStreamPts = agg.sumPts / agg.count;
        bestStream = streamName;
      }
    }

    const bestStreamGrade = getKnecGradeFromScore(bestStreamMean);

    return {
      overallMeanPct: `${avgPct}%`,
      overallMeanSubtext: `Mean Grade: ${overallGrade.grade} (${avgPts} pts • CBC ${overallGrade.cbc})`,
      totalCandidates,
      candidatesSubtext: `Across ${cohortSummaries.length} assessed class cohorts`,
      qualityPassRate: `${qualityRate}%`,
      qualitySubtext: `${qualityCount} of ${totalCandidates} candidates at C+ / ME & above`,
      topStreamName: bestStream,
      topStreamSubtext: `Mean: ${bestStreamMean.toFixed(1)}% • Grade ${bestStreamGrade.grade} (${bestStreamPts.toFixed(2)} pts)`,
    };
  }, [filteredReports, cohortSummaries]);

  // Live Grade Distribution Buckets
  const gradeDistribution = useMemo(() => {
    const total = filteredReports.length;
    const divisor = total > 0 ? total : 1;

    if (distributionMode === 'CBC') {
      const buckets = [
        { grade: 'EE (80-100%)', key: 'EE', count: 0, color: 'bg-purple-600' },
        { grade: 'ME (50-79%)', key: 'ME', count: 0, color: 'bg-emerald-600' },
        { grade: 'AE (30-49%)', key: 'AE', count: 0, color: 'bg-amber-500' },
        { grade: 'BE (<30%)', key: 'BE', count: 0, color: 'bg-rose-500' },
      ];
      for (const r of filteredReports) {
        const b = buckets.find((item) => item.key === r.cbcRubric);
        if (b) b.count += 1;
      }
      return buckets.map((b) => ({
        ...b,
        percentage: total > 0 ? Math.round((b.count / divisor) * 1000) / 10 : 0,
      }));
    }

    const knecBuckets = [
      { grade: 'A', count: 0, color: 'bg-emerald-600' },
      { grade: 'A-', count: 0, color: 'bg-emerald-500' },
      { grade: 'B+', count: 0, color: 'bg-blue-600' },
      { grade: 'B', count: 0, color: 'bg-blue-500' },
      { grade: 'B-', count: 0, color: 'bg-cyan-500' },
      { grade: 'C+', count: 0, color: 'bg-indigo-500' },
      { grade: 'C', count: 0, color: 'bg-amber-500' },
      { grade: 'C- & Below', count: 0, color: 'bg-rose-500' },
    ];

    for (const r of filteredReports) {
      const exact = knecBuckets.find((b) => b.grade === r.meanGrade);
      if (exact) {
        exact.count += 1;
      } else {
        knecBuckets[knecBuckets.length - 1].count += 1;
      }
    }

    return knecBuckets.map((b) => ({
      ...b,
      percentage: total > 0 ? Math.round((b.count / divisor) * 1000) / 10 : 0,
    }));
  }, [filteredReports, distributionMode]);

  const resetFilters = () => {
    setYearFilter('All');
    setTermFilter('All');
    setExamFilter('All');
    setStreamFilter('All');
  };

  const handleExportCSV = () => {
    const headers = [
      'Exam Series',
      'Academic Year',
      'Term',
      'Stream / Class',
      'Candidates Sat',
      'Mean Percentage',
      'Mean Grade',
      'Mean KNEC Points',
      'CBC Rubric',
      'Quality Pass Rate (C+ & Above)',
      'Top Candidate',
      'Top Score',
      'Status',
    ];

    const rows = cohortSummaries.map((c) => [
      `"${c.examTitle}"`,
      `"${c.academicYearName}"`,
      `"${c.term}"`,
      `"${c.gradeStream}"`,
      c.candidatesCount,
      `${c.meanPercentage}%`,
      `"${c.meanGrade}"`,
      c.meanKnecPoints,
      `"${c.cbcRubric}"`,
      `${c.qualityGradesRate}%`,
      `"${c.topStudentName}"`,
      `${c.topStudentScore}%`,
      `"${c.status}"`,
    ]);

    const csv =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute(
      'download',
      `elimix_exam_analytics_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute subject-level averages inside the selected cohort modal
  const cohortSubjectBreakdown = useMemo(() => {
    if (!selectedCohort) return [];
    const subMap = new Map<
      string,
      { name: string; code: string; sumPct: number; sumPts: number; count: number }
    >();

    for (const stu of selectedCohort.students) {
      for (const sub of stu.subjectBreakdown || []) {
        const cur = subMap.get(sub.subjectId) || {
          name: sub.subjectName,
          code: sub.subjectCode,
          sumPct: 0,
          sumPts: 0,
          count: 0,
        };
        cur.sumPct += sub.percentage;
        cur.sumPts += sub.knecPoints;
        cur.count += 1;
        subMap.set(sub.subjectId, cur);
      }
    }

    return Array.from(subMap.values())
      .map((item) => {
        const meanPct = Math.round((item.sumPct / item.count) * 10) / 10;
        const meanPts = Math.round((item.sumPts / item.count) * 100) / 100;
        const g = getKnecGradeFromScore(meanPct);
        return {
          ...item,
          meanPct,
          meanPts,
          meanGrade: g.grade,
          cbcRubric: g.cbc,
        };
      })
      .sort((a, b) => b.meanPct - a.meanPct);
  }, [selectedCohort]);

  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* BREADCRUMBS & HEADER */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/dashboard" className="hover:text-[#006FBF]">
            Dashboard
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
          <Link href="/dashboard/reports" className="hover:text-[#006FBF]">
            Reports & Analytics
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
          <span className="text-slate-900">Exam Performance</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Exam Performance Reports & KNEC / CBC Analytics
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Live analysis of examination series, class mean grades, KNEC 12-point indices, CBC rubrics, and top candidates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50"
            >
              <i className="fa-solid fa-file-excel mr-2 text-emerald-600" />
              Export CSV / Excel
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF]"
            >
              <i className="fa-solid fa-file-pdf mr-2" />
              Print / Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* LIVE KPI STATS GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Overall Mean Score
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {kpiMetrics.overallMeanPct}
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#006FBF] to-[#04B1D6] text-white shadow-inner">
              <i className="fa-solid fa-chart-line text-lg" />
            </div>
          </div>
          <p className="mt-3 text-xs font-medium text-[#006FBF]">{kpiMetrics.overallMeanSubtext}</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Assessed Candidates
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {kpiMetrics.totalCandidates}
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-inner">
              <i className="fa-solid fa-user-graduate text-lg" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">{kpiMetrics.candidatesSubtext}</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Quality Grades (C+ & Above)
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {kpiMetrics.qualityPassRate}
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-inner">
              <i className="fa-solid fa-award text-lg" />
            </div>
          </div>
          <p className="mt-3 text-xs text-emerald-700 font-medium">{kpiMetrics.qualitySubtext}</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Top Performing Stream
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 truncate max-w-[180px]">
                  {kpiMetrics.topStreamName}
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-inner">
              <i className="fa-solid fa-trophy text-lg" />
            </div>
          </div>
          <p className="mt-3 text-xs text-amber-700 font-medium">{kpiMetrics.topStreamSubtext}</p>
        </div>
      </div>

      {/* LIVE FILTERS BAR */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Academic Year
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-900 focus:border-[#006FBF] outline-none"
            >
              <option value="All">All Academic Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Term
            </label>
            <select
              value={termFilter}
              onChange={(e) => setTermFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-900 focus:border-[#006FBF] outline-none"
            >
              <option value="All">All Terms</option>
              {availableTerms.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Exam Series
            </label>
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-900 focus:border-[#006FBF] outline-none"
            >
              <option value="All">All Examinations</option>
              {availableExams.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Class / Stream
            </label>
            <select
              value={streamFilter}
              onChange={(e) => setStreamFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-900 focus:border-[#006FBF] outline-none"
            >
              <option value="All">All Classes / Streams</option>
              {availableStreams.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <i className="fa-solid fa-arrows-rotate mr-2 text-slate-500" /> Reset Filters
        </button>
      </div>

      {/* GRADE DISTRIBUTION BREAKDOWN (KNEC & CBC TOGGLE) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Overall Grade Distribution</h2>
            <p className="text-xs text-slate-500">
              Live examination performance distribution calculated from {filteredReports.length} candidate transcripts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDistributionMode('KNEC')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  distributionMode === 'KNEC'
                    ? 'bg-white text-[#012E54] shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                KNEC Scale (A – E)
              </button>
              <button
                type="button"
                onClick={() => setDistributionMode('CBC')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  distributionMode === 'CBC'
                    ? 'bg-white text-[#012E54] shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                CBC Rubric (EE – BE)
              </button>
            </div>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#006FBF] ring-1 ring-inset ring-blue-700/10">
              {filteredReports.length} Candidates Evaluated
            </span>
          </div>
        </div>

        <div
          className={`grid grid-cols-2 gap-3 ${
            distributionMode === 'CBC' ? 'sm:grid-cols-4' : 'sm:grid-cols-4 lg:grid-cols-8'
          }`}
        >
          {gradeDistribution.map((item) => (
            <div
              key={item.grade}
              className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center"
            >
              <span className="text-xs font-bold text-slate-600">{item.grade}</span>
              <span className="mt-1 text-lg font-extrabold text-slate-900">{item.count}</span>
              <span className="text-[11px] font-mono text-slate-400">{item.percentage}%</span>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full ${item.color} transition-all`}
                  style={{ width: `${Math.min(100, item.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXAM SERIES & STREAM PERFORMANCE SUMMARY TABLE */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Exam Series & Class Stream Performance Summary
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated cohort rankings, mean scores, and top candidates from PostgreSQL
            </p>
          </div>
          <Link
            href="/dashboard/exams/results"
            className="text-xs font-semibold text-[#006FBF] hover:underline"
          >
            Go to Marks Entry →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-slate-500">
                  Exam Series & Stream
                </th>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-slate-500">
                  Candidates
                </th>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-slate-500">
                  Mean Score & Grade
                </th>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-slate-500">
                  Mean Points
                </th>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-slate-500">
                  Pass Rate (≥50%)
                </th>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-slate-500">
                  Top Candidate
                </th>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <i className="fa-solid fa-spinner animate-spin mr-2" />
                    Calculating live examination analytics...
                  </td>
                </tr>
              ) : cohortSummaries.length > 0 ? (
                cohortSummaries.map((cohort) => (
                  <tr key={cohort.cohortKey} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#006FBF]">
                          <i className="fa-solid fa-chart-Simple text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{cohort.examTitle}</p>
                          <p className="text-xs font-semibold text-[#006FBF] mt-0.5">
                            {cohort.gradeStream} • {cohort.term} ({cohort.academicYearName})
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 font-mono font-bold text-slate-700">
                      {cohort.candidatesCount}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-extrabold text-slate-900">
                          {cohort.meanPercentage}%
                        </span>
                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700 border border-purple-200">
                          {cohort.meanGrade} ({cohort.cbcRubric})
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 font-mono font-bold text-slate-800">
                      {cohort.meanKnecPoints} / 12.0
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-bold text-emerald-600">{cohort.passRate}%</div>
                      <div className="text-[10px] text-slate-400">
                        {cohort.qualityGradesRate}% C+ & above
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">
                      {cohort.topStudentName}{' '}
                      <span className="font-mono text-xs text-[#006FBF]">
                        ({cohort.topStudentScore}%)
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                          cohort.status === 'Finalized'
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                            : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                        }`}
                      >
                        <i
                          className={`fa-solid ${
                            cohort.status === 'Finalized' ? 'fa-check' : 'fa-clock'
                          } mr-1 text-[10px]`}
                        />
                        {cohort.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCohort(cohort)}
                        className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-all"
                      >
                        <i className="fa-solid fa-chart-column mr-1.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No examination results match the selected filters. Record scores in{' '}
                    <Link
                      href="/dashboard/exams/results"
                      className="text-[#006FBF] font-bold underline"
                    >
                      Marks Entry
                    </Link>{' '}
                    to populate live analytics.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          MODAL: COHORT MERIT LIST & SUBJECT PERFORMANCE BREAKDOWN
         ===================================================================== */}
      {selectedCohort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {selectedCohort.examTitle} — {selectedCohort.gradeStream} Analysis
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedCohort.academicYearName} ({selectedCohort.term}) • Mean:{' '}
                  <strong className="text-[#006FBF]">
                    {selectedCohort.meanPercentage}% ({selectedCohort.meanGrade} •{' '}
                    {selectedCohort.meanKnecPoints} pts)
                  </strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedCohort(null)}
                className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/60"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Subject Performance Breakdown */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Subject Mean Breakdown ({cohortSubjectBreakdown.length} Subjects)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cohortSubjectBreakdown.map((sub) => (
                    <div
                      key={sub.code}
                      className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/60 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{sub.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {sub.code} • {sub.count} candidates
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-sm font-extrabold text-[#006FBF] block">
                          {sub.meanPct}%
                        </span>
                        <span className="text-[10px] font-bold text-slate-600">
                          {sub.meanGrade} ({sub.meanPts}p)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cohort Merit List */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Class Merit Ranking ({selectedCohort.students.length} Candidates)
                </h4>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                      <tr>
                        <th className="py-2.5 px-4">Rank</th>
                        <th className="py-2.5 px-4">Candidate</th>
                        <th className="py-2.5 px-4">Subjects</th>
                        <th className="py-2.5 px-4">Total Marks</th>
                        <th className="py-2.5 px-4">Mean %</th>
                        <th className="py-2.5 px-4">Grade & Rubric</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedCohort.students.map((stu, idx) => (
                        <tr key={stu.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-mono font-bold text-[#012E54]">
                            #{idx + 1}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="font-bold text-slate-900">{stu.studentName}</span>
                            <span className="ml-2 font-mono text-[10px] text-slate-400">
                              {stu.studentId}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-mono">{stu.subjectsCount}</td>
                          <td className="py-2.5 px-4 font-mono font-semibold">
                            {stu.totalMarksObtained} / {stu.totalMaxMarks}
                          </td>
                          <td className="py-2.5 px-4 font-mono font-extrabold text-[#006FBF]">
                            {stu.meanPercentage}%
                          </td>
                          <td className="py-2.5 px-4 font-bold">
                            {stu.meanGrade} ({stu.cbcRubric})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-3.5 flex justify-between items-center">
              <Link
                href="/dashboard/exams/reports"
                className="text-xs font-bold text-[#006FBF] hover:underline"
              >
                Open Printable Individual Report Cards →
              </Link>
              <button
                onClick={() => setSelectedCohort(null)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}