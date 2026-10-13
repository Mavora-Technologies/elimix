// apps/web/app/dashboard/academics/subjects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ==========================================================================
   ELIMIX BRAND
   ========================================================================== */
const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

// Dynamic API URL for Local/Production compatibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface Teacher {
  id: string;
  userId?: string;
  fullName: string;
}

interface Department {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  departmentId: string | null;
  departmentName: string | null;
  teacherIds?: string[];
  teachers?: { id: string; fullName: string }[];
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    departmentId: '',
    teacherIds: [] as string[],
  });

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const userStr = localStorage.getItem('elimix_user');
    
    let tenantId = '00000000-0000-0000-0000-000000000000';
    
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        const userJson = JSON.parse(userStr);
        if (userJson && userJson.tenantId) {
          tenantId = userJson.tenantId;
        }
      } catch (e) {
        console.warn('Failed to parse elimix_user from localStorage');
      }
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    };
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [subRes, deptRes, teachRes] = await Promise.all([
        fetch(`${API_BASE_URL}/academics/subjects`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/departments`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/teachers`, { headers: getHeaders() })
      ]);

      const subData = await subRes.json();
      const deptData = await deptRes.json();
      const teachData = await teachRes.json();

      if (!subRes.ok) throw new Error(subData.message || 'Failed to fetch subjects.');

      const allTeachers = teachData.data || [];
      
      const hydratedSubjects = (subData.data || []).map((sub: any) => {
        let parsedTeacherIds: string[] = [];
        const rawTeacherIds: unknown = sub.teacherIds;

        if (typeof rawTeacherIds === 'string') {
          try {
            let parsed = JSON.parse(rawTeacherIds);
            if (typeof parsed === 'string') {
              try { parsed = JSON.parse(parsed); } catch (e) { /* ignore */ }
            }
            parsedTeacherIds = Array.isArray(parsed) ? parsed : [];
          } catch {
            parsedTeacherIds = rawTeacherIds.split(',').map((s: string) => s.trim()).filter(Boolean);
          }
        } else if (Array.isArray(rawTeacherIds)) {
          parsedTeacherIds = rawTeacherIds;
        }

        if (Array.isArray(parsedTeacherIds)) {
          parsedTeacherIds = parsedTeacherIds.filter(id => typeof id === 'string' && id.length > 10);
        } else {
          parsedTeacherIds = [];
        }

        return {
          ...sub,
          teacherIds: parsedTeacherIds,
          teachers: parsedTeacherIds.map((id: string) => allTeachers.find((t: any) => t.id === id)).filter(Boolean)
        };
      });

      setSubjects(hydratedSubjects);
      setDepartments(deptData.data || []);
      setTeachers(allTeachers);
    } catch (err: any) {
      setError(err.message || 'Failed to load curriculum data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', code: '', departmentId: '', teacherIds: [] });
    setEditMode(false);
    setSelectedSubjectId(null);
    setFormError(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subject) => {
    setFormData({
      name: sub.name,
      code: sub.code,
      departmentId: sub.departmentId || '',
      teacherIds: Array.isArray(sub.teacherIds) ? [...sub.teacherIds] : [],
    });
    setSelectedSubjectId(sub.id);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const confirmDelete = (subId: string) => {
    setSelectedSubjectId(subId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSubjectId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/academics/subjects/${selectedSubjectId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || 'Failed to delete subject');
      }
      
      await fetchData();
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
      setSelectedSubjectId(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        name: formData.name,
        code: formData.code,
        departmentId: formData.departmentId && formData.departmentId.trim() !== '' ? formData.departmentId : null,
        teacherIds: formData.teacherIds,
      };

      const url = editMode 
        ? `${API_BASE_URL}/academics/subjects/${selectedSubjectId}`
        : `${API_BASE_URL}/academics/subjects`;
        
      const res = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      
      if (!res.ok) {
        if (result.errors) throw new Error(result.errors.map((err: any) => err.message).join(', '));
        throw new Error(result.message || `Failed to ${editMode ? 'update' : 'create'} subject`);
      }

      await fetchData();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTeacherSelection = (teacherId: string) => {
    setFormData(prev => ({
      ...prev,
      teacherIds: prev.teacherIds.includes(teacherId) 
        ? prev.teacherIds.filter(id => id !== teacherId)
        : [...prev.teacherIds, teacherId]
    }));
  };

  const getCleanInitials = (name: string) => {
    if (!name) return 'T';
    const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    if (!cleanName) return 'T';
    return cleanName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const availableDepartmentsFilter = Array.from(
    new Set(subjects.map((s) => s.departmentName).filter((dept): dept is string => Boolean(dept)))
  );

  const filteredSubjects = subjects.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.departmentName && sub.departmentName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept =
      departmentFilter === 'All' ||
      (departmentFilter === 'Unassigned' ? !sub.departmentName : sub.departmentName === departmentFilter);

    return matchesSearch && matchesDept;
  });

  const totalDepartmentsCount = new Set(subjects.map((s) => s.departmentId).filter(Boolean)).size;
  const assignedSubjectsCount = subjects.filter((s) => s.departmentId).length;
  const unassignedSubjectsCount = subjects.filter((s) => !s.departmentId).length;

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
            <Link href="/dashboard" className="hover:text-[#006FBF]">Dashboard</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/academics" className="hover:text-[#006FBF]">Academics</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">Subjects & Curriculum</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Subjects & Curriculum</h1>
          <p className="mt-0.5 text-xs text-slate-500 truncate">Manage academic subjects, course codes, and allocations.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={openAddModal} 
            className="inline-flex justify-center items-center rounded-xl px-4 py-2.5 sm:py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 w-full sm:w-auto" 
            style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
          >
            <i className="fa-solid fa-plus mr-2" /> Add Subject
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm flex items-center shadow-sm">
          <i className="fa-solid fa-triangle-exclamation text-rose-600 mr-2 text-base"></i>
          <span className="truncate">{error}</span>
        </div>
      )}

      {/* METRICS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Total Subjects</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{subjects.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Departments</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalDepartmentsCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Assigned Subjects</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{assignedSubjectsCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Unassigned</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{unassignedSubjectsCount}</p>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3 text-xs text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subject name, code, or department..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 sm:py-2 pl-9 pr-4 text-xs text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
          >
            <option value="All">All Departments</option>
            {availableDepartmentsFilter.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
            <option value="Unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      {/* DESKTOP VIEW ONLY */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto whitespace-nowrap min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 pl-5 pr-3 min-w-[200px]">Subject Name</th>
                <th className="px-4 py-4 w-[150px]">Course Code</th>
                <th className="px-4 py-4 min-w-[180px]">Department</th>
                <th className="px-4 py-4 min-w-[150px]">Assigned Teachers</th>
                <th className="py-4 pl-3 pr-5 text-right w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr><td colSpan={5} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading curriculum...</td></tr>
              ) : filteredSubjects.length > 0 ? (
                filteredSubjects.map((sub) => (
                  <tr key={sub.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#006FBF]/10 text-[#006FBF]">
                          <i className="fa-solid fa-book text-sm" />
                        </span>
                        <span className="font-semibold text-slate-900">{sub.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-mono font-bold text-slate-700 border border-slate-200">
                        {sub.code}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {sub.departmentName ? (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          {sub.departmentName}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center -space-x-2">
                        {sub.teachers && sub.teachers.length > 0 ? (
                          <>
                            {sub.teachers.slice(0, 3).map((t, i) => (
                              <div 
                                key={t.id} 
                                title={t.fullName} 
                                className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 ring-2 ring-white text-[10px] font-bold text-slate-700 shadow-sm" 
                                style={{ zIndex: 10 - i }}
                              >
                                {getCleanInitials(t.fullName)}
                              </div>
                            ))}
                            {sub.teachers.length > 3 && (
                              <div 
                                title={`${sub.teachers.length - 3} more teachers`}
                                className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white text-[10px] font-bold text-slate-500 shadow-sm" 
                                style={{ zIndex: 0 }}
                              >
                                +{sub.teachers.length - 3}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">None Assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(sub)} className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-50"><i className="fa-solid fa-pen-to-square"></i></button>
                        <button onClick={() => confirmDelete(sub.id)} className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50"><i className="fa-solid fa-trash-can"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">No matching subjects found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</div>
        ) : filteredSubjects.length > 0 ? (
          filteredSubjects.map((sub) => (
            <div key={sub.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
              <div className="flex justify-between items-start gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]"><i className="fa-solid fa-book text-sm" /></span>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-900 block truncate text-sm">{sub.name}</span>
                    <span className="inline-flex items-center mt-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700 border border-slate-200">{sub.code}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-solid fa-building-columns text-slate-400 w-5 text-center flex-shrink-0" />
                  <span className="truncate flex-1 font-medium text-slate-700">
                    {sub.departmentName || <span className="text-slate-400 italic">Unassigned Dept</span>}
                  </span>
                </div>
                <div className="flex items-start gap-2 min-w-0 mt-2">
                  <i className="fa-solid fa-users text-slate-400 w-5 text-center mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1 flex-1">
                    {sub.teachers && sub.teachers.length > 0 ? (
                      sub.teachers.map((t) => (
                        <span key={t.id} className="inline-flex items-center rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">{t.fullName}</span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No teachers assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => openEditModal(sub)} className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/60">
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button onClick={() => confirmDelete(sub.id)} className="flex justify-center items-center gap-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-100">
                  <i className="fa-solid fa-trash-can"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm">No subjects found.</div>
        )}
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50 flex-shrink-0">
              <h3 className="text-sm font-bold text-slate-900">{editMode ? 'Edit Subject' : 'Add New Subject'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa-solid fa-xmark text-sm" /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden text-xs">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {formError && (
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl flex items-center font-medium">
                    <i className="fa-solid fa-circle-exclamation mr-2"></i> <span className="truncate">{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Subject Name <span className="text-rose-500">*</span></label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF]" placeholder="e.g. Advanced Physics" />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Course Code <span className="text-rose-500">*</span></label>
                    <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF]" placeholder="e.g. PHY-301" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department Allocation</label>
                  <select
                    value={formData.departmentId || ''}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF] bg-white"
                  >
                    <option value="">-- Unassigned --</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Assign Teachers</label>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 max-h-[150px] overflow-y-auto p-2 space-y-1">
                    {teachers.length > 0 ? teachers.map(t => (
                      <label key={t.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200 shadow-sm">
                        <input 
                          type="checkbox" 
                          checked={formData.teacherIds.includes(t.id)}
                          onChange={() => toggleTeacherSelection(t.id)}
                          className="w-4 h-4 text-[#006FBF] border-slate-300 rounded focus:ring-[#006FBF]"
                        />
                        <span className="font-medium text-slate-700 flex-1 truncate">{t.fullName}</span>
                      </label>
                    )) : (
                      <p className="p-3 text-center text-slate-400 italic">No teachers available.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="rounded-xl px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:opacity-95 disabled:opacity-50" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <i className="fa-solid fa-triangle-exclamation text-xl text-rose-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Subject</h3>
              <p className="mt-1 text-sm text-slate-500">Are you sure you want to completely remove this subject from the curriculum?</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting} className="w-full sm:w-auto rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="button" onClick={handleDelete} disabled={isSubmitting} className="w-full sm:w-auto rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}