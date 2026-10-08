// apps/web/app/dashboard/academics/page.tsx
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

interface AcademicStream {
  id: string;
  gradeName: string;
  streamName: string;
  classTeacher: string;
  teacherEmail: string;
  studentCount: number;
  capacity: number;
  roomNumber: string;
  status?: string;
}

interface ReferenceData {
  classes: { id: string; name: string }[];
  teachers: { id: string; firstName: string; lastName: string }[];
}

export default function AcademicsOverviewPage() {
  const [streams, setStreams] = useState<AcademicStream[]>([]);
  const [referenceData, setReferenceData] = useState<ReferenceData>({ classes: [], teachers: [] });
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStream, setSelectedStream] = useState<AcademicStream | null>(null);

  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    classId: '',
    classTeacherId: '',
    capacity: 40,
    roomNumber: '',
  });

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const userStr = localStorage.getItem('elimix_user');
    let tenantId = '00000000-0000-0000-0000-000000000000';
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try { tenantId = JSON.parse(userStr).tenantId || tenantId; } catch (e) {}
    }
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-tenant-id': tenantId };
  };

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const headers = getHeaders();
      const [streamsRes, refRes] = await Promise.all([
        fetch('http://localhost:3001/api/v1/academics/classes', { headers }),
        fetch('http://localhost:3001/api/v1/academics/reference', { headers }),
      ]);

      if (streamsRes.ok) {
        const result = await streamsRes.json();
        const enhancedStreams = (result.data || []).map((s: any) => ({
          ...s,
          status: s.studentCount >= s.capacity ? 'Full' : 'Active'
        }));
        setStreams(enhancedStreams);
      }
      if (refRes.ok) {
        const result = await refRes.json();
        setReferenceData(result.data || { classes: [], teachers: [] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPageData(); }, []);

  // --- ACTIONS ---
  const handleSaveStream = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const url = isEditing 
        ? `http://localhost:3001/api/v1/academics/streams/${selectedStream?.id}`
        : `http://localhost:3001/api/v1/academics/streams`;
        
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          ...formData,
          classTeacherId: formData.classTeacherId || null,
          roomNumber: formData.roomNumber || null,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || `Failed to ${isEditing ? 'update' : 'create'} stream`);

      await fetchPageData();
      setIsModalOpen(false);
      setSuccessBanner(isEditing ? 'Stream updated successfully.' : `Stream '${formData.name}' successfully published.`);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStream = async () => {
    if (!selectedStream) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/academics/streams/${selectedStream.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete stream');

      await fetchPageData();
      setIsDeleteModalOpen(false);
      setSuccessBanner('Grade stream deleted successfully.');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UI TRIGGERS ---
  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedStream(null);
    setFormError(null);
    setFormData({ name: '', classId: '', classTeacherId: '', capacity: 40, roomNumber: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (stream: AcademicStream) => {
    setIsEditing(true);
    setSelectedStream(stream);
    setFormError(null);
    
    // Reverse lookup IDs from the mapped names
    const classMatch = referenceData.classes.find(c => c.name === stream.gradeName);
    const teacherMatch = referenceData.teachers.find(t => `${t.firstName} ${t.lastName}`.trim() === stream.classTeacher);

    setFormData({
      name: stream.streamName,
      classId: classMatch ? classMatch.id : '',
      classTeacherId: teacherMatch ? teacherMatch.id : '',
      capacity: stream.capacity,
      roomNumber: stream.roomNumber === 'TBD' ? '' : stream.roomNumber,
    });
    setIsModalOpen(true);
  };

  const openDeletePrompt = (stream: AcademicStream) => {
    setSelectedStream(stream);
    setFormError(null);
    setIsDeleteModalOpen(true);
  };

  // --- FILTERS ---
  const filteredStreams = streams.filter((stream) => {
    const matchesSearch = stream.streamName.toLowerCase().includes(searchQuery.toLowerCase()) || stream.classTeacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'All' || stream.gradeName === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'Full': return 'bg-rose-50/80 text-rose-700 ring-1 ring-inset ring-rose-600/20';
      default: return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
    }
  };

  const availableGradesFilter = Array.from(new Set(streams.map(s => s.gradeName)));
  const getInitials = (name: string) => name && name !== 'Unassigned' ? name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'T';

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
            <Link href="/dashboard" className="hover:text-[#006FBF] transition-colors">Dashboard</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">Academics</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Grade Streams & Curriculums</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Manage grade streams, student capacities, and faculty assignments.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/academics/timetables" className="hidden sm:flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <i className="fa-solid fa-calendar-days text-[#006FBF]"></i><span>Master Timetable</span>
          </Link>
          <button onClick={openCreateModal} className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-plus text-[10px]"></i><span>Add Grade Stream</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <i className="fa-solid fa-check text-[10px] bg-emerald-100/80 text-emerald-600 p-1.5 rounded-lg" />
          <p className="flex-1">{successBanner}</p>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Total Streams</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{streams.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Total Capacity</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{streams.reduce((acc, curr) => acc + curr.capacity, 0)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider truncate">Full Streams</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{streams.filter(s => s.status === 'Full').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider truncate">Grades Tracked</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{availableGradesFilter.length}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input type="text" placeholder="Search stream name or head teacher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white" />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none">
            <option value="All">All Grades</option>
            {availableGradesFilter.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-5 pr-3 w-[25%]">Stream Name / ID</th>
                <th className="py-4 px-4 w-[15%]">Grade Level</th>
                <th className="py-4 px-4 w-[20%]">Head Teacher</th>
                <th className="py-4 px-4 w-[15%]">Capacity</th>
                <th className="py-4 px-4 w-[10%]">Status</th>
                <th className="py-4 pl-3 pr-5 text-right w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading streams...</td></tr>
              ) : filteredStreams.length > 0 ? (
                filteredStreams.map((stream) => (
                  <tr key={stream.id} className="hover:bg-slate-50/40 transition-colors text-xs group">
                    <td className="py-4 pl-5 pr-3">
                      <div className="font-semibold text-slate-900 truncate">{stream.streamName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{stream.id}</div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700">{stream.gradeName}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 font-medium text-slate-700">
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200/80">
                          {getInitials(stream.classTeacher)}
                        </div>
                        <span className="truncate max-w-[140px]">{stream.classTeacher}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-slate-700 font-mono text-[11px] font-medium mb-1.5 flex justify-between items-center w-24">
                        <span>{stream.studentCount} <span className="text-slate-400">/ {stream.capacity}</span></span>
                      </div>
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((stream.studentCount / stream.capacity) * 100, 100)}%`, background: stream.status === 'Full' ? '#f43f5e' : `linear-gradient(90deg, ${BRAND.brightBlue}, ${BRAND.cyan})` }} />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold ${getStatusBadge(stream.status)}`}>{stream.status}</span>
                    </td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 transition-opacity">
                        <button onClick={() => openEditModal(stream)} className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-[#006FBF] hover:bg-[#006FBF]/10 flex items-center justify-center border border-slate-200/60 transition-colors" title="Edit Stream">
                          <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                        </button>
                        <button onClick={() => openDeletePrompt(stream)} className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200/60 transition-colors" title="Delete Stream">
                          <i className="fa-solid fa-trash-can text-[10px]"></i>
                        </button>
                        <Link href={`/dashboard/academics/timetables?streamId=${stream.id}`} className="rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60 shadow-sm ml-1" title="View Timetable">
                          Timetable
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-xs">No matching grade streams found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</div>
        ) : filteredStreams.length > 0 ? (
          filteredStreams.map((stream) => (
            <div key={stream.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
              <div className="flex justify-between items-start gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]"><i className="fa-solid fa-layer-group text-sm" /></span>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-900 block truncate text-sm">{stream.streamName}</span>
                    <span className="font-medium text-slate-500 text-[11px] block">{stream.gradeName}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(stream.status)}`}>{stream.status}</span>
              </div>

              <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-solid fa-user-tie text-slate-400 w-5 text-center flex-shrink-0" />
                  <span className="truncate flex-1 font-medium text-slate-700">{stream.classTeacher}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0 mt-1">
                  <i className="fa-solid fa-door-open text-slate-400 w-5 text-center flex-shrink-0" />
                  <span className="truncate flex-1 text-slate-600">{stream.roomNumber || 'TBD'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 mb-1">
                  <span>Capacity</span>
                  <span>{stream.studentCount} / {stream.capacity}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((stream.studentCount / stream.capacity) * 100, 100)}%`, background: stream.status === 'Full' ? '#f43f5e' : `linear-gradient(90deg, ${BRAND.brightBlue}, ${BRAND.cyan})` }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => openEditModal(stream)} className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/60">
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <Link href={`/dashboard/academics/timetables?streamId=${stream.id}`} className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60">
                  <i className="fa-solid fa-calendar"></i> Timetable
                </Link>
                <button onClick={() => openDeletePrompt(stream)} className="flex justify-center items-center gap-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-100">
                  <i className="fa-solid fa-trash-can"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm">No streams found.</div>
        )}
      </div>

      {/* CREATE / EDIT STREAM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{isEditing ? 'Edit Grade Stream' : 'Add Grade Stream'}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{isEditing ? 'Update stream details and capacity.' : 'Register a new stream and allocate faculty.'}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50"><i className="fa-solid fa-xmark text-sm"></i></button>
            </div>

            <form onSubmit={handleSaveStream}>
              <div className="p-6 space-y-4 text-xs max-h-[60vh] overflow-y-auto">
                {formError && <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium mb-3"><i className="fa-solid fa-triangle-exclamation mr-2"></i>{formError}</div>}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Grade *</label>
                    <select required value={formData.classId} onChange={(e) => setFormData({ ...formData, classId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] bg-white transition-colors">
                      <option value="">Select Grade...</option>
                      {referenceData.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stream Name *</label>
                    <input type="text" required placeholder="e.g. East Wing" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Head / Class Teacher</label>
                  <select value={formData.classTeacherId} onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] bg-white transition-colors">
                    <option value="">Unassigned</option>
                    {referenceData.teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Capacity *</label>
                    <input type="number" required min="1" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Room Number</label>
                    <input type="text" placeholder="e.g. Rm 104" value={formData.roomNumber} onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors" />
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition-colors" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>{isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Publish Stream')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedStream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <i className="fa-solid fa-triangle-exclamation text-xl text-rose-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Stream</h3>
              <p className="mt-1.5 text-xs text-slate-500">Are you sure you want to permanently delete "<span className="font-semibold text-slate-700">{selectedStream.streamName}</span>"? This action cannot be undone.</p>
            </div>
            {formError && <div className="text-xs text-rose-600 font-medium">{formError}</div>}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting} className="w-full sm:w-auto rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="button" onClick={handleDeleteStream} disabled={isSubmitting} className="w-full sm:w-auto rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}