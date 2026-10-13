// apps/web/app/dashboard/teachers/attendance/page.tsx
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

// Dynamic API URL for Local/Production compatibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface TeacherAttendanceRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  employeeNumber: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave' | 'Not Marked';
}

export default function TeacherAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<TeacherAttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [queryDate, setQueryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<TeacherAttendanceRecord | null>(null);
  
  const [attFormData, setAttFormData] = useState({
    status: 'Present' as TeacherAttendanceRecord['status'],
    checkIn: '',
    checkOut: '',
  });

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const userStr = localStorage.getItem('elimix_user');
    let tenantId = '00000000-0000-0000-0000-000000000000';
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        const userJson = JSON.parse(userStr);
        if (userJson && userJson.tenantId) tenantId = userJson.tenantId;
      } catch (e) {}
    }
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-tenant-id': tenantId };
  };

  const fetchAttendance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/teachers/attendance?date=${queryDate}`, { headers: getHeaders() });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to load attendance records');
      setAttendanceRecords(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [queryDate]);

  // --- Modal Handlers ---
  const openUpdateModal = (record: TeacherAttendanceRecord) => {
    setSelectedRecord(record);
    setAttFormData({
      status: record.status === 'Not Marked' ? 'Present' : record.status,
      checkIn: record.checkIn === '--' ? '' : record.checkIn,
      checkOut: record.checkOut === '--' ? '' : record.checkOut,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const setCurrentTime = (field: 'checkIn' | 'checkOut') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setAttFormData(prev => ({ ...prev, [field]: timeStr }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        teacherId: selectedRecord.teacherId,
        date: queryDate,
        status: attFormData.status,
        checkIn: attFormData.checkIn || null,
        checkOut: attFormData.checkOut || null,
      };

      const res = await fetch(`${API_BASE_URL}/teachers/attendance`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        if (result.errors) throw new Error(result.errors.map((err: any) => err.message).join(', '));
        throw new Error(result.message || 'Failed to update attendance');
      }

      await fetchAttendance();
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Filters ---
  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch =
      record.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || record.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  // --- Dynamic Metrics ---
  const totalRecords = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
  const lateCount = attendanceRecords.filter(r => r.status === 'Late').length;
  const absentLeaveCount = attendanceRecords.filter(r => r.status === 'Absent' || r.status === 'On Leave').length;
  const markedCount = presentCount + lateCount + absentLeaveCount;
  const attendanceRate = markedCount > 0 ? (((presentCount + lateCount) / markedCount) * 100).toFixed(1) : '0.0';

  // --- Helpers ---
  const getStatusBadge = (status: TeacherAttendanceRecord['status']) => {
    switch (status) {
      case 'Present': return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'Late': return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      case 'Absent': return 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20';
      case 'On Leave': return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20';
      case 'Not Marked': return 'bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200 border-dashed';
      default: return 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200';
    }
  };

  const formatTime12h = (time24: string) => {
    if (!time24 || time24 === '--') return '--';
    const [h, m] = time24.split(':');
    if (!h || !m) return time24;
    const hNum = parseInt(h, 10);
    const ampm = hNum >= 12 ? 'PM' : 'AM';
    const h12 = hNum % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const availableDepartments = Array.from(new Set(attendanceRecords.map(r => r.department)));

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff & Teacher Attendance</h1>
          <p className="text-sm text-slate-500">Monitor daily check-ins, punctuality, and leaves for faculty.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/teachers" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <i className="fa-solid fa-chalkboard-user mr-2 text-[#006FBF]"></i> Teachers Directory
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm flex items-center shadow-sm">
          <i className="fa-solid fa-triangle-exclamation text-rose-600 mr-2 text-base"></i><span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Total Scheduled</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalRecords}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Present / Late</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{presentCount + lateCount} <span className="text-xs font-medium text-slate-400">({attendanceRate}%)</span></p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Late Arrivals</p>
          <p className="mt-1 text-2xl font-bold text-amber-500">{lateCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Absent / Leave</p>
          <p className="mt-1 text-2xl font-bold text-rose-500">{absentLeaveCount}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="flex gap-2 w-full lg:w-auto">
          <div className="relative flex-1">
            <i className="fa-solid fa-calendar absolute left-3 top-3 text-xs text-slate-400"></i>
            <input type="date" value={queryDate} onChange={(e) => setQueryDate(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white" />
          </div>
        </div>

        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3 text-xs text-slate-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search records..." className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-xs outline-none focus:border-[#006FBF]/40 focus:bg-white" />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-medium outline-none focus:border-[#006FBF]/40 focus:bg-white">
            <option value="All">All Departments</option>
            {availableDepartments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-medium outline-none focus:border-[#006FBF]/40 focus:bg-white">
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
            <option value="On Leave">On Leave</option>
            <option value="Not Marked">Not Marked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto whitespace-nowrap min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 pl-5 pr-3 min-w-[200px]">Teacher / Employee No.</th>
                <th className="px-4 py-4">Department</th>
                <th className="px-4 py-4 w-[120px]">Check-In</th>
                <th className="px-4 py-4 w-[120px]">Check-Out</th>
                <th className="px-4 py-4 w-[120px]">Status</th>
                <th className="py-4 pl-3 pr-5 text-right w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading records...</td></tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4 pl-5 pr-3">
                      <div className="font-semibold text-slate-900">{record.teacherName}</div>
                      <div className="font-mono text-[10px] text-slate-400">{record.employeeNumber}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-700 font-medium">{record.department}</td>
                    <td className="px-4 py-4 font-mono font-semibold text-slate-800">{formatTime12h(record.checkIn)}</td>
                    <td className="px-4 py-4 font-mono font-semibold text-slate-800">{formatTime12h(record.checkOut)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <button 
                        onClick={() => openUpdateModal(record)} 
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60 shadow-sm"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500">No attendance records found for this date.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE ATTENDANCE MODAL */}
      {isModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Update Attendance</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{selectedRecord.teacherName} - {queryDate}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark text-sm" /></button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl flex items-center font-medium">
                  <i className="fa-solid fa-circle-exclamation mr-2"></i> <span className="truncate">{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status <span className="text-rose-500">*</span></label>
                <select 
                  value={attFormData.status} 
                  onChange={(e) => setAttFormData({ ...attFormData, status: e.target.value as any })} 
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 font-medium outline-none focus:border-[#006FBF] bg-white"
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">Check-In</label>
                    <button type="button" onClick={() => setCurrentTime('checkIn')} className="text-[9px] text-[#006FBF] font-semibold hover:underline">Set Now</button>
                  </div>
                  <input 
                    type="time" 
                    value={attFormData.checkIn} 
                    onChange={(e) => setAttFormData({ ...attFormData, checkIn: e.target.value })} 
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF] font-mono" 
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">Check-Out</label>
                    <button type="button" onClick={() => setCurrentTime('checkOut')} className="text-[9px] text-[#006FBF] font-semibold hover:underline">Set Now</button>
                  </div>
                  <input 
                    type="time" 
                    value={attFormData.checkOut} 
                    onChange={(e) => setAttFormData({ ...attFormData, checkOut: e.target.value })} 
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#006FBF] font-mono" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="rounded-xl px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:opacity-95 disabled:opacity-50" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
                  {isSubmitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}