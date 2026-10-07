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

interface Department {
    id: string;
    name: string;
    hodName: string;
    hodId: string | null;
    facultyCount: number;
    subjects: string[];
    status: 'Active' | 'Inactive';
    establishedYear: number;
}

interface Teacher {
    id: string;
    userId?: string;
    fullName: string;
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Modals & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [editMode, setEditMode] = useState(false);
    const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        hodId: '',
        subjectsInput: '',
        status: 'Active' as Department['status'],
        establishedYear: new Date().getFullYear(),
    });

    const getHeaders = () => {
        const token = localStorage.getItem('elimix_token');
        const userJson = localStorage.getItem('elimix_user');
        const tenantId = userJson ? JSON.parse(userJson).tenantId : '00000000-0000-0000-0000-000000000000';
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
            const [deptRes, teachersRes] = await Promise.all([
                fetch('http://localhost:3001/api/v1/departments', { headers: getHeaders() }),
                fetch('http://localhost:3001/api/v1/teachers', { headers: getHeaders() })
            ]);

            const deptData = await deptRes.json();
            const teachersData = await teachersRes.json();

            if (!deptRes.ok) throw new Error(deptData.message || 'Failed to fetch departments');

            const normalizedDepts = (deptData.data || []).map((d: any) => {
                let parsedSubjects: string[] = [];
                if (Array.isArray(d.subjects)) {
                    parsedSubjects = d.subjects;
                } else if (typeof d.subjects === 'string') {
                    try {
                        parsedSubjects = JSON.parse(d.subjects);
                    } catch {
                        parsedSubjects = d.subjects.split(',').map((s: string) => s.trim()).filter(Boolean);
                    }
                }
                return {
                    ...d,
                    subjects: Array.isArray(parsedSubjects) ? parsedSubjects : [],
                };
            });

            setDepartments(normalizedDepts);
            setTeachers(teachersData.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', hodId: '', subjectsInput: '', status: 'Active', establishedYear: new Date().getFullYear() });
        setEditMode(false);
        setSelectedDeptId(null);
        setFormError(null);
    };

    const openAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (dept: Department) => {
        const isUuid = dept.hodId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dept.hodId);
        
        setFormData({
            name: dept.name,
            hodId: (isUuid && dept.hodId) ? dept.hodId : '',
            subjectsInput: dept.subjects.join(', '),
            status: dept.status,
            establishedYear: dept.establishedYear || new Date().getFullYear(),
        });
        setSelectedDeptId(dept.id);
        setEditMode(true);
        setIsModalOpen(true);
    };

    const confirmDelete = (deptId: string) => {
        setSelectedDeptId(deptId);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedDeptId) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`http://localhost:3001/api/v1/departments/${selectedDeptId}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.message || 'Failed to delete department');
            }
            await fetchData();
            setIsDeleteModalOpen(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
            setSelectedDeptId(null);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        try {
            const subjectsList = formData.subjectsInput.split(',').map(s => s.trim()).filter(Boolean);
            const payload = {
                name: formData.name,
                // Ensure empty strings or whitespace fallback strictly to null
                hodId: formData.hodId && formData.hodId.trim() !== '' ? formData.hodId : null,
                subjects: subjectsList,
                status: formData.status,
                establishedYear: formData.establishedYear,
            };

            const url = editMode
                ? `http://localhost:3001/api/v1/departments/${selectedDeptId}`
                : 'http://localhost:3001/api/v1/departments';

            const res = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            
            // Handle validation errors from backend gracefully
            if (!res.ok) {
                if (result.errors) {
                    throw new Error(result.errors.map((err: any) => err.message).join(', '));
                }
                throw new Error(result.message || `Failed to ${editMode ? 'update' : 'create'} department`);
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

    const filteredDepartments = departments.filter((dept) => {
        const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) || dept.hodName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || dept.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getInitials = (name: string) => name ? name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'NA';

    return (
        <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
                        <Link href="/dashboard" className="hover:text-[#006FBF]">Dashboard</Link>
                        <i className="fa-solid fa-chevron-right text-[10px]" />
                        <span className="truncate">Academics</span>
                        <i className="fa-solid fa-chevron-right text-[10px]" />
                        <span className="text-slate-900 truncate">Departments</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Academic Departments</h1>
                    <p className="mt-0.5 text-xs text-slate-500 truncate">Manage faculties, HODs, and subject allocations.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <button onClick={openAddModal} className="inline-flex justify-center items-center rounded-xl px-4 py-2.5 sm:py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 w-full sm:w-auto" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
                        <i className="fa-solid fa-plus mr-2" /> Add Department
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm flex items-center shadow-sm">
                    <i className="fa-solid fa-triangle-exclamation text-rose-600 mr-2 text-base"></i>
                    <span className="truncate">{error}</span>
                </div>
            )}

            {/* METRICS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Total Departments</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{departments.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Total Faculty Staff</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{departments.reduce((acc, curr) => acc + curr.facultyCount, 0)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Assigned HODs</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{departments.filter(d => d.hodId).length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Subjects Managed</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{departments.reduce((acc, curr) => acc + (curr.subjects?.length || 0), 0)}</p>
                </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
                <div className="relative flex min-w-0 flex-1 items-center w-full">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 text-xs text-slate-400" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search departments or HODs..." className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 sm:py-2 pl-9 pr-4 text-xs outline-none focus:border-[#006FBF]/40 focus:bg-white" />
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium outline-none focus:border-[#006FBF]/40 focus:bg-white">
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* DESKTOP VIEW ONLY */}
            <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm w-full">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th className="py-3 pl-4 pr-3 w-1/4">Department</th>
                            <th className="px-3 py-3 w-1/4">Head of Dept (HOD)</th>
                            <th className="px-3 py-3 w-[100px]">Staff</th>
                            <th className="px-3 py-3">Subjects Allocated</th>
                            <th className="px-3 py-3 w-[100px]">Status</th>
                            <th className="py-3 pl-3 pr-4 text-right w-[100px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                        {isLoading ? (
                            <tr><td colSpan={6} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</td></tr>
                        ) : filteredDepartments.length > 0 ? (
                            filteredDepartments.map((dept) => (
                                <tr key={dept.id} className="transition-colors hover:bg-slate-50/60">
                                    <td className="py-3 pl-4 pr-3 min-w-0">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]"><i className="fa-solid fa-layer-group text-[11px]" /></span>
                                            <div className="min-w-0 flex-1">
                                                <span className="font-semibold text-slate-900 block truncate">{dept.name}</span>
                                                <span className="font-mono text-[10px] text-slate-400 block truncate">Est. {dept.establishedYear}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 min-w-0">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="h-6 w-6 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{getInitials(dept.hodName)}</div>
                                            <span className="text-slate-800 font-medium truncate">{dept.hodName || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 font-medium text-slate-700">
                                        <span className="font-bold text-slate-900">{dept.facultyCount}</span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {dept.subjects?.map((sub, idx) => (
                                                <span key={idx} className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200 truncate max-w-full">{sub}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className={`inline-flex whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold ${dept.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{dept.status}</span>
                                    </td>
                                    <td className="py-3 pl-3 pr-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEditModal(dept)} className="text-slate-400 hover:text-blue-600 transition-colors p-1"><i className="fa-solid fa-pen-to-square"></i></button>
                                            <button onClick={() => confirmDelete(dept.id)} className="text-slate-400 hover:text-rose-600 transition-colors p-1"><i className="fa-solid fa-trash-can"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={6} className="py-8 text-center text-slate-500">No departments found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MOBILE & TABLET CARDS VIEW */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {isLoading ? (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</div>
                ) : filteredDepartments.length > 0 ? (
                    filteredDepartments.map((dept) => (
                        <div key={dept.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
                            <div className="flex justify-between items-start gap-2 min-w-0">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]"><i className="fa-solid fa-layer-group text-sm" /></span>
                                    <div className="min-w-0 flex-1">
                                        <span className="font-semibold text-slate-900 block truncate text-sm">{dept.name}</span>
                                        <span className="font-mono text-[10px] text-slate-400 block truncate">Est. {dept.establishedYear} • {dept.facultyCount} Staff</span>
                                    </div>
                                </div>
                                <span className={`inline-flex flex-shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${dept.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                    {dept.status}
                                </span>
                            </div>

                            <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 min-w-0">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="h-5 w-5 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">{getInitials(dept.hodName)}</div>
                                    <span className="truncate block flex-1 font-medium">HOD: {dept.hodName || 'Unassigned'}</span>
                                </div>
                                <div className="flex items-start gap-2 min-w-0 mt-2">
                                    <i className="fa-solid fa-book-open text-slate-400 w-5 text-center mt-0.5 flex-shrink-0"></i>
                                    <div className="flex flex-wrap gap-1 flex-1">
                                        {dept.subjects?.map((sub, idx) => (
                                            <span key={idx} className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">{sub}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                                <button onClick={() => openEditModal(dept)} className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/60">
                                    <i className="fa-solid fa-pen-to-square"></i> Edit
                                </button>
                                <button onClick={() => confirmDelete(dept.id)} className="flex justify-center items-center gap-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-100">
                                    <i className="fa-solid fa-trash-can"></i> Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm">No departments found.</div>
                )}
            </div>

            {/* FORM MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">{editMode ? 'Edit Department' : 'Add New Department'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark text-sm" /></button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
                            {formError && (
                                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl flex items-center font-medium">
                                    <i className="fa-solid fa-circle-exclamation mr-2"></i> <span className="truncate">{formError}</span>
                                </div>
                            )}

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Department Name <span className="text-rose-500">*</span></label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF]" placeholder="e.g. Sciences" />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Head of Department (HOD)</label>
                                <select
                                    value={formData.hodId || ''}
                                    onChange={(e) => setFormData({ ...formData, hodId: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF] bg-white"
                                >
                                    <option value="">Unassigned</option>
                                    {teachers.map(t => (
                                        // FIXED: Uses t.userId if present, otherwise t.id to guarantee a valid UUID string
                                        <option key={t.id} value={t.userId || t.id}>
                                            {t.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Established Year</label>
                                    <input type="number" required value={formData.establishedYear} onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value) })} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF]" />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Department['status'] })} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF] bg-white">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Subjects (Comma separated)</label>
                                <textarea rows={2} value={formData.subjectsInput} onChange={(e) => setFormData({ ...formData, subjectsInput: e.target.value })} placeholder="e.g., Physics, Chemistry, Biology" className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-[#006FBF] resize-none" />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
                            <h3 className="text-lg font-bold text-slate-900">Delete Department</h3>
                            <p className="mt-1 text-sm text-slate-500">Are you sure you want to remove this department? Associated teachers will be marked as unassigned.</p>
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