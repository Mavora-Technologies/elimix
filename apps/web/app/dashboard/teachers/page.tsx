// apps/web/app/dashboard/teachers/page.tsx
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

interface TeacherProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  assignedClasses: string[];
  status: 'Active' | 'On Leave' | 'Part-Time';
}

interface Department {
  id: string;
  name: string;
}

export default function TeachersDirectoryPage() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [editMode, setEditMode] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    empNumber: '',
    departmentId: '',
    status: 'Active' as TeacherProfile['status'],
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

  const fetchDirectoryData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [teachersRes, deptsRes] = await Promise.all([
        fetch('http://localhost:3001/api/v1/teachers', { headers: getHeaders() }),
        fetch('http://localhost:3001/api/v1/teachers/departments', { headers: getHeaders() })
      ]);

      const teachersResult = await teachersRes.json();
      const deptsResult = await deptsRes.json();

      if (!teachersRes.ok) throw new Error(teachersResult.message || 'Failed to fetch teachers');

      setTeachers(teachersResult.data || []);
      setDepartments(deptsResult.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load directory data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectoryData();
  }, []);

  const resetForm = () => {
    setFormData({ fullName: '', email: '', phone: '', empNumber: '', departmentId: '', status: 'Active' });
    setEditMode(false);
    setSelectedTeacherId(null);
    setFormError(null);
  };

  const openAddModal = () => {
    resetForm();
    if (departments.length > 0) setFormData(prev => ({ ...prev, departmentId: departments[0].id }));
    setIsModalOpen(true);
  };

  const openEditModal = async (teacherId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/teachers/${teacherId}`, { headers: getHeaders() });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      
      const t = result.data;
      const dept = departments.find(d => d.name === t.department);
      
      setFormData({
        fullName: t.fullName,
        email: t.email,
        phone: t.phone === 'N/A' ? '' : t.phone,
        empNumber: t.employeeNumber || '',
        departmentId: dept ? dept.id : '',
        status: t.status as TeacherProfile['status'],
      });
      
      setSelectedTeacherId(teacherId);
      setEditMode(true);
      setIsModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load teacher details for editing');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacherId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/teachers/${selectedTeacherId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || 'Failed to delete teacher');
      }
      await fetchDirectoryData();
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
      setSelectedTeacherId(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const nameParts = formData.fullName.trim().split(' ');
      const payload = {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' ') || 'Teacher',
        email: formData.email,
        employeeNumber: formData.empNumber,
        phone: formData.phone || undefined,
        departmentId: formData.departmentId || null,
        isActive: formData.status === 'Active',
      };

      const url = editMode 
        ? `http://localhost:3001/api/v1/teachers/${selectedTeacherId}`
        : 'http://localhost:3001/api/v1/teachers';
        
      const res = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || `Failed to ${editMode ? 'update' : 'create'} teacher`);

      await fetchDirectoryData();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || teacher.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || teacher.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const getCleanInitials = (name: string) => {
    if (!name) return 'T';
    const cleanName = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '').replace(/[^a-zA-Z0-9 ]/g, '').trim();
    if (!cleanName) return 'T';
    return cleanName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
            <Link href="/dashboard" className="hover:text-[#006FBF]">Dashboard</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">Teachers</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Teachers Directory</h1>
          <p className="mt-0.5 text-xs text-slate-500 truncate">Manage faculty profiles, allocations, and credentials.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/teachers/attendance" className="inline-flex justify-center items-center rounded-xl bg-white border border-slate-200 px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 w-full sm:w-auto">
            <i className="fa-solid fa-clipboard-user mr-2 text-[#006FBF]" /> Staff Attendance
          </Link>
          <button onClick={openAddModal} className="inline-flex justify-center items-center rounded-xl px-4 py-2.5 sm:py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 w-full sm:w-auto" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-user-plus mr-2" /> Add Teacher
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm flex items-center shadow-sm">
          <i className="fa-solid fa-triangle-exclamation text-rose-600 mr-2 text-base"></i>
          <span className="truncate">{error}</span>
        </div>
      )}

      {/* METRICS - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Total Faculty</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{teachers.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Active Today</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{teachers.filter(t => t.status === 'Active').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Departments</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{new Set(teachers.map(t => t.department)).size}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Unassigned Subjects</p>
          <p className="mt-1 text-2xl font-bold text-rose-600">{teachers.filter(t => t.subjects.length === 0).length}</p>
        </div>
      </div>

      {/* SEARCH & FILTERS - Responsive Flex */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3 text-xs text-slate-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search directory..." className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 sm:py-2 pl-9 pr-4 text-xs outline-none focus:border-[#006FBF]/40 focus:bg-white" />
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium outline-none focus:border-[#006FBF]/40 focus:bg-white">
            <option value="All">All Departments</option>
            {departments.map(dept => <option key={dept.id} value={dept.name} className="truncate">{dept.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium outline-none focus:border-[#006FBF]/40 focus:bg-white">
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Part-Time">Part-Time</option>
          </select>
        </div>
      </div>

      {/* DESKTOP VIEW ONLY (Hidden on Mobile and Tablet) */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 pl-5 pr-3 min-w-[220px]">Profile & ID</th>
                <th className="px-4 py-4 min-w-[200px]">Department</th>
                <th className="px-4 py-4 min-w-[250px]">Subjects Allocated</th>
                <th className="px-4 py-4 w-[100px]">Status</th>
                <th className="py-4 pl-3 pr-5 text-right w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr><td colSpan={5} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</td></tr>
              ) : filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 ring-1 ring-inset ring-slate-200">{getCleanInitials(teacher.fullName)}</div>
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 block truncate text-sm">{teacher.fullName}</span>
                          <span className="font-mono text-[10px] text-slate-400 block truncate">{teacher.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {teacher.department !== 'Unassigned' ? (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          {teacher.department}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                        {teacher.subjects && teacher.subjects.length > 0 ? (
                          teacher.subjects.map((sub, idx) => (
                            <span key={idx} className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600 border border-slate-200 shadow-sm truncate max-w-[150px]">
                              {sub}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-rose-500 italic flex items-center gap-1 font-medium"><i className="fa-solid fa-triangle-exclamation"></i> No subjects assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex whitespace-nowrap rounded-md px-2.5 py-1 text-[10px] font-semibold shadow-sm ${teacher.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-800'}`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEditModal(teacher.id)} className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-50" title="Edit Teacher">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onClick={() => confirmDelete(teacher.id)} className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50" title="Delete Teacher">
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                        <Link href={`/dashboard/teachers/${teacher.id}`} className="rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200/60 shadow-sm">
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS VIEW (Hidden on Desktop) */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</div>
        ) : filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
              <div className="flex justify-between items-start gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-200">{getCleanInitials(teacher.fullName)}</div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-900 block truncate text-sm">{teacher.fullName}</span>
                    <span className="font-mono text-[10px] text-slate-400 block truncate">{teacher.email}</span>
                  </div>
                </div>
                <span className={`inline-flex flex-shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${teacher.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  {teacher.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-3 pt-3 border-t border-slate-100 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-solid fa-building-columns text-slate-400 w-4 text-center flex-shrink-0"></i> 
                  <span className="truncate block flex-1 font-medium text-slate-700">{teacher.department !== 'Unassigned' ? teacher.department : <span className="text-slate-400 italic">Unassigned Dept</span>}</span>
                </div>
                
                <div className="flex items-start gap-2 min-w-0">
                  <i className="fa-solid fa-book-open text-slate-400 w-4 text-center mt-0.5 flex-shrink-0"></i> 
                  <div className="flex flex-wrap gap-1 flex-1">
                    {teacher.subjects && teacher.subjects.length > 0 ? (
                      teacher.subjects.map((sub, idx) => (
                        <span key={idx} className="inline-flex items-center rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">{sub}</span>
                      ))
                    ) : (
                      <span className="text-[10px] text-rose-500 italic font-medium">No subjects assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => openEditModal(teacher.id)} className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/60 shadow-sm">
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <Link href={`/dashboard/teachers/${teacher.id}`} className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/60 shadow-sm">
                  <i className="fa-solid fa-eye"></i> View
                </Link>
                <button onClick={() => confirmDelete(teacher.id)} className="flex justify-center items-center gap-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-100 shadow-sm">
                  <i className="fa-solid fa-trash-can"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm">No records found.</div>
        )}
      </div>

      {/* FORM MODAL (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">{editMode ? 'Edit Teacher Profile' : 'Register New Teacher'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark text-sm" /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl flex items-center font-medium">
                  <i className="fa-solid fa-circle-exclamation mr-2"></i> <span className="truncate">{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name <span className="text-rose-500">*</span></label>
                <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF]" />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address <span className="text-rose-500">*</span></label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee No. <span className="text-rose-500">*</span></label>
                  <input type="text" required value={formData.empNumber} onChange={(e) => setFormData({...formData, empNumber: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF]" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select value={formData.departmentId} onChange={(e) => setFormData({...formData, departmentId: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 font-medium outline-none bg-white">
                    <option value="">Unassigned</option>
                    {departments.map(dept => <option key={dept.id} value={dept.id} className="truncate">{dept.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as TeacherProfile['status']})} className="w-full rounded-xl border border-slate-200 px-3 py-2 font-medium outline-none bg-white">
                    <option value="Active">Active</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 mt-2">
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
              <h3 className="text-lg font-bold text-slate-900">Delete Teacher</h3>
              <p className="mt-1 text-sm text-slate-500">Are you sure you want to permanently remove this teacher? This will also revoke their login access.</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting} className="w-full sm:w-auto rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="button" onClick={handleDeleteTeacher} disabled={isSubmitting} className="w-full sm:w-auto rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}