// apps/web/app/dashboard/parents/children/page.tsx
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';

interface LinkedChildRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classGrade: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Sponsor';
  isPrimaryContact: boolean;
}

interface ParentOption {
  id: string;
  fullName: string;
  email: string;
}

interface StudentOption {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
}

export default function LinkedChildrenPage() {
  const [links, setLinks] = useState<LinkedChildRecord[]>([]);
  const [parentsList, setParentsList] = useState<ParentOption[]>([]);
  const [studentsList, setStudentsList] = useState<StudentOption[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('All');

  // Modal State for Link New Child
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isPrimaryContact, setIsPrimaryContact] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const [linksRes, parentsRes, studentsRes] = await Promise.all([
        fetch(`${apiUrl}/parents/links`, { headers }),
        fetch(`${apiUrl}/parents`, { headers }),
        fetch(`${apiUrl}/students`, { headers }),
      ]);

      if (linksRes.ok) {
        const json = await linksRes.json();
        setLinks(Array.isArray(json.data) ? json.data : []);
      } else {
        setError('Failed to fetch linked children directory.');
      }

      if (parentsRes.ok) {
        const pJson = await parentsRes.json();
        setParentsList(Array.isArray(pJson.data) ? pJson.data : []);
      }

      if (studentsRes.ok) {
        const sJson = await studentsRes.json();
        const list = Array.isArray(sJson) ? sJson : Array.isArray(sJson.data) ? sJson.data : [];
        setStudentsList(list);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Unable to reach the backend server.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLinkNewChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParentId || !selectedStudentId) return;

    setIsSubmitting(true);
    setError(null);
    try {
      // Using updateParent to sync studentIds array
      const parentToUpdate = parentsList.find((p) => p.id === selectedParentId);
      // Fetch current parent details to get existing links
      const headers = getHeaders();
      
      const res = await fetch(`${apiUrl}/parents/${selectedParentId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          studentIds: [selectedStudentId], // Appends/syncs via repository
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to link child');
      }

      setIsModalOpen(false);
      setSelectedParentId('');
      setSelectedStudentId('');
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Error linking child to guardian');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter logic
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        link.studentName.toLowerCase().includes(q) ||
        link.admissionNo.toLowerCase().includes(q) ||
        link.guardianName.toLowerCase().includes(q) ||
        link.guardianEmail.toLowerCase().includes(q);

      const matchesRelationship =
        relationshipFilter === 'All' || link.relationship === relationshipFilter;

      return matchesSearch && matchesRelationship;
    });
  }, [links, searchQuery, relationshipFilter]);

  const kpis = useMemo(() => {
    const totalLinks = links.length;
    const primaryCount = links.filter((l) => l.isPrimaryContact).length;
    const uniqueStudents = new Set(links.map((l) => l.studentId)).size;
    return { totalLinks, primaryCount, uniqueStudents };
  }, [links]);

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Linked Children & Guardians
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Monitor family relationships, primary contact designations, and student sponsorships.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/parents"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-users mr-2 text-xs text-[#0ea5e9]"></i> Parent Directory
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-link mr-2 text-xs"></i> Link New Child
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between">
          <span><i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}</span>
          <button onClick={() => setError(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Linkages</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : kpis.totalLinks.toLocaleString()}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              Active DB student links
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-link text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Primary Contacts</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : kpis.primaryCount.toLocaleString()}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Verified primary guardians</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-user-shield text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Linked Students</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : kpis.uniqueStudents.toLocaleString()}
            </h3>
            <span className="text-[11px] text-[#64748b] font-semibold mt-1 block">Students with guardians</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-child-reaching text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Guardians Directory</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : parentsList.length}
            </h3>
            <span className="text-[11px] text-[#0ea5e9] font-semibold mt-1 block">Registered parents</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-users text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[380px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search student name, admission no, or guardian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
          />
        </div>

        <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
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
      </div>

      {/* Linked Children Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Student Name / Admission</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Guardian Name</th>
                <th className="py-3.5 px-5">Relationship</th>
                <th className="py-3.5 px-5">Contact Type</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b]">
                    <i className="fa-solid fa-circle-notch animate-spin mr-2 text-[#0ea5e9]"></i>
                    Loading linkages from database...
                  </td>
                </tr>
              ) : filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954]">{link.studentName}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{link.admissionNo}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-700 font-semibold text-[12px]">{link.classGrade}</td>
                    <td className="py-4 px-5">
                      <div className="text-[#042954] font-semibold text-[12px]">{link.guardianName}</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">{link.guardianEmail}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700">
                        {link.relationship}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {link.isPrimaryContact ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-[#0ea5e9] border border-sky-200">
                          Primary Contact
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
                          Secondary
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={`/dashboard/parents`}
                        className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors inline-flex items-center"
                      >
                        Manage in Directory
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b] text-[13px]">
                    No matching child-guardian linkage records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Link New Child */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-[17px] font-extrabold text-[#042954]">Link Student to Guardian</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleLinkNewChild} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#64748b] mb-1">Select Guardian *</label>
                <select
                  required
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] font-semibold text-[#042954] bg-white"
                >
                  <option value="">-- Choose Guardian --</option>
                  {parentsList.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#64748b] mb-1">Select Student *</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] font-semibold text-[#042954] bg-white"
                >
                  <option value="">-- Choose Student --</option>
                  {studentsList.map((s) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (Adm: {s.admissionNumber})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
                  className="h-[38px] px-5 rounded-xl bg-[#042954] text-white text-[12px] font-semibold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Linking...' : 'Confirm Linkage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}