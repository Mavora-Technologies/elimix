// apps/web/app/dashboard/students/withdrawals/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

interface WithdrawalRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  withdrawalDate: string;
  reason: string;
  detailedNotes?: string | null;
  outstandingBalance: string | number;
  clearanceStatus: 'In Progress' | 'Cleared' | 'Hold - Balance Due';
  finalStatus: 'Pending' | 'Withdrawn' | 'Archived' | 'Cancelled';
  createdAt?: string;
}

interface StudentOption {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  enrollmentStatus: string;
}

export default function StudentWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [clearanceFilter, setClearanceFilter] = useState('All');
  const [finalStatusFilter, setFinalStatusFilter] = useState('All');

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [withdrawalDate, setWithdrawalDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('Relocation');
  const [detailedNotes, setDetailedNotes] = useState('');
  const [outstandingBalance, setOutstandingBalance] = useState('0.00');
  const [clearanceStatus, setClearanceStatus] = useState<'In Progress' | 'Cleared' | 'Hold - Balance Due'>('In Progress');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit / Manage Status Modal State
  const [managingRecord, setManagingRecord] = useState<WithdrawalRecord | null>(null);
  const [editClearanceStatus, setEditClearanceStatus] = useState<'In Progress' | 'Cleared' | 'Hold - Balance Due'>('In Progress');
  const [editFinalStatus, setEditFinalStatus] = useState<'Pending' | 'Withdrawn' | 'Archived' | 'Cancelled'>('Pending');
  const [editBalance, setEditBalance] = useState('0.00');

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

  const fetchWithdrawalsAndStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const [withRes, stuRes] = await Promise.all([
        fetch(`${apiUrl}/students/withdrawals`, { headers }),
        fetch(`${apiUrl}/students`, { headers }),
      ]);

      if (withRes.ok) {
        const wJson = await withRes.json();
        setWithdrawals(Array.isArray(wJson.data) ? wJson.data : []);
      } else {
        setError('Failed to synchronize withdrawal records from the database.');
      }

      if (stuRes.ok) {
        const sJson = await stuRes.json();
        const list = Array.isArray(sJson) ? sJson : Array.isArray(sJson.data) ? sJson.data : [];
        setStudents(list);
      }
    } catch (err: any) {
      console.error('Error loading withdrawals:', err);
      setError('Unable to reach the backend server.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchWithdrawalsAndStudents();
  }, [fetchWithdrawalsAndStudents]);

  const handleCreateWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/students/withdrawals`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          studentId,
          withdrawalDate,
          reason,
          detailedNotes: detailedNotes || null,
          outstandingBalance: Number(outstandingBalance) || 0,
          clearanceStatus,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to initiate student withdrawal');
      }

      setIsCreateModalOpen(false);
      setStudentId('');
      setDetailedNotes('');
      setOutstandingBalance('0.00');
      setClearanceStatus('In Progress');
      setSuccessMessage('Student withdrawal and exit clearance record created.');
      await fetchWithdrawalsAndStudents();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to create withdrawal record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openManageModal = (record: WithdrawalRecord) => {
    setManagingRecord(record);
    setEditClearanceStatus(record.clearanceStatus);
    setEditFinalStatus(record.finalStatus);
    setEditBalance(String(record.outstandingBalance || '0.00'));
  };

  const handleUpdateWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingRecord) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/students/withdrawals/${managingRecord.id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          clearanceStatus: editClearanceStatus,
          finalStatus: editFinalStatus,
          outstandingBalance: Number(editBalance) || 0,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update withdrawal record');
      }

      setManagingRecord(null);
      setSuccessMessage('Withdrawal clearance and final status updated.');
      await fetchWithdrawalsAndStudents();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Error updating withdrawal record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickArchive = async (record: WithdrawalRecord) => {
    try {
      const res = await fetch(`${apiUrl}/students/withdrawals/${record.id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          clearanceStatus: 'Cleared',
          finalStatus: 'Archived',
        }),
      });

      if (res.ok) {
        setSuccessMessage(`${record.studentName}'s profile has been cleared and archived.`);
        await fetchWithdrawalsAndStudents();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to archive withdrawal:', err);
    }
  };

  // Filtered list
  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((w) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        w.studentName.toLowerCase().includes(q) ||
        w.admissionNumber.toLowerCase().includes(q) ||
        w.reason.toLowerCase().includes(q) ||
        (w.detailedNotes || '').toLowerCase().includes(q);

      const matchesClearance = clearanceFilter === 'All' || w.clearanceStatus === clearanceFilter;
      const matchesFinal = finalStatusFilter === 'All' || w.finalStatus === finalStatusFilter;

      return matchesSearch && matchesClearance && matchesFinal;
    });
  }, [withdrawals, searchQuery, clearanceFilter, finalStatusFilter]);

  // Live KPI metrics
  const kpis = useMemo(() => {
    const total = withdrawals.length;
    const cleared = withdrawals.filter((w) => w.clearanceStatus === 'Cleared').length;
    const onHold = withdrawals.filter((w) => w.clearanceStatus === 'Hold - Balance Due').length;
    const totalArrears = withdrawals.reduce(
      (sum, w) => sum + (parseFloat(String(w.outstandingBalance)) || 0),
      0
    );
    return { total, cleared, onHold, totalArrears };
  }, [withdrawals]);

  const getClearanceBadge = (status: WithdrawalRecord['clearanceStatus']) => {
    switch (status) {
      case 'Cleared':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Hold - Balance Due':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getFinalStatusBadge = (status: WithdrawalRecord['finalStatus']) => {
    switch (status) {
      case 'Withdrawn':
        return 'bg-sky-50 text-[#0ea5e9] border-sky-200';
      case 'Archived':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#64748b] mb-1">
            <Link href="/dashboard/students" className="hover:text-[#0ea5e9]">Students</Link>
            <i className="fa-solid fa-chevron-right text-[9px]" />
            <span className="text-[#042954] font-semibold">Withdrawals & Exit Archiving</span>
          </div>
          <h1 className="text-[20px] font-extrabold text-[#042954] tracking-tight">
            Student Withdrawals & Exit Clearance
          </h1>
          <p className="text-[12px] text-[#64748b] mt-0.5">
            Track exit reasons, verify outstanding fee balances, complete exit clearance, and archive withdrawn student records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/students/transfers"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-right-left mr-2 text-xs text-[#0ea5e9]"></i> Transfers Workflow
          </Link>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-user-minus mr-2 text-xs"></i> Record Withdrawal
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between">
          <span><i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}</span>
          <button onClick={() => setError(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center justify-between shadow-sm">
          <span><i className="fa-solid fa-circle-check mr-2 text-emerald-600"></i>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Withdrawals</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : kpis.total.toLocaleString()}
            </h3>
            <span className="text-[11px] text-[#64748b] font-semibold mt-1 block">Logged exit requests</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-user-Large-slash text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Fully Cleared</p>
            <h3 className="text-[24px] font-extrabold text-emerald-600">
              {isLoading ? '...' : kpis.cleared.toLocaleString()}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Ready for archiving</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clipboard-check text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Financial Holds</p>
            <h3 className="text-[24px] font-extrabold text-rose-600">
              {isLoading ? '...' : kpis.onHold.toLocaleString()}
            </h3>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Pending fee settlement</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-hand-holding-dollar text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Outstanding Balances</p>
            <h3 className="text-[22px] font-extrabold text-[#042954]">
              {isLoading ? '...' : `KES ${kpis.totalArrears.toLocaleString()}`}
            </h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Uncollected exit arrears</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-scale-unbalanced text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search student name, admission no, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[12px] font-medium text-[#64748b]">
          <div className="flex items-center gap-2">
            <span>Clearance:</span>
            <select
              value={clearanceFilter}
              onChange={(e) => setClearanceFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="All">All Clearance States</option>
              <option value="In Progress">In Progress</option>
              <option value="Cleared">Cleared</option>
              <option value="Hold - Balance Due">Hold - Balance Due</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>Final Status:</span>
            <select
              value={finalStatusFilter}
              onChange={(e) => setFinalStatusFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Withdrawn">Withdrawn</option>
              <option value="Archived">Archived</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Withdrawals Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Student / Admission No</th>
                <th className="py-3.5 px-5">Exit Date</th>
                <th className="py-3.5 px-5">Withdrawal Reason & Notes</th>
                <th className="py-3.5 px-5">Outstanding Balance</th>
                <th className="py-3.5 px-5">Clearance Status</th>
                <th className="py-3.5 px-5">Final Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748b]">
                    <i className="fa-solid fa-circle-notch animate-spin mr-2 text-[#0ea5e9]"></i>
                    Loading student withdrawal records...
                  </td>
                </tr>
              ) : filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((record) => {
                  const balanceNum = parseFloat(String(record.outstandingBalance)) || 0;
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/75 transition-colors">
                      <td className="py-4 px-5">
                        <Link
                          href={`/dashboard/students/${record.studentId}`}
                          className="font-bold text-[#042954] hover:text-[#0ea5e9] transition-colors"
                        >
                          {record.studentName}
                        </Link>
                        <div className="text-[11px] text-[#64748b] font-mono mt-0.5">
                          {record.admissionNumber}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-xs font-mono text-slate-700">
                        {record.withdrawalDate}
                      </td>

                      <td className="py-4 px-5">
                        <span className="px-2.5 py-0.5 bg-slate-100 rounded-md text-[11px] font-bold text-[#042954]">
                          {record.reason}
                        </span>
                        {record.detailedNotes && (
                          <p className="text-[11px] text-[#64748b] mt-1 max-w-xs truncate" title={record.detailedNotes}>
                            {record.detailedNotes}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <span className={`font-mono font-bold text-xs ${balanceNum > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          KES {balanceNum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getClearanceBadge(record.clearanceStatus)}`}>
                          {record.clearanceStatus}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getFinalStatusBadge(record.finalStatus)}`}>
                          {record.finalStatus}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => openManageModal(record)}
                          className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors"
                        >
                          Update Status
                        </button>
                        {record.finalStatus !== 'Archived' && (
                          <button
                            onClick={() => handleQuickArchive(record)}
                            className="h-[32px] px-3 rounded-lg bg-slate-100 text-[#042954] hover:bg-slate-200 font-semibold text-[12px] transition-colors"
                            title="Clear & Archive Student Record"
                          >
                            <i className="fa-solid fa-box-archive mr-1"></i> Archive
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748b] text-[13px]">
                    No student withdrawal records found. Click <strong>Record Withdrawal</strong> to log an exit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: RECORD NEW STUDENT WITHDRAWAL
         ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#042954]">Record Student Withdrawal</h2>
                <p className="text-[11px] text-[#64748b]">
                  Initiates exit clearance and tracks outstanding balances before archiving.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCreateWithdrawal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-[#64748b] mb-1">Select Student *</label>
                <select
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] font-semibold text-[#042954] bg-white focus:outline-none focus:border-[#0ea5e9]"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((stu) => (
                    <option key={stu.id} value={stu.id}>
                      {stu.firstName} {stu.lastName} ({stu.admissionNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-[#64748b] mb-1">Withdrawal Date *</label>
                  <input
                    type="date"
                    required
                    value={withdrawalDate}
                    onChange={(e) => setWithdrawalDate(e.target.value)}
                    className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] text-[#042954]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-[#64748b] mb-1">Primary Reason *</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] font-semibold text-[#042954] bg-white"
                  >
                    <option value="Relocation">Family Relocation</option>
                    <option value="Financial">Financial Constraints</option>
                    <option value="Medical">Health / Medical Grounds</option>
                    <option value="Graduation">Completed Studies / Graduation</option>
                    <option value="Disciplinary">Disciplinary Exclusion</option>
                    <option value="Other">Other Personal Reasons</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-[#64748b] mb-1">Outstanding Fee Balance (KES)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={outstandingBalance}
                    onChange={(e) => {
                      setOutstandingBalance(e.target.value);
                      if (parseFloat(e.target.value) > 0) {
                        setClearanceStatus('Hold - Balance Due');
                      }
                    }}
                    className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] font-mono text-[#042954]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-[#64748b] mb-1">Initial Clearance Status</label>
                  <select
                    value={clearanceStatus}
                    onChange={(e) => setClearanceStatus(e.target.value as any)}
                    className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] font-semibold text-[#042954] bg-white"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Cleared">Cleared (Immediate Exit)</option>
                    <option value="Hold - Balance Due">Hold - Balance Due</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#64748b] mb-1">Exit Interview / Clearance Notes</label>
                <textarea
                  rows={3}
                  value={detailedNotes}
                  onChange={(e) => setDetailedNotes(e.target.value)}
                  placeholder="Record returned library books, uniform handover, or parent remarks..."
                  className="w-full p-3 rounded-xl border border-[#cbd5e1] text-[13px] text-[#042954]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Confirm Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: UPDATE CLEARANCE & FINAL ARCHIVE STATUS
         ===================================================================== */}
      {managingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-[16px] font-extrabold text-[#042954]">
                  Manage Exit Clearance
                </h3>
                <p className="text-[11px] text-[#64748b]">
                  {managingRecord.studentName} ({managingRecord.admissionNumber})
                </p>
              </div>
              <button
                onClick={() => setManagingRecord(null)}
                className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleUpdateWithdrawal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-[#64748b] mb-1">Outstanding Balance (KES)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                  className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] font-mono text-[#042954]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#64748b] mb-1">Departmental & Finance Clearance</label>
                <select
                  value={editClearanceStatus}
                  onChange={(e) => setEditClearanceStatus(e.target.value as any)}
                  className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] font-semibold text-[#042954] bg-white"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Hold - Balance Due">Hold - Balance Due</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#64748b] mb-1">Final Lifecycle Status</label>
                <select
                  value={editFinalStatus}
                  onChange={(e) => setEditFinalStatus(e.target.value as any)}
                  className="w-full h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[13px] font-semibold text-[#042954] bg-white"
                >
                  <option value="Pending">Pending Exit</option>
                  <option value="Withdrawn">Withdrawn (Deactivate Active Roster)</option>
                  <option value="Archived">Archived (Move to Alumni/Exit Vault)</option>
                  <option value="Cancelled">Cancelled (Retain Student Active)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setManagingRecord(null)}
                  className="h-[38px] px-4 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-[38px] px-5 rounded-xl bg-[#042954] text-white text-[12px] font-semibold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}