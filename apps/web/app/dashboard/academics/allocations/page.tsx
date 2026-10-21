// apps/web/app/dashboard/academics/allocations/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface TeacherWorkload {
  id: string;
  staffNumber: string;
  fullName: string;
  email: string;
  specialization: string;
  departmentName: string;
  allocatedSubjectsCount: number;
  weeklyPeriods: number;
  maxRecommendedPeriods: number;
  workloadStatus: 'Optimal' | 'Under-utilized' | 'Overloaded';
}

interface AllocationRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  staffNumber: string;
  departmentName: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  classId: string;
  className: string;
  streamId?: string | null;
  streamName: string;
  academicYearName: string;
}

export default function TeacherAllocationsPage() {
  const [allocations, setAllocations] = useState<AllocationRecord[]>([]);
  const [workloads, setWorkloads] = useState<TeacherWorkload[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string; code: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [streams, setStreams] = useState<{ id: string; classId: string; name: string }[]>([]);
  const [years, setYears] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Allocation Form
  const [teacherId, setTeacherId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [classId, setClassId] = useState('');
  const [streamId, setStreamId] = useState('');
  const [academicYearId, setAcademicYearId] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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

  const fetchAllocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/academics/allocations`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        setAllocations(json.data?.allocations || []);
        setWorkloads(json.data?.teacherWorkloads || []);
        setSubjects(json.data?.subjects || []);
        setClasses(json.data?.classes || []);
        setStreams(json.data?.streams || []);
        setYears(json.data?.academicYears || []);
        if (json.data?.academicYears?.[0]?.id) setAcademicYearId(json.data.academicYears[0].id);
      }
    } catch {
      setError('Failed to load teacher allocations.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  const availableStreams = useMemo(() => {
    if (!classId) return [];
    return streams.filter((s) => s.classId === classId);
  }, [streams, classId]);

  const handleCreateAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/academics/allocations`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          teacherId,
          subjectId,
          classId,
          streamId: streamId || null,
          academicYearId,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Allocation failed');
      setIsModalOpen(false);
      await fetchAllocations();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveAllocation = async (id: string) => {
    const res = await fetch(`${apiUrl}/academics/allocations/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (res.ok) await fetchAllocations();
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-[#042954]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954]">Intelligent Teacher Allocation & Workload</h1>
          <p className="text-[12px] text-[#64748b]">
            Assign teachers to classes, streams, and subjects while balancing weekly lesson workloads.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-xs font-bold shadow-md"
        >
          + Allocate Subject to Teacher
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">{error}</div>
      )}

      {/* Teacher Workload Balancing Cards */}
      <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm mb-6">
        <h3 className="text-sm font-bold text-[#042954] mb-4">Teacher Weekly Workload Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workloads.map((t) => {
            const pct = Math.min(Math.round((t.weeklyPeriods / t.maxRecommendedPeriods) * 100), 100);
            return (
              <div key={t.id} className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-sm text-[#042954]">{t.fullName}</div>
                    <div className="text-[11px] text-slate-500">{t.departmentName} • {t.specialization}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    t.workloadStatus === 'Overloaded'
                      ? 'bg-rose-50 text-rose-700'
                      : t.workloadStatus === 'Optimal'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-sky-50 text-[#0ea5e9]'
                  }`}>
                    {t.workloadStatus}
                  </span>
                </div>
                <div className="mt-3 flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>{t.allocatedSubjectsCount} Class Subjects</span>
                  <span>{t.weeklyPeriods} / {t.maxRecommendedPeriods} Lessons/Wk</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0ea5e9]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Allocations Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3.5 px-5">Teacher</th>
                <th className="py-3.5 px-5">Subject / Learning Area</th>
                <th className="py-3.5 px-5">Class & Stream</th>
                <th className="py-3.5 px-5">Academic Year</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="py-12 text-center text-slate-400">Loading allocations...</td></tr>
              ) : allocations.length > 0 ? (
                allocations.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-4 px-5 font-bold text-[#042954]">{a.teacherName}</td>
                    <td className="py-4 px-5 font-semibold">{a.subjectName} ({a.subjectCode})</td>
                    <td className="py-4 px-5">{a.className} — {a.streamName}</td>
                    <td className="py-4 px-5 text-slate-500">{a.academicYearName}</td>
                    <td className="py-4 px-5 text-right">
                      <button onClick={() => handleRemoveAllocation(a.id)} className="px-3 py-1 rounded-lg bg-rose-50 text-rose-600 font-bold">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-12 text-center text-slate-400">No subject allocations assigned yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-xs">
            <h3 className="text-base font-extrabold text-[#042954] mb-4">Allocate Teacher to Class & Subject</h3>
            <form onSubmit={handleCreateAllocation} className="space-y-3">
              <select required value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                <option value="">-- Select Teacher --</option>
                {workloads.map((t) => <option key={t.id} value={t.id}>{t.fullName} ({t.weeklyPeriods} periods/wk)</option>)}
              </select>
              <select required value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                <option value="">-- Select Subject --</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
              </select>
              <select required value={classId} onChange={(e) => { setClassId(e.target.value); setStreamId(''); }} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                <option value="">-- Select Class --</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={streamId} onChange={(e) => setStreamId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                <option value="">All Streams in Class</option>
                {availableStreams.map((st) => <option key={st.id} value={st.id}>{st.name}</option>)}
              </select>
              <select required value={academicYearId} onChange={(e) => setAcademicYearId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                <option value="">-- Select Academic Year --</option>
                {years.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
              </select>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#042954] text-white font-bold">Assign Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}