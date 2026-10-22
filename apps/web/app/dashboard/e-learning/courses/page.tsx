// apps/web/app/dashboard/e-learning/courses/page.tsx
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

interface CourseItem {
  id: string;
  title: string;
  description?: string;
  subject: string;
  subjectId?: string;
  instructor: string;
  teacherId?: string;
  streamId?: string;
  streamName?: string;
  enrolledStudents: number;
  modulesCount: number;
  totalDurationMinutes?: number;
  status: 'Active' | 'Draft' | 'Archived';
}

interface CourseLesson {
  id: string;
  courseId: string;
  chapterNumber: number;
  title: string;
  contentType: 'Video' | 'PDF / Document' | 'Study Notes' | 'Live Session';
  contentUrl?: string | null;
  notes?: string | null;
  durationMinutes: number;
}

export default function ELearningCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Create / Edit Course Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  // Interactive Lesson Builder Modal State
  const [lessonBuilderOpen, setLessonBuilderOpen] = useState(false);
  const [courseLessons, setCourseLessons] = useState<CourseLesson[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [isSavingLesson, setIsSavingLesson] = useState(false);

  const [lessonForm, setLessonForm] = useState({
    chapterNumber: 1,
    title: '',
    contentType: 'Video' as CourseLesson['contentType'],
    contentUrl: '',
    notes: '',
    durationMinutes: 40,
  });

  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    teacherId: '',
    streamId: '',
    description: '',
    status: 'Active' as 'Active' | 'Draft' | 'Archived',
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
      const [crsRes, subRes, teachRes, streamsRes, structRes] = await Promise.all([
        fetch(`${API_BASE_URL}/e-learning/courses`, { headers }),
        fetch(`${API_BASE_URL}/academics/subjects`, { headers }),
        fetch(`${API_BASE_URL}/teachers`, { headers }),
        fetch(`${API_BASE_URL}/academics/timetables/streams`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/academics/structure`, { headers }).catch(() => null),
      ]);

      if (crsRes.ok) setCourses((await crsRes.json()).data || []);
      if (subRes.ok) setSubjects((await subRes.json()).data || []);
      if (teachRes.ok) setTeachers((await teachRes.json()).data || []);

      if (streamsRes && streamsRes.ok) {
        const sJson = await streamsRes.json();
        if (Array.isArray(sJson.data) && sJson.data.length > 0) {
          setStreams(sJson.data);
        } else if (structRes && structRes.ok) {
          const stJson = await structRes.json();
          setStreams(stJson.data?.streams || []);
        }
      } else if (structRes && structRes.ok) {
        const stJson = await structRes.json();
        setStreams(stJson.data?.streams || []);
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

  // --- COURSE CREATE / EDIT ---
  const openCreateCourseModal = () => {
    setIsEditingCourse(false);
    setSelectedCourse(null);
    setFormError(null);
    setFormData({
      title: '',
      subjectId: '',
      teacherId: '',
      streamId: '',
      description: '',
      status: 'Active',
    });
    setCreateModalOpen(true);
  };

  const openEditCourseModal = (course: CourseItem) => {
    setIsEditingCourse(true);
    setSelectedCourse(course);
    setFormError(null);
    setFormData({
      title: course.title,
      subjectId: course.subjectId || '',
      teacherId: course.teacherId || '',
      streamId: course.streamId || '',
      description: course.description || '',
      status: course.status,
    });
    setCreateModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const url = isEditingCourse
        ? `${API_BASE_URL}/e-learning/courses/${selectedCourse?.id}`
        : `${API_BASE_URL}/e-learning/courses`;

      const res = await fetch(url, {
        method: isEditingCourse ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to save course');

      await fetchData();
      setSuccessBanner(
        isEditingCourse
          ? 'E-learning course updated successfully.'
          : 'New e-learning course created. Click "Manage Lessons" to add chapters!'
      );
      setCreateModalOpen(false);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course and all its lessons?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/e-learning/courses/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchData();
        setSuccessBanner('Course deleted successfully.');
        setTimeout(() => setSuccessBanner(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- INTERACTIVE LESSON BUILDER ---
  const openLessonBuilder = async (course: CourseItem) => {
    setSelectedCourse(course);
    setLessonBuilderOpen(true);
    setIsLoadingLessons(true);
    setFormError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/e-learning/courses/${course.id}/lessons`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        const list: CourseLesson[] = json.data || [];
        setCourseLessons(list);
        setLessonForm({
          chapterNumber: list.length + 1,
          title: '',
          contentType: 'Video',
          contentUrl: '',
          notes: '',
          durationMinutes: 40,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLessons(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setIsSavingLesson(true);
    setFormError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/e-learning/courses/${selectedCourse.id}/lessons`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(lessonForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to add chapter/lesson');

      const updatedRes = await fetch(
        `${API_BASE_URL}/e-learning/courses/${selectedCourse.id}/lessons`,
        { headers: getHeaders() }
      );
      if (updatedRes.ok) {
        const uJson = await updatedRes.json();
        const list: CourseLesson[] = uJson.data || [];
        setCourseLessons(list);
        setLessonForm({
          chapterNumber: list.length + 1,
          title: '',
          contentType: 'Video',
          contentUrl: '',
          notes: '',
          durationMinutes: 40,
        });
      }
      await fetchData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!selectedCourse) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/e-learning/courses/${selectedCourse.id}/lessons/${lessonId}`,
        {
          method: 'DELETE',
          headers: getHeaders(),
        }
      );
      if (res.ok) {
        const remaining = courseLessons.filter((l) => l.id !== lessonId);
        setCourseLessons(remaining);
        setLessonForm((prev) => ({ ...prev, chapterNumber: remaining.length + 1 }));
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
      const matchesSubject = subjectFilter === 'All' || course.subject === subjectFilter;

      return matchesSearch && matchesStatus && matchesSubject;
    });
  }, [courses, searchQuery, statusFilter, subjectFilter]);

  const availableSubjectsFilter = Array.from(new Set(courses.map((c) => c.subject)));

  const getStatusBadge = (status: CourseItem['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Archived':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const totalLessonsAcrossCatalog = courses.reduce((sum, c) => sum + (c.modulesCount || 0), 0);

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            E-Learning Courses & Virtual Classes
          </h1>
          <p className="text-sm text-slate-500">
            Build online courses with auto-calculated chapters/lessons and class stream enrollments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/academics"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-book-open mr-2 text-xs text-[#006FBF]"></i> Academics Overview
          </Link>
          <button
            onClick={openCreateCourseModal}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Create Course
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
              Total Courses
            </p>
            <div className="rounded-xl bg-[#006FBF]/10 p-2 text-[#006FBF]">
              <i className="fa-solid fa-laptop-code text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{courses.length}</p>
          <span className="text-xs text-emerald-600 font-medium">Live database catalog</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Learners
            </p>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-users text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {courses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0)}
          </p>
          <span className="text-xs text-emerald-600 font-medium">
            Auto-calculated from streams
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Chapters & Lessons
            </p>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-layer-group text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalLessonsAcrossCatalog}</p>
          <span className="text-xs text-purple-600 font-medium">Published learning units</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Courses
            </p>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-circle-play text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {courses.filter((c) => c.status === 'Active').length}
          </p>
          <span className="text-xs text-amber-600 font-medium">
            {courses.filter((c) => c.status === 'Draft').length} in draft mode
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search course title, instructor, or subject..."
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
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Course Title / Class</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Lead Instructor</th>
                <th className="py-3.5 px-4">Enrolled Learners</th>
                <th className="py-3.5 px-4">Chapters / Lessons</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading e-learning courses...
                  </td>
                </tr>
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{course.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Target: <span className="font-semibold text-[#006FBF]">{course.streamName || 'All Streams'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">
                      {course.subject}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 text-xs font-medium">
                      {course.instructor}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-mono text-xs font-semibold">
                      {course.enrolledStudents} students
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => openLessonBuilder(course)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-bold text-[#006FBF] border border-sky-200 hover:bg-sky-100 transition-colors"
                      >
                        <i className="fa-solid fa-book-open-reader text-[10px]"></i>
                        {course.modulesCount} {course.modulesCount === 1 ? 'Lesson' : 'Lessons'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                          course.status
                        )}`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openLessonBuilder(course)}
                        className="rounded-lg bg-[#006FBF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#012E54] transition-colors shadow-sm"
                      >
                        <i className="fa-solid fa-list-ul mr-1.5 text-[10px]"></i>Manage Lessons
                      </button>
                      <button
                        onClick={() => openEditCourseModal(course)}
                        className="text-slate-600 hover:text-[#006FBF] font-medium text-xs px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Edit Course"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-rose-500 hover:text-rose-700 font-medium text-xs px-2 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Course"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No e-learning courses found. Click <strong>Create Course</strong> to publish your first online course.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: CREATE / EDIT E-LEARNING COURSE (NO MANUAL MODULES COUNT)
         ===================================================================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {isEditingCourse ? 'Edit E-Learning Course' : 'Create New E-Learning Course'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Chapters/lessons and enrolled students are calculated automatically.
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSaveCourse} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium">
                  <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                  {formError}
                </div>
              )}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Form 3 Algebra & Quadratic Functions"
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
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#006FBF]"
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
                    Lead Instructor *
                  </label>
                  <select
                    required
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#006FBF]"
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
                    Target Class / Stream
                  </label>
                  <select
                    value={formData.streamId}
                    onChange={(e) => setFormData({ ...formData, streamId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#006FBF]"
                  >
                    <option value="">All Streams (School-Wide)</option>
                    {streams.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#006FBF]"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Course Description & Learning Outcomes *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize learning outcomes, prerequisite skills, and syllabus outline..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:border-[#006FBF] resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
                >
                  {isSubmitting
                    ? 'Saving...'
                    : isEditingCourse
                    ? 'Save Changes'
                    : 'Publish Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: INTERACTIVE CHAPTERS & LESSONS BUILDER
         ===================================================================== */}
      {lessonBuilderOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Chapters & Lessons Builder — {selectedCourse.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedCourse.subject} • Instructor: {selectedCourse.instructor} •{' '}
                  <span className="font-semibold text-[#006FBF]">
                    {courseLessons.length} {courseLessons.length === 1 ? 'Chapter/Lesson' : 'Chapters/Lessons'} Auto-Counted
                  </span>
                </p>
              </div>
              <button
                onClick={() => setLessonBuilderOpen(false)}
                className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"
              >
                <i className="fa-solid fa-xmark text-base"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Add New Chapter / Lesson Form */}
              <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 h-fit">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                  + Add Chapter / Lesson
                </h4>
                {formError && (
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-medium mb-3">
                    {formError}
                  </div>
                )}
                <form onSubmit={handleAddLesson} className="space-y-3 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Chapter #</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={lessonForm.chapterNumber}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, chapterNumber: Number(e.target.value) })
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-600 mb-1">
                        Content Format *
                      </label>
                      <select
                        value={lessonForm.contentType}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, contentType: e.target.value as any })
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                      >
                        <option value="Video">Video Lecture</option>
                        <option value="PDF / Document">PDF / Slide Deck</option>
                        <option value="Study Notes">Interactive Study Notes</option>
                        <option value="Live Session">Live Virtual Class Link</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Chapter / Lesson Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Solving Quadratic Equations by Factoring"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-600 mb-1">
                        Resource / Video URL (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={lessonForm.contentUrl}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, contentUrl: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">
                        Duration (Min)
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={300}
                        value={lessonForm.durationMinutes}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, durationMinutes: Number(e.target.value) })
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Lesson Summary / Study Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Key takeaways, formulas, or reading instructions..."
                      value={lessonForm.notes}
                      onChange={(e) => setLessonForm({ ...lessonForm, notes: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingLesson}
                    className="w-full rounded-xl py-2.5 text-xs font-bold text-white shadow-sm disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
                  >
                    {isSavingLesson ? 'Adding Lesson...' : 'Add Chapter / Lesson to Course'}
                  </button>
                </form>
              </div>

              {/* Right Column: Existing Chapters / Lessons List */}
              <div className="lg:col-span-7 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Course Syllabus ({courseLessons.length} Chapters / Lessons)
                </h4>

                {isLoadingLessons ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading syllabus...
                  </div>
                ) : courseLessons.length > 0 ? (
                  <div className="space-y-2.5">
                    {courseLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex items-start justify-between gap-3 hover:border-[#006FBF]/40 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-[#006FBF]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[#006FBF]">
                              Chapter {lesson.chapterNumber}
                            </span>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                              {lesson.contentType}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              <i className="fa-regular fa-clock mr-1"></i>
                              {lesson.durationMinutes} mins
                            </span>
                          </div>
                          <h5 className="font-bold text-slate-900 text-sm">{lesson.title}</h5>
                          {lesson.notes && (
                            <p className="text-xs text-slate-600">{lesson.notes}</p>
                          )}
                          {lesson.contentUrl && (
                            <a
                              href={lesson.contentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center text-[11px] font-semibold text-[#006FBF] hover:underline"
                            >
                              <i className="fa-solid fa-arrow-up-right-from-square mr-1 text-[9px]"></i>
                              Open Learning Resource
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Remove Lesson"
                        >
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-xs text-slate-400">
                    No chapters or lessons added to this course yet. Use the form on the left to add Chapter 1.
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-3.5 flex justify-end">
              <button
                onClick={() => setLessonBuilderOpen(false)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}