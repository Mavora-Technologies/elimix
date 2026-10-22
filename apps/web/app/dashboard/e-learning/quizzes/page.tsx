// apps/web/app/dashboard/e-learning/quizzes/page.tsx
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

interface QuizItem {
  id: string;
  title: string;
  instructions?: string;
  courseId?: string;
  courseTitle?: string;
  subject: string;
  subjectId?: string;
  instructor: string;
  teacherId?: string;
  streamId?: string;
  streamName?: string;
  questionsCount: number;
  totalPoints?: number;
  timeLimitMinutes: number;
  passingScore?: number;
  submissionsCount?: number;
  averageScoreNumeric?: number | null;
  averageScore: string;
  status: 'Active' | 'Draft' | 'Closed';
}

interface QuizQuestion {
  id: string;
  quizId: string;
  questionNumber: number;
  questionText: string;
  questionType: 'MCQ' | 'TrueFalse';
  options: string[];
  correctAnswer: string;
  points: number;
  explanation?: string | null;
}

interface QuizAttempt {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  earnedPoints: number;
  totalPoints: number;
  scorePercentage: number;
  passed: 'Pass' | 'Fail';
  submittedAt: string;
}

export default function ELearningQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Create / Edit Quiz Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizItem | null>(null);

  // Question Bank & Auto-Marking Desk Modal
  const [builderModalOpen, setBuilderModalOpen] = useState(false);
  const [builderTab, setBuilderTab] = useState<'questions' | 'test_quiz' | 'attempts'>('questions');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Question Builder Form
  const [questionType, setQuestionType] = useState<'MCQ' | 'TrueFalse'>('MCQ');
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questionPoints, setQuestionPoints] = useState(2);
  const [explanation, setExplanation] = useState('');
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);

  // Live Quiz Auto-Grader Test State
  const [attemptStudentId, setAttemptStudentId] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [lastGradedResult, setLastGradedResult] = useState<QuizAttempt | null>(null);
  const [isSubmittingAttempt, setIsSubmittingAttempt] = useState(false);

  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    subjectId: '',
    teacherId: '',
    streamId: '',
    timeLimitMinutes: 30,
    passingScore: 50,
    instructions: '',
    status: 'Active' as 'Active' | 'Draft' | 'Closed',
  });

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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = getHeaders();
      const [qizRes, crsRes, subRes, teachRes, structRes, stuRes] = await Promise.all([
        fetch(`${API_BASE_URL}/e-learning/quizzes`, { headers }),
        fetch(`${API_BASE_URL}/e-learning/courses`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/academics/subjects`, { headers }),
        fetch(`${API_BASE_URL}/teachers`, { headers }),
        fetch(`${API_BASE_URL}/academics/structure`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/students`, { headers }).catch(() => null),
      ]);

      if (qizRes.ok) setQuizzes((await qizRes.json()).data || []);
      if (crsRes && crsRes.ok) setCourses((await crsRes.json()).data || []);
      if (subRes.ok) setSubjects((await subRes.json()).data || []);
      if (teachRes.ok) setTeachers((await teachRes.json()).data || []);
      if (structRes && structRes.ok) {
        const stJson = await structRes.json();
        setStreams(stJson.data?.streams || []);
      }
      if (stuRes && stuRes.ok) {
        const sJson = await stuRes.json();
        setStudents(Array.isArray(sJson.data) ? sJson.data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- CREATE / EDIT QUIZ ---
  const openCreateModal = () => {
    setIsEditingQuiz(false);
    setSelectedQuiz(null);
    setFormError(null);
    setFormData({
      title: '',
      courseId: '',
      subjectId: '',
      teacherId: '',
      streamId: '',
      timeLimitMinutes: 30,
      passingScore: 50,
      instructions: '',
      status: 'Active',
    });
    setCreateModalOpen(true);
  };

  const openEditModal = (quiz: QuizItem) => {
    setIsEditingQuiz(true);
    setSelectedQuiz(quiz);
    setFormError(null);
    setFormData({
      title: quiz.title,
      courseId: quiz.courseId || '',
      subjectId: quiz.subjectId || '',
      teacherId: quiz.teacherId || '',
      streamId: quiz.streamId || '',
      timeLimitMinutes: quiz.timeLimitMinutes || 30,
      passingScore: quiz.passingScore || 50,
      instructions: quiz.instructions || '',
      status: quiz.status,
    });
    setCreateModalOpen(true);
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const url = isEditingQuiz
        ? `${API_BASE_URL}/e-learning/quizzes/${selectedQuiz?.id}`
        : `${API_BASE_URL}/e-learning/quizzes`;

      const res = await fetch(url, {
        method: isEditingQuiz ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to save quiz');

      await fetchData();
      setSuccessBanner(
        isEditingQuiz
          ? 'Quiz updated successfully.'
          : 'New online quiz created. Click "Manage Questions" to add auto-marked questions!'
      );
      setCreateModalOpen(false);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz and all its questions?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/e-learning/quizzes/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchData();
        setSuccessBanner('Quiz deleted successfully.');
        setTimeout(() => setSuccessBanner(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- QUESTION BANK & AUTO-MARKING DESK ---
  const openQuestionBuilder = async (
    quiz: QuizItem,
    initialTab: 'questions' | 'test_quiz' | 'attempts' = 'questions'
  ) => {
    setSelectedQuiz(quiz);
    setBuilderTab(initialTab);
    setBuilderModalOpen(true);
    setIsLoadingDetails(true);
    setFormError(null);
    setLastGradedResult(null);
    setSelectedAnswers({});

    try {
      const res = await fetch(`${API_BASE_URL}/e-learning/quizzes/${quiz.id}/details`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setQuizQuestions(json.data?.questions || []);
        setQuizAttempts(json.data?.attempts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz) return;

    const optionsList =
      questionType === 'TrueFalse'
        ? ['True', 'False']
        : [optionA, optionB, optionC, optionD].map((o) => o.trim()).filter(Boolean);

    if (optionsList.length < 2) {
      setFormError('Please provide at least 2 answer options.');
      return;
    }

    const answerToUse =
      correctAnswer && optionsList.includes(correctAnswer) ? correctAnswer : optionsList[0];

    setIsSavingQuestion(true);
    setFormError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/e-learning/quizzes/${selectedQuiz.id}/questions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          questionNumber: quizQuestions.length + 1,
          questionText,
          questionType,
          options: optionsList,
          correctAnswer: answerToUse,
          points: Number(questionPoints) || 1,
          explanation: explanation || null,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to add question');

      // Refresh details
      const detailsRes = await fetch(
        `${API_BASE_URL}/e-learning/quizzes/${selectedQuiz.id}/details`,
        { headers: getHeaders() }
      );
      if (detailsRes.ok) {
        const dJson = await detailsRes.json();
        setQuizQuestions(dJson.data?.questions || []);
      }

      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectAnswer('');
      setExplanation('');
      await fetchData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSavingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!selectedQuiz) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/e-learning/quizzes/${selectedQuiz.id}/questions/${questionId}`,
        {
          method: 'DELETE',
          headers: getHeaders(),
        }
      );
      if (res.ok) {
        setQuizQuestions((prev) => prev.filter((q) => q.id !== questionId));
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitAutoGradedAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz || !attemptStudentId) return;
    setIsSubmittingAttempt(true);
    setFormError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/e-learning/quizzes/${selectedQuiz.id}/attempts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          studentId: attemptStudentId,
          answers: selectedAnswers,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to auto-grade attempt');

      setLastGradedResult(json.data);

      const detailsRes = await fetch(
        `${API_BASE_URL}/e-learning/quizzes/${selectedQuiz.id}/details`,
        { headers: getHeaders() }
      );
      if (detailsRes.ok) {
        const dJson = await detailsRes.json();
        setQuizAttempts(dJson.data?.attempts || []);
      }
      await fetchData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmittingAttempt(false);
    }
  };

  // Filtered Quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || quiz.status === statusFilter;
      const matchesSubject = subjectFilter === 'All' || quiz.subject === subjectFilter;

      return matchesSearch && matchesStatus && matchesSubject;
    });
  }, [quizzes, searchQuery, statusFilter, subjectFilter]);

  const availableSubjectsFilter = Array.from(new Set(quizzes.map((q) => q.subject)));

  // Live KPI metrics
  const kpiStats = useMemo(() => {
    const totalQuizzes = quizzes.length;
    const totalSubmissions = quizzes.reduce((acc, q) => acc + (q.submissionsCount || 0), 0);
    const activeCount = quizzes.filter((q) => q.status === 'Active').length;

    const scoredQuizzes = quizzes.filter(
      (q) => q.averageScoreNumeric !== null && q.averageScoreNumeric !== undefined
    );
    const globalAvg =
      scoredQuizzes.length > 0
        ? (
            scoredQuizzes.reduce((acc, q) => acc + Number(q.averageScoreNumeric || 0), 0) /
            scoredQuizzes.length
          ).toFixed(1)
        : '0.0';

    return { totalQuizzes, totalSubmissions, activeCount, globalAvg };
  }, [quizzes]);

  const getStatusBadge = (status: QuizItem['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            E-Learning Quizzes & Auto-Marking
          </h1>
          <p className="text-sm text-slate-500">
            Build interactive question banks, configure instant auto-grading keys, and monitor live student scores.
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
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Create Quiz
          </button>
        </div>
      </div>

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
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Quizzes
            </p>
            <div className="rounded-xl bg-[#006FBF]/10 p-2 text-[#006FBF]">
              <i className="fa-solid fa-clipboard-question text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{kpiStats.totalQuizzes}</p>
          <span className="text-xs text-emerald-600 font-medium">Live PostgreSQL bank</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Auto-Graded Attempts
            </p>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{kpiStats.totalSubmissions}</p>
          <span className="text-xs text-emerald-600 font-medium">Scored instantly on submit</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average Score
            </p>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-chart-pie text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{kpiStats.globalAvg}%</p>
          <span className="text-xs text-purple-600 font-medium">Across completed attempts</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Quizzes
            </p>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-bolt text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{kpiStats.activeCount}</p>
          <span className="text-xs text-amber-600 font-medium">Open for learner attempts</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search quiz title, subject, or instructor..."
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
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#006FBF]"
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#006FBF]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quizzes Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Quiz Title / Course</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Instructor</th>
                <th className="py-3.5 px-4">Questions (Auto-Counted)</th>
                <th className="py-3.5 px-4">Time Limit</th>
                <th className="py-3.5 px-4">Avg Score / Attempts</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading quizzes...
                  </td>
                </tr>
              ) : filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{quiz.title}</div>
                      <div className="text-[11px] text-slate-500">
                        {quiz.courseTitle} • <span className="text-[#006FBF]">{quiz.streamName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">
                      {quiz.subject}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 text-xs font-medium">
                      {quiz.instructor}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => openQuestionBuilder(quiz, 'questions')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-bold text-[#006FBF] border border-sky-200 hover:bg-sky-100"
                      >
                        <i className="fa-solid fa-list-check text-[10px]"></i>
                        {quiz.questionsCount} Qns ({quiz.totalPoints || 0} pts)
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                      {quiz.timeLimitMinutes} mins
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-mono text-xs font-bold">
                        {quiz.averageScore}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {quiz.submissionsCount || 0} submissions
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                          quiz.status
                        )}`}
                      >
                        {quiz.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openQuestionBuilder(quiz, 'questions')}
                        className="rounded-lg bg-[#006FBF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#012E54] transition-colors shadow-sm"
                      >
                        Manage Questions
                      </button>
                      <button
                        onClick={() => openQuestionBuilder(quiz, 'test_quiz')}
                        className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        title="Take / Test Auto-Marking"
                      >
                        <i className="fa-solid fa-play mr-1 text-[10px]"></i>Test
                      </button>
                      <button
                        onClick={() => openEditModal(quiz)}
                        className="text-slate-500 hover:text-[#006FBF] px-2 py-1.5 rounded-lg hover:bg-slate-100 text-xs"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="text-rose-500 hover:text-rose-700 px-2 py-1.5 rounded-lg hover:bg-rose-50 text-xs"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No quizzes found in the database. Click <strong>Create Quiz</strong> to build an auto-marked assessment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: CREATE / EDIT QUIZ METADATA
         ===================================================================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {isEditingQuiz ? 'Edit Online Quiz' : 'Create New Online Quiz'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Questions and total points are auto-calculated as you add questions.
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSaveQuiz} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium">
                  {formError}
                </div>
              )}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Quadratic Equations Mid-Unit Checkpoint"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#006FBF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Subject *
                  </label>
                  <select
                    required
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="">Select subject...</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Instructor *
                  </label>
                  <select
                    required
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="">Select instructor...</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName ||
                          `${t.firstName || ''} ${t.lastName || ''}`.trim() ||
                          t.employeeNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Linked E-Learning Course
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="">Standalone Assessment</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Target Class / Stream
                  </label>
                  <select
                    value={formData.streamId}
                    onChange={(e) => setFormData({ ...formData, streamId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="">All Streams</option>
                    {streams.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Time Limit (Mins)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={300}
                    required
                    value={formData.timeLimitMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, timeLimitMinutes: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Pass Mark (%)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={formData.passingScore}
                    onChange={(e) =>
                      setFormData({ ...formData, passingScore: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Instructions / Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Provide guidance for students taking this assessment..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
                >
                  {isSubmitting ? 'Saving...' : isEditingQuiz ? 'Save Changes' : 'Publish Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: QUESTION BANK BUILDER & LIVE AUTO-MARKING DESK
         ===================================================================== */}
      {builderModalOpen && selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedQuiz.title}</h3>
                <p className="text-xs text-slate-500">
                  {selectedQuiz.subject} • {quizQuestions.length} Questions • Pass Mark:{' '}
                  {selectedQuiz.passingScore || 50}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBuilderTab('questions')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    builderTab === 'questions'
                      ? 'bg-[#006FBF] text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Question Bank ({quizQuestions.length})
                </button>
                <button
                  onClick={() => setBuilderTab('test_quiz')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    builderTab === 'test_quiz'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Take / Test Auto-Grader
                </button>
                <button
                  onClick={() => setBuilderTab('attempts')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    builderTab === 'attempts'
                      ? 'bg-[#012E54] text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Graded Results ({quizAttempts.length})
                </button>
                <button
                  onClick={() => setBuilderModalOpen(false)}
                  className="ml-2 h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/60"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* TAB 1: QUESTION BANK BUILDER */}
              {builderTab === 'questions' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 h-fit">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                      + Add Auto-Marked Question
                    </h4>
                    <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">
                            Question Type
                          </label>
                          <select
                            value={questionType}
                            onChange={(e) => {
                              const val = e.target.value as 'MCQ' | 'TrueFalse';
                              setQuestionType(val);
                              if (val === 'TrueFalse') setCorrectAnswer('True');
                            }}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
                          >
                            <option value="MCQ">Multiple Choice (4 Options)</option>
                            <option value="TrueFalse">True / False</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">
                            Points / Marks
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={questionPoints}
                            onChange={(e) => setQuestionPoints(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">
                          Question Prompt *
                        </label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Type the question here..."
                          value={questionText}
                          onChange={(e) => setQuestionText(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white p-2.5"
                        />
                      </div>

                      {questionType === 'MCQ' ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            required
                            placeholder="Option A *"
                            value={optionA}
                            onChange={(e) => setOptionA(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Option B *"
                            value={optionB}
                            onChange={(e) => setOptionB(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5"
                          />
                          <input
                            type="text"
                            placeholder="Option C"
                            value={optionC}
                            onChange={(e) => setOptionC(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5"
                          />
                          <input
                            type="text"
                            placeholder="Option D"
                            value={optionD}
                            onChange={(e) => setOptionD(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5"
                          />
                          <div>
                            <label className="block font-semibold text-emerald-700 mb-1">
                              Correct Answer (Auto-Marking Key) *
                            </label>
                            <select
                              required
                              value={correctAnswer}
                              onChange={(e) => setCorrectAnswer(e.target.value)}
                              className="w-full rounded-xl border border-emerald-300 bg-emerald-50/50 px-3 py-2 font-semibold text-emerald-900"
                            >
                              <option value="">-- Choose Correct Option --</option>
                              {[optionA, optionB, optionC, optionD]
                                .map((o) => o.trim())
                                .filter(Boolean)
                                .map((opt, idx) => (
                                  <option key={idx} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block font-semibold text-emerald-700 mb-1">
                            Correct Answer (Auto-Marking Key) *
                          </label>
                          <select
                            value={correctAnswer || 'True'}
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                            className="w-full rounded-xl border border-emerald-300 bg-emerald-50/50 px-3 py-2 font-semibold text-emerald-900"
                          >
                            <option value="True">True</option>
                            <option value="False">False</option>
                          </select>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSavingQuestion}
                        className="w-full rounded-xl py-2.5 text-xs font-bold text-white shadow-sm disabled:opacity-50"
                        style={{
                          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                        }}
                      >
                        {isSavingQuestion ? 'Saving Question...' : 'Add Question to Bank'}
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Configured Questions ({quizQuestions.length})
                    </h4>
                    {isLoadingDetails ? (
                      <div className="py-12 text-center text-xs text-slate-400">
                        Loading questions...
                      </div>
                    ) : quizQuestions.length > 0 ? (
                      quizQuestions.map((q, i) => (
                        <div
                          key={q.id}
                          className="rounded-xl border border-slate-200 p-4 bg-white space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-[#006FBF]">
                              Q{i + 1}. {q.questionText}{' '}
                              <span className="text-slate-400 font-mono">({q.points} pts)</span>
                            </span>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="text-slate-400 hover:text-rose-600 text-xs"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 text-xs">
                            {(q.options || []).map((opt, idx) => (
                              <div
                                key={idx}
                                className={`px-2.5 py-1.5 rounded-lg border ${
                                  opt === q.correctAnswer
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                                    : 'bg-slate-50 border-slate-200 text-slate-600'
                                }`}
                              >
                                {opt === q.correctAnswer && (
                                  <i className="fa-solid fa-check mr-1.5 text-emerald-600"></i>
                                )}
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-xs text-slate-400">
                        No questions in this quiz yet. Use the form on the left to add Question 1.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: TAKE / TEST LIVE AUTO-GRADER */}
              {builderTab === 'test_quiz' && (
                <div className="max-w-2xl mx-auto space-y-5">
                  {lastGradedResult && (
                    <div
                      className={`p-5 rounded-2xl border ${
                        lastGradedResult.passed === 'Pass'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider">
                            Instant Auto-Grading Result: {lastGradedResult.passed}
                          </p>
                          <h4 className="text-2xl font-extrabold mt-1">
                            {lastGradedResult.scorePercentage}% ({lastGradedResult.earnedPoints} /{' '}
                            {lastGradedResult.totalPoints} Points)
                          </h4>
                        </div>
                        <button
                          onClick={() => setBuilderTab('attempts')}
                          className="px-3 py-1.5 rounded-xl bg-white text-xs font-bold shadow-xs text-slate-800"
                        >
                          View All Submissions →
                        </button>
                      </div>
                    </div>
                  )}

                  {quizQuestions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                      Add at least one question in the <strong>Question Bank</strong> tab before testing auto-grading.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitAutoGradedAttempt} className="space-y-4 text-xs">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="block font-bold uppercase text-slate-600 mb-1">
                          Select Learner Taking Quiz *
                        </label>
                        <select
                          required
                          value={attemptStudentId}
                          onChange={(e) => setAttemptStudentId(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold"
                        >
                          <option value="">-- Choose Student from DB --</option>
                          {students.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.firstName} {st.lastName} ({st.admissionNumber})
                            </option>
                          ))}
                        </select>
                      </div>

                      {quizQuestions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="rounded-xl border border-slate-200 p-4 bg-white space-y-2.5"
                        >
                          <div className="font-bold text-sm text-slate-900">
                            {idx + 1}. {q.questionText}{' '}
                            <span className="text-xs font-mono text-slate-400">
                              ({q.points} pts)
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(q.options || []).map((opt, oIdx) => (
                              <label
                                key={oIdx}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                                  selectedAnswers[q.id] === opt
                                    ? 'bg-sky-50 border-[#006FBF] font-bold text-[#012E54]'
                                    : 'border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  value={opt}
                                  checked={selectedAnswers[q.id] === opt}
                                  onChange={() =>
                                    setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt }))
                                  }
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        type="submit"
                        disabled={isSubmittingAttempt}
                        className="w-full rounded-xl py-3 text-sm font-bold text-white shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                        }}
                      >
                        {isSubmittingAttempt
                          ? 'Auto-Grading Submission...'
                          : 'Submit & Run Instant Auto-Marking'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: AUTO-GRADED ATTEMPTS LOG */}
              {builderTab === 'attempts' && (
                <div>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Points Earned</th>
                        <th className="py-3 px-4">Percentage</th>
                        <th className="py-3 px-4">Verdict</th>
                        <th className="py-3 px-4">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {quizAttempts.length > 0 ? (
                        quizAttempts.map((att) => (
                          <tr key={att.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{att.studentName}</div>
                              <div className="text-[10px] font-mono text-slate-400">
                                {att.admissionNumber}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono font-semibold">
                              {att.earnedPoints} / {att.totalPoints} pts
                            </td>
                            <td className="py-3 px-4 font-mono font-extrabold text-slate-900">
                              {att.scorePercentage}%
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  att.passed === 'Pass'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {att.passed}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-500">
                              {new Date(att.submittedAt).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            No quiz attempts submitted yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}