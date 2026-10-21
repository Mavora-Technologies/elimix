// apps/web/app/dashboard/academics/assignments/page.tsx
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

interface Assignment {
  id: string;
  title: string;
  subject: string;
  subjectId?: string;
  gradeStream: string;
  streamId?: string;
  teacherName: string;
  teacherId?: string;
  instructions?: string;
  dueDate: string;
  submittedCount?: number;
  gradedCount?: number;
  totalStudentsCount?: number;
  submissionProgress: string;
  status: 'Active' | 'Grading' | 'Closed' | 'Draft';
}

interface StudentSubmissionRow {
  studentId: string;
  admissionNumber: string;
  studentName: string;
  submissionId: string | null;
  submissionStatus: 'Pending' | 'Submitted' | 'Late' | 'Graded';
  score: number | null;
  remarks: string;
  submittedAt: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [gradingModalOpen, setGradingModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedAsn, setSelectedAsn] = useState<Assignment | null>(null);

  // Grading Roster State
  const [submissionsRoster, setSubmissionsRoster] = useState<StudentSubmissionRow[]>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);
  const [savingStudentId, setSavingStudentId] = useState<string | null>(null);

  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    teacherId: '',
    streamId: '',
    dueDate: '',
    instructions: '',
    status: 'Active',
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

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const headers = getHeaders();
      const [asnRes, subRes, teachRes, streamsRes, structRes] = await Promise.all([
        fetch(`${API_BASE_URL}/academics/assignments`, { headers }),
        fetch(`${API_BASE_URL}/academics/subjects`, { headers }),
        fetch(`${API_BASE_URL}/teachers`, { headers }),
        fetch(`${API_BASE_URL}/academics/timetables/streams`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/academics/structure`, { headers }).catch(() => null),
      ]);

      if (asnRes.ok) setAssignments((await asnRes.json()).data || []);
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
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  // --- ACTIONS ---
  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const url = isEditing
        ? `${API_BASE_URL}/academics/assignments/${selectedAsn?.id}`
        : `${API_BASE_URL}/academics/assignments`;

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        const errMsg =
          result.message ||
          result.errors?.[0]?.message ||
          'Submission failed. Please verify all fields.';
        throw new Error(errMsg);
      }

      await fetchPageData();
      setSuccessBanner(
        isEditing ? 'Assignment updated successfully.' : 'New assignment successfully published.'
      );
      setIsModalOpen(false);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAsn) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/academics/assignments/${selectedAsn.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete assignment');

      await fetchPageData();
      setIsDeleteModalOpen(false);
      setSuccessBanner('Assignment deleted.');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_BASE_URL}/academics/assignments/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      await fetchPageData();
      if (selectedAsn?.id === id) {
        setSelectedAsn({ ...selectedAsn, status: status as any });
      }
      setSuccessBanner(`Assignment marked as ${status}.`);
      setTimeout(() => setSuccessBanner(null), 3000);
    } catch (e) {}
  };

  // --- SUBMISSIONS & GRADING DESK ---
  const openGradingModal = async (asn: Assignment) => {
    setSelectedAsn(asn);
    setGradingModalOpen(true);
    setIsLoadingRoster(true);
    try {
      const res = await fetch(`${API_BASE_URL}/academics/assignments/${asn.id}/submissions`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setSubmissionsRoster(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRoster(false);
    }
  };

  const handleSaveStudentSubmission = async (row: StudentSubmissionRow) => {
    if (!selectedAsn) return;
    setSavingStudentId(row.studentId);
    try {
      const nextStatus =
        row.score !== null && row.score !== undefined && String(row.score) !== ''
          ? 'Graded'
          : row.submissionStatus === 'Pending'
          ? 'Submitted'
          : row.submissionStatus;

      const res = await fetch(
        `${API_BASE_URL}/academics/assignments/${selectedAsn.id}/submissions`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            studentId: row.studentId,
            submissionStatus: nextStatus,
            score: row.score !== null && String(row.score) !== '' ? Number(row.score) : null,
            remarks: row.remarks,
          }),
        }
      );

      if (res.ok) {
        setSubmissionsRoster((prev) =>
          prev.map((item) =>
            item.studentId === row.studentId
              ? { ...item, submissionStatus: nextStatus as any }
              : item
          )
        );
        await fetchPageData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingStudentId(null);
    }
  };

  // --- UI TRIGGERS ---
  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedAsn(null);
    setFormError(null);
    setFormData({
      title: '',
      subjectId: '',
      teacherId: '',
      streamId: '',
      dueDate: '',
      instructions: '',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (asn: Assignment) => {
    setIsEditing(true);
    setSelectedAsn(asn);
    setFormError(null);

    const subj = subjects.find((s) => s.id === asn.subjectId || s.name === asn.subject);
    const stream = streams.find((s) => s.id === asn.streamId || s.name === asn.gradeStream);
    const teach = teachers.find(
      (t) =>
        t.id === asn.teacherId ||
        `${t.firstName} ${t.lastName}`.trim() === asn.teacherName ||
        t.fullName === asn.teacherName
    );

    setFormData({
      title: asn.title,
      subjectId: asn.subjectId || (subj ? subj.id : ''),
      teacherId: asn.teacherId || (teach ? teach.id : ''),
      streamId: asn.streamId || (stream ? stream.id : ''),
      dueDate: asn.dueDate ? asn.dueDate.replace(' ', 'T') : '',
      instructions: asn.instructions || '',
      status: asn.status,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (asn: Assignment) => {
    setSelectedAsn(asn);
    setViewModalOpen(true);
  };

  const openDeletePrompt = (asn: Assignment) => {
    setSelectedAsn(asn);
    setFormError(null);
    setIsDeleteModalOpen(true);
  };

  const filteredAssignments = assignments.filter((asn) => {
    const matchesSearch =
      asn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asn.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asn.gradeStream.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || asn.status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || asn.subject === subjectFilter;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'Grading':
        return 'bg-[#006FBF]/10 text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20';
      case 'Closed':
        return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
      case 'Draft':
        return 'bg-amber-50/80 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      default:
        return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
    }
  };

  const availableSubjectsFilter = Array.from(new Set(assignments.map((p) => p.subject)));
  const getInitials = (name: string) =>
    name
      ? name
          .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '')
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : 'T';

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
            <Link href="/dashboard/academics" className="hover:text-[#006FBF] transition-colors">
              Academics
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">Coursework & Assignments</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">
            Coursework, Assignments & Homework
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Publish coursework, track student submission progress, and grade learner work.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={openCreateModal}
            className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all"
            style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
          >
            <i className="fa-solid fa-plus text-[10px]"></i>
            <span>New Assignment</span>
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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
            Active Assignments
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {assignments.filter((a) => a.status === 'Active').length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-[#006FBF] uppercase tracking-wider truncate">
            In Grading
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {assignments.filter((a) => a.status === 'Grading').length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">
            Total Submissions Logged
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {assignments.reduce((sum, a) => sum + (a.submittedCount || 0), 0)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider truncate">
            Total Published
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{assignments.length}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search title, teacher, or class stream..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white"
          />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none"
          >
            <option value="All">All Subjects</option>
            {availableSubjectsFilter.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Grading">Grading</option>
            <option value="Closed">Closed</option>
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
                <th className="py-4 pl-5 pr-3 w-[24%]">Assignment Title / ID</th>
                <th className="py-4 px-4 w-[14%]">Subject & Stream</th>
                <th className="py-4 px-4 w-[14%]">Teacher</th>
                <th className="py-4 px-4 w-[13%]">Due Date</th>
                <th className="py-4 px-4 w-[15%]">Submissions</th>
                <th className="py-4 pl-3 pr-5 text-right w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading assignments...
                  </td>
                </tr>
              ) : filteredAssignments.length > 0 ? (
                filteredAssignments.map((asn) => {
                  const subCount = asn.submittedCount ?? 0;
                  const totCount = asn.totalStudentsCount || 40;
                  const pct = Math.min(Math.round((subCount / totCount) * 100), 100);
                  return (
                    <tr key={asn.id} className="hover:bg-slate-50/40 transition-colors text-xs">
                      <td className="py-4 pl-5 pr-3">
                        <button
                          onClick={() => openViewModal(asn)}
                          className="font-semibold text-slate-900 hover:text-[#006FBF] truncate max-w-[260px] block text-left"
                        >
                          {asn.title}
                        </button>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{asn.id}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-700">{asn.subject}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{asn.gradeStream}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200/80">
                            {getInitials(asn.teacherName)}
                          </div>
                          <span className="truncate max-w-[120px]">{asn.teacherName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-mono">{asn.dueDate}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-800 mb-1">
                          <span>{asn.submissionProgress}</span>
                          <span className="text-[10px] text-[#006FBF]">{pct}%</span>
                        </div>
                        <div className="h-1.5 w-28 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#006FBF] transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-4 pl-3 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span
                            className={`mr-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(
                              asn.status
                            )}`}
                          >
                            {asn.status}
                          </span>
                          <button
                            onClick={() => openGradingModal(asn)}
                            className="rounded-lg bg-[#006FBF]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[#006FBF] hover:bg-[#006FBF] hover:text-white transition-colors"
                          >
                            <i className="fa-solid fa-list-check mr-1"></i> Grade
                          </button>
                          <button
                            onClick={() => openEditModal(asn)}
                            className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-[#006FBF] hover:bg-[#006FBF]/10 flex items-center justify-center border border-slate-200/60"
                            title="Edit Assignment"
                          >
                            <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                          </button>
                          <button
                            onClick={() => openDeletePrompt(asn)}
                            className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200/60"
                            title="Delete Assignment"
                          >
                            <i className="fa-solid fa-trash-can text-[10px]"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No matching assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {filteredAssignments.map((asn) => (
          <div
            key={asn.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="font-semibold text-slate-900 block text-sm">{asn.title}</span>
                <span className="text-[11px] text-slate-500">
                  {asn.subject} ({asn.gradeStream}) • Due: {asn.dueDate}
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(
                  asn.status
                )}`}
              >
                {asn.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => openGradingModal(asn)}
                className="rounded-xl bg-[#006FBF]/10 py-2 text-xs font-semibold text-[#006FBF]"
              >
                Grade ({asn.submissionProgress})
              </button>
              <button
                onClick={() => openEditModal(asn)}
                className="rounded-xl bg-slate-50 py-2 text-xs font-semibold text-slate-700"
              >
                Edit
              </button>
              <button
                onClick={() => openDeletePrompt(asn)}
                className="rounded-xl bg-rose-50 py-2 text-xs font-semibold text-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================================
          MODAL 1: CREATE / EDIT ASSIGNMENT
         ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {isEditing ? 'Edit Assignment' : 'New Assignment'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isEditing ? 'Update assignment details.' : 'Publish coursework and set deadlines.'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <form onSubmit={handleSaveAssignment}>
              <div className="p-6 space-y-4 text-xs max-h-[60vh] overflow-y-auto">
                {formError && (
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium mb-3">
                    <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                    {formError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Assignment Title *</label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assigned By (Teacher) *
                  </label>
                  <select
                    required
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                    <select
                      required
                      value={formData.subjectId}
                      onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white"
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
                    <label className="block font-semibold text-slate-700 mb-1">Grade Stream *</label>
                    <select
                      required
                      value={formData.streamId}
                      onChange={(e) => setFormData({ ...formData, streamId: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white"
                    >
                      <option value="">Select class...</option>
                      {streams.map((s) => (
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
                      Due Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Grading">Grading</option>
                      <option value="Closed">Closed</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Instructions & Guidelines *
                  </label>
                  <textarea
                    rows={4}
                    required
                    minLength={3}
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 outline-none focus:border-[#006FBF] focus:bg-white"
                    placeholder="Outline instructions..."
                  ></textarea>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
                >
                  {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: STUDENT SUBMISSIONS & GRADING DESK
         ===================================================================== */}
      {gradingModalOpen && selectedAsn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Student Submissions & Grading — {selectedAsn.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedAsn.subject} ({selectedAsn.gradeStream}) • Due: {selectedAsn.dueDate}
                </p>
              </div>
              <button
                onClick={() => setGradingModalOpen(false)}
                className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingRoster ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  <i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading class submission roster...
                </div>
              ) : submissionsRoster.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                      <th className="py-3 px-3">Learner</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 w-28">Score (0-100)</th>
                      <th className="py-3 px-3">Teacher Feedback / Remarks</th>
                      <th className="py-3 px-3 text-right">Save</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissionsRoster.map((row, idx) => (
                      <tr key={row.studentId} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{row.studentName}</div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {row.admissionNumber}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={row.submissionStatus}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setSubmissionsRoster((prev) =>
                                prev.map((r, i) =>
                                  i === idx ? { ...r, submissionStatus: val } : r
                                )
                              );
                            }}
                            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold bg-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Late">Late</option>
                            <option value="Graded">Graded</option>
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="Marks %"
                            value={row.score ?? ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? null : Number(e.target.value);
                              setSubmissionsRoster((prev) =>
                                prev.map((r, i) => (i === idx ? { ...r, score: val } : r))
                              );
                            }}
                            className="w-24 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-mono"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            placeholder="Add remarks..."
                            value={row.remarks}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSubmissionsRoster((prev) =>
                                prev.map((r, i) => (i === idx ? { ...r, remarks: val } : r))
                              );
                            }}
                            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs"
                          />
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleSaveStudentSubmission(row)}
                            disabled={savingStudentId === row.studentId}
                            className="rounded-lg bg-[#006FBF] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#012E54] disabled:opacity-50"
                          >
                            {savingStudentId === row.studentId ? '...' : 'Save'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  No students found in this stream.
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-6 py-3.5 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(selectedAsn.id, 'Grading')}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Mark as Grading
                </button>
                <button
                  onClick={() => updateStatus(selectedAsn.id, 'Closed')}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Close Assignment
                </button>
              </div>
              <button
                onClick={() => setGradingModalOpen(false)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW ASSIGNMENT DETAILS MODAL */}
      {viewModalOpen && selectedAsn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedAsn.title}</h3>
                <p className="text-xs text-slate-500">
                  {selectedAsn.subject} ({selectedAsn.gradeStream}) • {selectedAsn.teacherName}
                </p>
              </div>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-700 whitespace-pre-wrap">
              {selectedAsn.instructions || 'No instructions provided.'}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  openGradingModal(selectedAsn);
                }}
                className="rounded-xl bg-[#006FBF] px-4 py-2 text-xs font-semibold text-white"
              >
                Open Submissions & Grading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedAsn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <i className="fa-solid fa-triangle-exclamation text-xl text-rose-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Assignment</h3>
              <p className="mt-1.5 text-xs text-slate-500">
                Are you sure you want to permanently delete "
                <span className="font-semibold text-slate-700">{selectedAsn.title}</span>"?
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