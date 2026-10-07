'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for an Exam Result record
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

// Initial mock data for exam results
const initialResults: ExamResult[] = [
  {
    id: 'RES-001',
    studentId: 'STU-2026-014',
    studentName: 'Oliver Twist',
    examTitle: 'Term 3 Mid-Term Mathematics',
    subject: 'Algebra II',
    gradeStream: 'Grade 9 East',
    marksObtained: 88,
    totalMarks: 100,
    grade: 'A',
    status: 'Passed',
  },
  {
    id: 'RES-002',
    studentId: 'STU-2026-022',
    studentName: 'Charlotte Brontë',
    examTitle: 'Term 3 Mid-Term Mathematics',
    subject: 'Algebra II',
    gradeStream: 'Grade 9 East',
    marksObtained: 94,
    totalMarks: 100,
    grade: 'A+',
    status: 'Passed',
  },
  {
    id: 'RES-003',
    studentId: 'STU-2026-045',
    studentName: 'Arthur Conan Doyle',
    examTitle: 'General Science Quiz',
    subject: 'General Science',
    gradeStream: 'Grade 7 North',
    marksObtained: 42,
    totalMarks: 50,
    grade: 'B',
    status: 'Passed',
  },
  {
    id: 'RES-004',
    studentId: 'STU-2026-089',
    studentName: 'Jane Austen',
    examTitle: 'World History Mid-Term',
    subject: 'World History',
    gradeStream: 'Grade 8 South',
    marksObtained: 38,
    totalMarks: 100,
    grade: 'F',
    status: 'Failed',
  },
  {
    id: 'RES-005',
    studentId: 'STU-2026-102',
    studentName: 'H.G. Wells',
    examTitle: 'English Literature Essay',
    subject: 'English Literature',
    gradeStream: 'Grade 9 West',
    marksObtained: 72,
    totalMarks: 75,
    grade: 'A',
    status: 'Passed',
  },
];

export default function ExamResultsPage() {
  const [results, setResults] = useState<ExamResult[]>(initialResults);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Form State for Recording New Exam Result
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentId, setNewStudentId] = useState('STU-2026-150');
  const [newExamTitle, setNewExamTitle] = useState('Term 3 Mid-Term Mathematics');
  const [newSubject, setNewSubject] = useState('Algebra II');
  const [newGradeStream, setNewGradeStream] = useState('Grade 9 East');
  const [newMarksObtained, setNewMarksObtained] = useState<number>(85);
  const [newTotalMarks, setNewTotalMarks] = useState<number>(100);
  const [newGrade, setNewGrade] = useState<ExamResult['grade']>('A');
  const [newStatus, setNewStatus] = useState<ExamResult['status']>('Passed');

  // Filter logic based on search, status, and letter grade
  const filteredResults = results.filter((res) => {
    const matchesSearch =
      res.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || res.status === statusFilter;
    const matchesGrade = gradeFilter === 'All' || res.grade === gradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: ExamResult['status']) => {
    switch (status) {
      case 'Passed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Pending Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Helper for letter grade styling
  const getGradeBadge = (grade: ExamResult['grade']) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'B':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'C':
      case 'D':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'F':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateResult = (e: React.FormEvent) => {
    e.preventDefault();

    const newResult: ExamResult = {
      id: `RES-0${results.length + 1}`,
      studentId: newStudentId || `STU-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentName: newStudentName,
      examTitle: newExamTitle,
      subject: newSubject,
      gradeStream: newGradeStream,
      marksObtained: Number(newMarksObtained) || 80,
      totalMarks: Number(newTotalMarks) || 100,
      grade: newGrade,
      status: newStatus,
    };

    setResults([newResult, ...results]);

    // Reset form inputs
    setNewStudentName('');
    setNewMarksObtained(85);

    setSuccessBanner('New examination result successfully recorded and published.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Examination Results & Grading Analysis
          </h1>
          <p className="text-sm text-slate-500">
            Review student score records, grade distributions, percentage metrics, and report card logs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/exams"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-file-lines mr-2 text-xs text-blue-600"></i> All Exams
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Record New Score
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <i className="fa-solid fa-circle-check text-emerald-600 mr-2 text-base"></i>
            <span>{successBanner}</span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Results Recorded</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-graduation-cap text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{results.length + 707}</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Term 3 Assessment Cycle</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Pass Rate</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">91.4%</p>
          <span className="text-xs text-emerald-600 font-medium">Passing threshold &ge; 50%</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Class Average Score</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-chart-pie text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">76.8%</p>
          <span className="text-xs text-purple-600 font-medium">Grade B campus average</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Grades</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {results.filter(r => r.status === 'Pending Review').length + 15}
          </p>
          <span className="text-xs text-amber-600 font-medium">Awaiting teacher verification</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search student name, ID, exam title, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Grade Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Letter Grade:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Grades</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exam Results Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student Name / ID</th>
                <th className="py-3 px-4">Exam & Subject</th>
                <th className="py-3 px-4">Stream</th>
                <th className="py-3 px-4">Marks Obtained</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredResults.length > 0 ? (
                filteredResults.map((res) => {
                  const percentage = Math.round((res.marksObtained / res.totalMarks) * 100);
                  return (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{res.studentName}</div>
                        <div className="text-xs text-slate-500 font-mono">{res.studentId}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-900 font-medium text-xs">{res.examTitle}</div>
                        <div className="text-xs text-slate-500">{res.subject}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">{res.gradeStream}</td>
                      <td className="py-3.5 px-4 text-slate-800 font-mono text-xs font-medium">
                        {res.marksObtained} / {res.totalMarks}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-mono text-xs font-semibold">
                        {percentage}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getGradeBadge(res.grade)}`}>
                          {res.grade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(res.status)}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                          Edit Score
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-sm">
                    No matching examination results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Score Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Record New Exam Result</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateResult} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g. Mary Shelley"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    placeholder="e.g. STU-2026-150"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Examination Title
                </label>
                <input
                  type="text"
                  required
                  value={newExamTitle}
                  onChange={(e) => setNewExamTitle(e.target.value)}
                  placeholder="e.g. Term 3 Mid-Term Mathematics"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Algebra II">Algebra II</option>
                    <option value="General Science">General Science</option>
                    <option value="World History">World History</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Physics">Physics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Grade Stream
                  </label>
                  <select
                    value={newGradeStream}
                    onChange={(e) => setNewGradeStream(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Grade 7 North">Grade 7 North</option>
                    <option value="Grade 8 South">Grade 8 South</option>
                    <option value="Grade 9 East">Grade 9 East</option>
                    <option value="Grade 9 West">Grade 9 West</option>
                    <option value="Grade 10 North">Grade 10 North</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Marks Obtained
                  </label>
                  <input
                    type="number"
                    required
                    value={newMarksObtained}
                    onChange={(e) => setNewMarksObtained(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    required
                    value={newTotalMarks}
                    onChange={(e) => setNewTotalMarks(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Letter Grade
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as ExamResult['grade'])}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ExamResult['status'])}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  Save & Publish Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}