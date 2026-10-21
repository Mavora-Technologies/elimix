// apps/web/app/dashboard/parents/page.tsx
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';

interface LinkedChild {
  id: string;
  admissionNumber: string;
  name: string;
  classGrade: string;
  gender?: string;
  isPrimaryContact?: boolean;
  financialResponsibility?: boolean;
}

interface ParentGuardian {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Sponsor';
  occupation?: string;
  familyId: string;
  familyName: string;
  emergencyContact?: string;
  linkedChildren: LinkedChild[];
  portalStatus: 'Active' | 'Disabled';
  createdAt?: string;
}

interface StudentOption {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  enrollmentStatus: string;
}

export default function ParentDirectoryPage() {
  const [parents, setParents] = useState<ParentGuardian[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [relationshipFilter, setRelationshipFilter] = useState('All');

  // Modals / Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<ParentGuardian | null>(null);
  const [selectedParentProfile, setSelectedParentProfile] = useState<ParentGuardian | null>(null);
  const [activeChildPreviewIndex, setActiveChildPreviewIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState<'Father' | 'Mother' | 'Guardian' | 'Sponsor'>('Father');
  const [occupation, setOccupation] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [portalActive, setPortalActive] = useState(true);
  const [studentSearchFilter, setStudentSearchFilter] = useState('');

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const storedUser = localStorage.getItem('elimix_user');
    let tenantId = '';
    if (storedUser) {
      try {
        tenantId = JSON.parse(storedUser)?.tenantId || '';
      } catch {}
    }
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantId ? { 'x-tenant-id': tenantId } : {}),
    };
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  const fetchParentsAndStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const [parentsRes, studentsRes] = await Promise.all([
        fetch(`${apiUrl}/parents`, { headers }),
        fetch(`${apiUrl}/students`, { headers }),
      ]);

      if (parentsRes.ok) {
        const pJson = await parentsRes.json();
        setParents(Array.isArray(pJson.data) ? pJson.data : []);
      } else {
        setError('Could not load parent directory from server.');
      }

      if (studentsRes.ok) {
        const sJson = await studentsRes.json();
        const list = Array.isArray(sJson) ? sJson : Array.isArray(sJson.data) ? sJson.data : [];
        setStudents(list);
      }
    } catch (err: any) {
      console.error('Error loading parents directory:', err);
      setError('Unable to connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchParentsAndStudents();
  }, [fetchParentsAndStudents]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingParent(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setRelationship('Father');
    setOccupation('');
    setFamilyName('');
    setEmergencyContact('');
    setSelectedStudentIds([]);
    setPortalActive(true);
    setStudentSearchFilter('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (parent: ParentGuardian) => {
    setEditingParent(parent);
    setFirstName(parent.firstName);
    setLastName(parent.lastName);
    setEmail(parent.email);
    setPhone(parent.phone);
    setRelationship(parent.relationship);
    setOccupation(parent.occupation || '');
    setFamilyName(parent.familyName || '');
    setEmergencyContact(parent.emergencyContact || parent.phone);
    setSelectedStudentIds(parent.linkedChildren.map((c) => c.id));
    setPortalActive(parent.portalStatus === 'Active');
    setStudentSearchFilter('');
    setIsModalOpen(true);
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSaveGuardian = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const headers = getHeaders();
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        relationship,
        occupation: occupation || null,
        familyName: familyName || `${lastName} Family`,
        emergencyContact: emergencyContact || phone,
        studentIds: selectedStudentIds,
        portalActive,
      };

      const url = editingParent ? `${apiUrl}/parents/${editingParent.id}` : `${apiUrl}/parents`;
      const method = editingParent ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save guardian');
      }

      setIsModalOpen(false);
      await fetchParentsAndStudents();
    } catch (err: any) {
      setError(err.message || 'Error saving guardian record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePortalAccess = async (parent: ParentGuardian) => {
    try {
      const nextActive = parent.portalStatus !== 'Active';
      const res = await fetch(`${apiUrl}/parents/${parent.id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ portalActive: nextActive }),
      });
      if (res.ok) {
        await fetchParentsAndStudents();
      }
    } catch (err) {
      console.error('Failed to toggle portal status:', err);
    }
  };

  const handleDeleteParent = async (parentId: string) => {
    if (!confirm('Are you sure you want to remove this guardian profile?')) return;
    try {
      const res = await fetch(`${apiUrl}/parents/${parentId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        if (selectedParentProfile?.id === parentId) setSelectedParentProfile(null);
        await fetchParentsAndStudents();
      }
    } catch (err) {
      console.error('Error deleting guardian:', err);
    }
  };

  // Filtered parents
  const filteredParents = useMemo(() => {
    return parents.filter((parent) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        parent.fullName.toLowerCase().includes(q) ||
        parent.email.toLowerCase().includes(q) ||
        parent.phone.toLowerCase().includes(q) ||
        parent.familyName.toLowerCase().includes(q) ||
        parent.linkedChildren.some(
          (child) =>
            child.name.toLowerCase().includes(q) ||
            child.admissionNumber.toLowerCase().includes(q)
        );

      const matchesStatus = statusFilter === 'All' || parent.portalStatus === statusFilter;
      const matchesRel = relationshipFilter === 'All' || parent.relationship === relationshipFilter;

      return matchesSearch && matchesStatus && matchesRel;
    });
  }, [parents, searchQuery, statusFilter, relationshipFilter]);

  // Live KPI calculations from DB
  const kpis = useMemo(() => {
    const totalGuardians = parents.length;
    const activeUsers = parents.filter((p) => p.portalStatus === 'Active').length;
    const disabledUsers = parents.filter((p) => p.portalStatus === 'Disabled').length;
    const uniqueFamilies = new Set(parents.map((p) => p.familyId).filter(Boolean)).size;
    const linkedStudentCount = new Set(
      parents.flatMap((p) => p.linkedChildren.map((c) => c.id))
    ).size;

    return { totalGuardians, activeUsers, disabledUsers, uniqueFamilies, linkedStudentCount };
  }, [parents]);

  const getStatusBadge = (status: ParentGuardian['portalStatus']) => {
    return status === 'Active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const filteredModalStudents = useMemo(() => {
    const q = studentSearchFilter.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      (s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        String(s.admissionNumber || '').toLowerCase().includes(q)
    );
  }, [students, studentSearchFilter]);

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Parent & Family Directory
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Manage parent and guardian profiles, family sibling groups, and Parent Portal access.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchParentsAndStudents}
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className={`fa-solid fa-rotate mr-2 text-xs ${isLoading ? 'animate-spin text-[#0ea5e9]' : 'text-[#64748b]'}`}></i>
            Refresh
          </button>
          <Link
            href="/dashboard/parents/children"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-people-roof mr-2 text-xs text-[#0ea5e9]"></i> Linked Children
          </Link>
          <button
            onClick={openCreateModal}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-user-plus mr-2 text-xs"></i> Add Guardian
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between">
          <span><i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}</span>
          <button onClick={() => setError(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Live Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Guardians</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : kpis.totalGuardians.toLocaleString()}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              {kpis.uniqueFamilies} Registered Families
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-users text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Active Portal Users</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : kpis.activeUsers.toLocaleString()}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Authorized for portal login</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-circle-check text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Linked Students</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : kpis.linkedStudentCount.toLocaleString()}
            </h3>
            <span className="text-[11px] text-[#0ea5e9] font-semibold mt-1 block">
              Out of {students.length} total students
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-indigo-50 text-[#042954] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-child-reaching text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Disabled / Suspended</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : kpis.disabledUsers.toLocaleString()}
            </h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Portal access revoked</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-user-lock text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[380px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search guardian, family, email, phone, or student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[12px] font-medium text-[#64748b]">
          <div className="flex items-center gap-2">
            <span>Relationship:</span>
            <select
              value={relationshipFilter}
              onChange={(e) => setRelationshipFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="All">All Relationships</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Guardian">Guardian</option>
              <option value="Sponsor">Sponsor</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>Portal Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Parents Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Parent / Family</th>
                <th className="py-3.5 px-5">Contact Details</th>
                <th className="py-3.5 px-5">Relationship</th>
                <th className="py-3.5 px-5">Linked Children (Siblings)</th>
                <th className="py-3.5 px-5">Portal Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b]">
                    <i className="fa-solid fa-circle-notch animate-spin mr-2 text-[#0ea5e9]"></i>
                    Loading parent and family records from database...
                  </td>
                </tr>
              ) : filteredParents.length > 0 ? (
                filteredParents.map((parent) => (
                  <tr key={parent.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954]">{parent.fullName}</div>
                      <div className="text-[11px] text-[#0ea5e9] font-semibold mt-0.5">
                        <i className="fa-solid fa-house-user mr-1"></i>
                        {parent.familyName}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-[#042954] font-semibold text-[12px]">{parent.email}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{parent.phone}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700">
                        {parent.relationship}
                      </span>
                      {parent.occupation && (
                        <div className="text-[11px] text-[#64748b] mt-1">{parent.occupation}</div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      {parent.linkedChildren.length > 0 ? (
                        <div className="space-y-1">
                          {parent.linkedChildren.map((child) => (
                            <div key={child.id} className="text-[12px] flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#0ea5e9]"></span>
                              <span className="font-bold text-[#042954]">{child.name}</span>
                              <span className="text-[11px] font-mono text-[#64748b]">
                                ({child.admissionNumber})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-medium">No children linked</span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <button
                        onClick={() => handleTogglePortalAccess(parent)}
                        title="Click to toggle portal access"
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${getStatusBadge(parent.portalStatus)}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${parent.portalStatus === 'Active' ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                        {parent.portalStatus}
                      </button>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedParentProfile(parent);
                          setActiveChildPreviewIndex(0);
                        }}
                        className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors"
                      >
                        <i className="fa-solid fa-eye mr-1"></i> Portal View
                      </button>
                      <button
                        onClick={() => openEditModal(parent)}
                        className="h-[32px] px-3 rounded-lg bg-slate-100 text-[#042954] hover:bg-slate-200 font-semibold text-[12px] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteParent(parent.id)}
                        className="h-[32px] px-2.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-[12px] transition-colors"
                        title="Delete Guardian"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b] text-[13px]">
                    No parent or guardian records found. Click <strong>Add Guardian</strong> to register one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: CREATE / EDIT GUARDIAN & LINK SIBLINGS
         ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h2 className="text-[18px] font-extrabold text-[#042954]">
                  {editingParent ? 'Edit Guardian & Family Links' : 'Register Parent / Guardian'}
                </h2>
                <p className="text-[12px] text-[#64748b]">
                  Creates a unified parent portal account and links authorized children.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveGuardian} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748b] mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] text-[#042954] focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748b] mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] text-[#042954] focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748b] mb-1">Email (Portal Login) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] text-[#042954] focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748b] mb-1">Phone Number (WhatsApp/SMS) *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7..."
                    className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] text-[#042954] focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748b] mb-1">Relationship *</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] font-semibold text-[#042954] bg-white"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Sponsor">Sponsor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748b] mb-1">Family Group Name</label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder={lastName ? `${lastName} Family` : 'e.g. Kamau Family'}
                    className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] text-[#042954]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748b] mb-1">Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Engineer"
                    className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] text-[#042954]"
                  />
                </div>
              </div>

              {/* Link Children (Siblings) Selector */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-bold uppercase text-[#64748b]">
                    Link Enrolled Students ({selectedStudentIds.length} selected)
                  </label>
                  <input
                    type="text"
                    placeholder="Filter students by name or Adm No..."
                    value={studentSearchFilter}
                    onChange={(e) => setStudentSearchFilter(e.target.value)}
                    className="h-[30px] px-2.5 rounded-lg border border-slate-200 text-[11px] w-56"
                  />
                </div>
                <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-200 p-2 bg-slate-50/60 divide-y divide-slate-100">
                  {filteredModalStudents.length > 0 ? (
                    filteredModalStudents.map((stu) => {
                      const isChecked = selectedStudentIds.includes(stu.id);
                      return (
                        <label
                          key={stu.id}
                          className="flex items-center justify-between py-2 px-2.5 hover:bg-white rounded-lg cursor-pointer text-[12px]"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleStudentSelection(stu.id)}
                              className="rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9]"
                            />
                            <span className="font-bold text-[#042954]">
                              {stu.firstName} {stu.lastName}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              ({stu.admissionNumber})
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-[#0ea5e9]">
                            {stu.enrollmentStatus || 'Active'}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-[12px] text-slate-400 py-4 text-center">No matching students found.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#042954] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={portalActive}
                    onChange={(e) => setPortalActive(e.target.checked)}
                    className="rounded border-slate-300 text-[#0ea5e9]"
                  />
                  Enable Parent Portal Login Immediately
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-[38px] px-4 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingParent ? 'Update Guardian' : 'Create Guardian'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: PARENT PORTAL MULTI-CHILD SWITCHER PREVIEW (Blueprint Sec 10 & 74)
         ===================================================================== */}
      {selectedParentProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#042954] to-[#0ea5e9] text-white font-bold flex items-center justify-center text-sm">
                  {selectedParentProfile.firstName.charAt(0)}{selectedParentProfile.lastName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-[17px] font-extrabold text-[#042954]">
                    {selectedParentProfile.fullName} — Parent Portal View
                  </h2>
                  <p className="text-[12px] text-[#64748b]">
                    {selectedParentProfile.familyName} • {selectedParentProfile.relationship} • {selectedParentProfile.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedParentProfile(null)}
                className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Child Switcher Bar (Blueprint Section 10: Parents switch between authorized children) */}
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mb-2">
                Authorized Children ({selectedParentProfile.linkedChildren.length}) — Click to switch child view
              </p>
              {selectedParentProfile.linkedChildren.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedParentProfile.linkedChildren.map((child, index) => (
                    <button
                      key={child.id}
                      onClick={() => setActiveChildPreviewIndex(index)}
                      className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all flex items-center gap-2 ${
                        activeChildPreviewIndex === index
                          ? 'bg-[#042954] text-white border-[#042954] shadow-sm'
                          : 'bg-slate-50 text-[#042954] border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <i className="fa-solid fa-user-graduate text-xs text-[#0ea5e9]"></i>
                      <span>{child.name}</span>
                      <span className="text-[10px] opacity-75">({child.admissionNumber})</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  No students are linked to this guardian yet. Click <strong>Edit</strong> to link students.
                </div>
              )}
            </div>

            {/* Active Child Portal Summary */}
            {selectedParentProfile.linkedChildren[activeChildPreviewIndex] && (
              <div className="bg-[#f8fafc] rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-extrabold text-[#042954]">
                      {selectedParentProfile.linkedChildren[activeChildPreviewIndex].name}
                    </h3>
                    <p className="text-[12px] text-[#64748b]">
                      Admission No: <span className="font-mono font-bold text-[#042954]">{selectedParentProfile.linkedChildren[activeChildPreviewIndex].admissionNumber}</span>
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/students/${selectedParentProfile.linkedChildren[activeChildPreviewIndex].id}`}
                    className="h-[34px] px-3.5 rounded-xl bg-white border border-slate-200 text-[12px] font-bold text-[#0ea5e9] hover:bg-sky-50 flex items-center"
                  >
                    Open Full Student Timeline <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-[#64748b] block">Enrollment Status</span>
                    <span className="text-[14px] font-extrabold text-emerald-600 mt-1 block">
                      {selectedParentProfile.linkedChildren[activeChildPreviewIndex].classGrade}
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-[#64748b] block">Financial Responsibility</span>
                    <span className="text-[14px] font-extrabold text-[#042954] mt-1 block">
                      {selectedParentProfile.linkedChildren[activeChildPreviewIndex].financialResponsibility ? 'Primary Payer' : 'Secondary'}
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-[#64748b] block">Emergency Contact</span>
                    <span className="text-[13px] font-mono font-bold text-[#042954] mt-1 block">
                      {selectedParentProfile.emergencyContact || selectedParentProfile.phone}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  const p = selectedParentProfile;
                  setSelectedParentProfile(null);
                  openEditModal(p);
                }}
                className="h-[38px] px-4 rounded-xl border border-slate-200 text-[12px] font-semibold text-[#042954] hover:bg-slate-50"
              >
                <i className="fa-solid fa-pen mr-1.5"></i> Edit Guardian / Links
              </button>
              <button
                onClick={() => setSelectedParentProfile(null)}
                className="h-[38px] px-5 rounded-xl bg-[#042954] text-white text-[12px] font-semibold"
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