// apps/web/app/dashboard/students/transfers/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';

interface TransferRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  transferType: string;
  destinationSchool: string;
  reason: string;
  effectiveDate: string;
  academicCleared: boolean;
  financeCleared: boolean;
  libraryCleared: boolean;
  boardingCleared: boolean;
  certificateNumber: string;
  status: string;
}

interface StudentOption {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
}

export default function StudentTransfersPage() {
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [studentId, setStudentId] = useState('');
  const [transferType, setTransferType] = useState('Outgoing');
  const [destinationSchool, setDestinationSchool] = useState('');
  const [reason, setReason] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

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

  const fetchTransfers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const [transRes, stuRes] = await Promise.all([
        fetch(`${apiUrl}/students/transfers`, { headers }),
        fetch(`${apiUrl}/students`, { headers }),
      ]);

      if (transRes.ok) {
        const tJson = await transRes.json();
        setTransfers(Array.isArray(tJson.data) ? tJson.data : []);
      }
      if (stuRes.ok) {
        const sJson = await stuRes.json();
        setStudents(Array.isArray(sJson.data) ? sJson.data : []);
      }
    } catch (err: any) {
      setError('Unable to reach server.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/students/transfers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ studentId, transferType, destinationSchool, reason, effectiveDate }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to initiate transfer');
      setIsModalOpen(false);
      setDestinationSchool('');
      setReason('');
      await fetchTransfers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleClearanceDept = async (
    transfer: TransferRecord,
    field: 'academicCleared' | 'financeCleared' | 'libraryCleared' | 'boardingCleared'
  ) => {
    try {
      const res = await fetch(`${apiUrl}/students/transfers/${transfer.id}/clearance`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ [field]: !transfer[field] }),
      });
      if (res.ok) await fetchTransfers();
    } catch (err) {
      console.error('Error toggling clearance:', err);
    }
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-[#042954]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954]">Student Transfers & Clearance Workflow</h1>
          <p className="text-[12px] text-[#64748b]">
            Click department badges to sign off Academic, Finance, Library, and Boarding clearance before issuing Transfer Certificates.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold shadow-md flex items-center"
        >
          <i className="fa-solid fa-right-left mr-2"></i> Initiate Transfer Request
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase">
                <th className="py-3.5 px-5">Student / Cert No</th>
                <th className="py-3.5 px-5">Destination School</th>
                <th className="py-3.5 px-5">Department Clearances (Click to Sign Off)</th>
                <th className="py-3.5 px-5">Effective Date</th>
                <th className="py-3.5 px-5">Workflow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {isLoading ? (
                <tr><td colSpan={5} className="py-12 text-center text-slate-400">Loading transfer workflows...</td></tr>
              ) : transfers.length > 0 ? (
                transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954]">{t.studentName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{t.admissionNumber} • {t.certificateNumber}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold">{t.destinationSchool}</div>
                      <div className="text-xs text-slate-500">{t.reason}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1.5">
                        {([
                          ['academicCleared', 'Academic'],
                          ['financeCleared', 'Finance'],
                          ['libraryCleared', 'Library'],
                          ['boardingCleared', 'Boarding'],
                        ] as const).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => toggleClearanceDept(t, key)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                              t[key]
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <i className={`fa-solid ${t[key] ? 'fa-check-circle' : 'fa-clock'} mr-1`}></i>
                            {label}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-xs font-mono">{t.effectiveDate}</td>
                    <td className="py-4 px-5">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        t.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-12 text-center text-slate-400">No transfer requests initiated yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-extrabold text-[#042954] mb-4">Initiate Student Transfer</h3>
            <form onSubmit={handleCreateTransfer} className="space-y-3 text-xs">
              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1">Student *</label>
                <select required value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1">Destination School *</label>
                <input type="text" required value={destinationSchool} onChange={(e) => setDestinationSchool(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1">Effective Date *</label>
                <input type="date" required value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1">Reason for Transfer *</label>
                <textarea rows={3} required value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-300 font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-[#042954] text-white font-semibold">
                  {isSubmitting ? 'Submitting...' : 'Start Clearance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}