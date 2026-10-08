// apps/web/app/dashboard/academics/timetables/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TimetableBlock {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  subjectName: string;
  subjectCode: string;
  teacherName: string;
  streamName: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

export default function TimetablesPage() {
  const [blocks, setBlocks] = useState<TimetableBlock[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]); // Assuming an API for streams exists
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI Filters
  const [viewMode, setViewMode] = useState<'Stream' | 'Teacher'>('Stream');
  const [activeFilterId, setActiveFilterId] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    subjectId: '',
    teacherId: '',
    streamId: '',
    dayOfWeek: 'Monday',
    startTime: '08:00',
    endTime: '09:00',
    room: '',
    term: 'Term 1 2026', // Default term
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

  const fetchTimetableData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const filterQuery = activeFilterId ? `?${viewMode === 'Stream' ? 'streamId' : 'teacherId'}=${activeFilterId}` : '';
      
      const [blocksRes, subRes, teachRes, streamsRes] = await Promise.all([
        fetch(`http://localhost:3001/api/v1/academics/timetables${filterQuery}`, { headers }),
        fetch('http://localhost:3001/api/v1/academics/subjects', { headers }),
        fetch('http://localhost:3001/api/v1/teachers', { headers }),
        fetch('http://localhost:3001/api/v1/academics/timetables/streams', { headers }) // Updated endpoint!
      ]);

      if (!blocksRes.ok) throw new Error('Failed to load master schedule.');

      const blocksResult = await blocksRes.json();
      const subResult = await subRes.json();
      const teachResult = await teachRes.json();
      
      let realStreams = [];
      if (streamsRes.ok) {
         const streamsResult = await streamsRes.json();
         realStreams = streamsResult.data || [];
      }

      setBlocks(blocksResult.data || []);
      setSubjects(subResult.data || []);
      setTeachers(teachResult.data || []);
      setStreams(realStreams); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTimetableData(); }, [activeFilterId]);

  // --- Modal Handlers ---
  const openAddModal = (day?: string, timeSlot?: string) => {
    let endTimeStr = '09:00';
    if (timeSlot) {
      const [h, m] = timeSlot.split(':');
      endTimeStr = `${String(parseInt(h) + 1).padStart(2, '0')}:${m}`;
    }

    setFormData({
      subjectId: '',
      teacherId: '',
      streamId: '',
      dayOfWeek: day || 'Monday',
      startTime: timeSlot || '08:00',
      endTime: endTimeStr,
      room: '',
      term: 'Term 1 2026',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch(`http://localhost:3001/api/v1/academics/timetables`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      
      if (!res.ok) {
        if (result.errors) throw new Error(result.errors.map((err: any) => err.message).join(', '));
        throw new Error(result.message || 'Failed to schedule block');
      }

      await fetchTimetableData();
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (!confirm('Remove this block from the timetable?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/academics/timetables/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) await fetchTimetableData();
    } catch (err) {
      console.error(err);
    }
  };

  // Visual Mapper: Find block for specific day and exact hour
  const getBlockForSlot = (day: string, hour: string) => {
    return blocks.find(b => b.dayOfWeek === day && b.startTime.startsWith(hour));
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
            <Link href="/dashboard" className="hover:text-[#006FBF]">Dashboard</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/academics" className="hover:text-[#006FBF]">Academics</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">Master Schedule</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Master Schedule & Timetables</h1>
          <p className="mt-0.5 text-xs text-slate-500 truncate">Manage weekly class rosters, room allocations, and faculty slots.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex justify-center items-center rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
            <i className="fa-solid fa-print mr-2 text-[#006FBF]" /> Print Schedule
          </button>
          <button onClick={() => openAddModal()} className="inline-flex justify-center items-center rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95" style={{ background: `linear-gradient(135deg, #006FBF, #04B1D6)` }}>
            <i className="fa-solid fa-plus mr-2" /> Add Time Block
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm flex items-center shadow-sm">
          <i className="fa-solid fa-triangle-exclamation text-rose-600 mr-2 text-base"></i><span>{error}</span>
        </div>
      )}

      {/* Toolbar / Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="flex p-1 bg-slate-100 rounded-lg max-w-[200px]">
          <button onClick={() => setViewMode('Stream')} className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all ${viewMode === 'Stream' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>By Class</button>
          <button onClick={() => setViewMode('Teacher')} className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all ${viewMode === 'Teacher' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>By Teacher</button>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select value={activeFilterId} onChange={(e) => setActiveFilterId(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white">
            <option value="">Viewing: Entire School</option>
            {viewMode === 'Teacher' 
              ? teachers.map(t => <option key={t.id} value={t.id}>{t.fullName || `${t.firstName} ${t.lastName}`}</option>)
              : streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
            }
          </select>
        </div>
      </div>

      {/* Interactive Grid Calendar */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr>
                <th className="w-20 border-b border-r border-slate-100 bg-slate-50/70 p-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Time</th>
                {DAYS.map(day => (
                  <th key={day} className="border-b border-r border-slate-100 bg-slate-50/70 p-3 text-center text-[11px] font-bold text-slate-700 w-[20%]">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="py-20 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin text-2xl text-[#006FBF]"></i><p className="mt-2 text-xs">Loading Schedule Grid...</p></td></tr>
              ) : (
                TIME_SLOTS.map((time, idx) => (
                  <tr key={time} className="group">
                    <td className="border-b border-r border-slate-100 p-2 text-center align-top bg-slate-50/30">
                      <span className="text-[10px] font-bold text-slate-500">{time}</span>
                    </td>
                    {DAYS.map(day => {
                      const block = getBlockForSlot(day, time);
                      // Visual breaks for lunch/recess
                      if (time === '13:00') return <td key={day} className="border-b border-r border-slate-100 bg-slate-50/80 text-center text-[10px] font-bold text-slate-400 italic py-4" colSpan={1}>{idx === 5 ? 'LUNCH BREAK' : ''}</td>;

                      return (
                        <td key={day} className="border-b border-r border-slate-100 p-1.5 align-top h-[90px] w-[20%] transition-colors hover:bg-slate-50/50 relative">
                          {block ? (
                            <div className="h-full w-full rounded-lg border border-[#006FBF]/20 bg-[#006FBF]/5 p-2 shadow-sm flex flex-col justify-between group/block">
                              <div>
                                <div className="flex justify-between items-start">
                                  <span className="text-[10px] font-bold text-[#012E54] block truncate">{block.subjectCode}</span>
                                  <span className="text-[9px] font-semibold bg-white border border-[#006FBF]/10 text-[#006FBF] px-1.5 rounded truncate max-w-[60px]">{block.room}</span>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-800 block truncate mt-1">{block.subjectName}</span>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600 truncate max-w-[80%]">
                                  <i className="fa-solid fa-user-tie text-slate-400"></i> <span className="truncate">{block.teacherName}</span>
                                </div>
                                <button onClick={() => handleDeleteBlock(block.id)} className="text-rose-400 hover:text-rose-600 opacity-0 group-hover/block:opacity-100 transition-opacity">
                                  <i className="fa-solid fa-trash-can text-[10px]"></i>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-lg border border-dashed border-slate-200/60 bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openAddModal(day, time)} className="text-[10px] font-semibold text-[#006FBF] hover:underline px-4 py-2"><i className="fa-solid fa-plus mr-1"></i> Add Slot</button>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TIMETABLE BLOCK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">Schedule Time Block</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa-solid fa-xmark text-sm" /></button>
            </div>

            <form onSubmit={handleCreateBlock} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl flex items-center font-medium">
                  <i className="fa-solid fa-circle-exclamation mr-2"></i> <span className="truncate">{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 border-b border-slate-100 pb-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Day of Week</label>
                  <select disabled value={formData.dayOfWeek} className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-slate-500 cursor-not-allowed">
                    <option value={formData.dayOfWeek}>{formData.dayOfWeek}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <div className="flex items-center gap-2">
                    <input disabled value={formData.startTime} className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-slate-500 font-mono text-center cursor-not-allowed" />
                    <span className="text-slate-400 font-bold">-</span>
                    <input disabled value={formData.endTime} className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-slate-500 font-mono text-center cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject <span className="text-rose-500">*</span></label>
                <select required value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF] bg-white">
                  <option value="">Select a subject...</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teacher <span className="text-rose-500">*</span></label>
                <select required value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF] bg-white">
                  <option value="">Select an instructor...</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName || `${t.firstName} ${t.lastName}`}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class / Stream <span className="text-rose-500">*</span></label>
                  <select required value={formData.streamId} onChange={(e) => setFormData({ ...formData, streamId: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF] bg-white">
                    <option value="">Select class...</option>
                    {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room <span className="text-rose-500">*</span></label>
                  <input type="text" required placeholder="e.g. Lab 3" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF]" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="rounded-xl px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:opacity-95 disabled:opacity-50" style={{ background: `linear-gradient(135deg, #006FBF, #04B1D6)` }}>
                  {isSubmitting ? 'Booking...' : 'Book Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}