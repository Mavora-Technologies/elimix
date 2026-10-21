// apps/web/app/dashboard/academics/structure/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface AcademicTerm {
  id: string;
  academicYearId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface StreamItem {
  id: string;
  classId: string;
  name: string;
  capacity: number;
}

interface ClassItem {
  id: string;
  name: string;
  numericLevel: number;
  enrolledCount: number;
  totalCapacity: number;
  streams: StreamItem[];
}

export default function AcademicStructurePage() {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [terms, setTerms] = useState<AcademicTerm[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'year' | 'term' | 'class' | 'stream' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [yearName, setYearName] = useState('2026 Academic Year');
  const [yearStart, setYearStart] = useState('2026-01-05');
  const [yearEnd, setYearEnd] = useState('2026-11-20');
  const [yearCurrent, setYearCurrent] = useState(true);

  const [termYearId, setTermYearId] = useState('');
  const [termName, setTermName] = useState('Term 1');
  const [termStart, setTermStart] = useState('2026-01-05');
  const [termEnd, setTermEnd] = useState('2026-04-10');
  const [termCurrent, setTermCurrent] = useState(true);

  const [className, setClassName] = useState('');
  const [numericLevel, setNumericLevel] = useState(1);

  const [streamClassId, setStreamClassId] = useState('');
  const [streamName, setStreamName] = useState('');
  const [streamCapacity, setStreamCapacity] = useState(40);

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

  const fetchStructure = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/academics/structure`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        setYears(json.data?.academicYears || []);
        setTerms(json.data?.terms || []);
        setClasses(json.data?.classes || []);
        if (json.data?.academicYears?.[0]?.id) setTermYearId(json.data.academicYears[0].id);
        if (json.data?.classes?.[0]?.id) setStreamClassId(json.data.classes[0].id);
      } else {
        setError('Failed to load academic structure.');
      }
    } catch {
      setError('Unable to reach server.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchStructure();
  }, [fetchStructure]);

  const submitForm = async (endpoint: string, body: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/academics/${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Operation failed');
      setActiveModal(null);
      await fetchStructure();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-[#042954]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954]">Academic Structure: Years, Terms, Classes & Streams</h1>
          <p className="text-[12px] text-[#64748b]">
            Configure institutional academic years, terms/semesters, grade levels, and classroom stream capacities.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveModal('year')} className="h-[36px] px-3.5 rounded-xl bg-white border border-[#cbd5e1] text-xs font-bold text-[#042954] hover:bg-slate-50">
            + Academic Year
          </button>
          <button onClick={() => setActiveModal('term')} className="h-[36px] px-3.5 rounded-xl bg-white border border-[#cbd5e1] text-xs font-bold text-[#042954] hover:bg-slate-50">
            + Term / Semester
          </button>
          <button onClick={() => setActiveModal('class')} className="h-[36px] px-3.5 rounded-xl bg-[#042954] text-white text-xs font-bold hover:opacity-95">
            + New Class / Grade
          </button>
          <button onClick={() => setActiveModal('stream')} className="h-[36px] px-3.5 rounded-xl bg-[#0ea5e9] text-white text-xs font-bold hover:opacity-95">
            + New Stream
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Academic Years & Terms Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
          <h3 className="text-sm font-bold text-[#042954] mb-3">Academic Years ({years.length})</h3>
          <div className="space-y-2.5">
            {years.map((y) => (
              <div key={y.id} className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#042954]">{y.name}</span>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {new Date(y.startDate).toLocaleDateString()} — {new Date(y.endDate).toLocaleDateString()}
                  </p>
                </div>
                {y.isCurrent && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Year
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
          <h3 className="text-sm font-bold text-[#042954] mb-3">Terms & Semesters ({terms.length})</h3>
          <div className="space-y-2.5">
            {terms.length > 0 ? (
              terms.map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-[#042954]">{t.name}</span>
                    <p className="text-[11px] text-slate-500 font-mono">{t.startDate} — {t.endDate}</p>
                  </div>
                  {t.isCurrent && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 text-[#0ea5e9] border border-sky-200">
                      Current Term
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No terms configured yet. Click "+ Term / Semester" above.</p>
            )}
          </div>
        </div>
      </div>

      {/* Classes & Streams Grid */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
        <h3 className="text-base font-bold text-[#042954] mb-4">Classes, Grades & Assigned Streams ({classes.length})</h3>
        {isLoading ? (
          <p className="text-xs text-slate-400 py-8 text-center">Loading classes and streams...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div key={cls.id} className="p-4 rounded-2xl border border-slate-200 bg-[#f8fafc] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-extrabold text-[15px] text-[#042954]">{cls.name}</h4>
                    <span className="text-[11px] font-bold text-[#0ea5e9] bg-sky-50 px-2.5 py-0.5 rounded-full">
                      {cls.enrolledCount} / {cls.totalCapacity} Students
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cls.streams.length > 0 ? (
                      cls.streams.map((st) => (
                        <span key={st.id} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-[#042954]">
                          {st.name} <span className="text-slate-400 font-normal">(Cap: {st.capacity})</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400">No streams added</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals for Year / Term / Class / Stream */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            {activeModal === 'year' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitForm('years', { name: yearName, startDate: yearStart, endDate: yearEnd, isCurrent: yearCurrent });
                }}
                className="space-y-3"
              >
                <h3 className="text-base font-extrabold text-[#042954]">Create Academic Year</h3>
                <input type="text" required value={yearName} onChange={(e) => setYearName(e.target.value)} placeholder="2026 Academic Year" className="w-full h-9 px-3 rounded-xl border border-slate-300" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" required value={yearStart} onChange={(e) => setYearStart(e.target.value)} className="h-9 px-3 rounded-xl border border-slate-300" />
                  <input type="date" required value={yearEnd} onChange={(e) => setYearEnd(e.target.value)} className="h-9 px-3 rounded-xl border border-slate-300" />
                </div>
                <label className="flex items-center gap-2 font-semibold">
                  <input type="checkbox" checked={yearCurrent} onChange={(e) => setYearCurrent(e.target.checked)} /> Set as Current Active Year
                </label>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl border">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-[#042954] text-white font-bold">Save Year</button>
                </div>
              </form>
            )}

            {activeModal === 'term' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitForm('terms', { academicYearId: termYearId, name: termName, startDate: termStart, endDate: termEnd, isCurrent: termCurrent });
                }}
                className="space-y-3"
              >
                <h3 className="text-base font-extrabold text-[#042954]">Create Term / Semester</h3>
                <select required value={termYearId} onChange={(e) => setTermYearId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                  <option value="">-- Select Academic Year --</option>
                  {years.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                </select>
                <input type="text" required value={termName} onChange={(e) => setTermName(e.target.value)} placeholder="Term 1 / Semester 1" className="w-full h-9 px-3 rounded-xl border border-slate-300" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" required value={termStart} onChange={(e) => setTermStart(e.target.value)} className="h-9 px-3 rounded-xl border border-slate-300" />
                  <input type="date" required value={termEnd} onChange={(e) => setTermEnd(e.target.value)} className="h-9 px-3 rounded-xl border border-slate-300" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl border">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-[#042954] text-white font-bold">Save Term</button>
                </div>
              </form>
            )}

            {activeModal === 'class' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitForm('classes', { name: className, numericLevel: Number(numericLevel) });
                }}
                className="space-y-3"
              >
                <h3 className="text-base font-extrabold text-[#042954]">Create Class / Grade Level</h3>
                <input type="text" required value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Grade 7 or Form 1" className="w-full h-9 px-3 rounded-xl border border-slate-300" />
                <input type="number" required value={numericLevel} onChange={(e) => setNumericLevel(Number(e.target.value))} placeholder="Numeric Order (1-12)" className="w-full h-9 px-3 rounded-xl border border-slate-300" />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl border">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-[#042954] text-white font-bold">Save Class</button>
                </div>
              </form>
            )}

            {activeModal === 'stream' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitForm('streams', { classId: streamClassId, name: streamName, capacity: Number(streamCapacity) });
                }}
                className="space-y-3"
              >
                <h3 className="text-base font-extrabold text-[#042954]">Create Class Stream</h3>
                <select required value={streamClassId} onChange={(e) => setStreamClassId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                  <option value="">-- Choose Class --</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="text" required value={streamName} onChange={(e) => setStreamName(e.target.value)} placeholder="Stream Name (e.g. North, East, Blue)" className="w-full h-9 px-3 rounded-xl border border-slate-300" />
                <input type="number" required value={streamCapacity} onChange={(e) => setStreamCapacity(Number(e.target.value))} placeholder="Capacity (40)" className="w-full h-9 px-3 rounded-xl border border-slate-300" />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl border">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-[#0ea5e9] text-white font-bold">Save Stream</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}