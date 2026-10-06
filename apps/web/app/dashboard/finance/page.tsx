'use client';

import { useState } from 'react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  studentName: string;
  admissionNo: string;
  gradeClass: string;
  term: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Overdue' | 'Pending';
  lastPaymentMethod?: string;
}

interface FeeStructureItem {
  id: string;
  title: string;
  gradeLevel: string;
  academicYear: string;
  term: string;
  tuitionFee: number;
  transportFee: number;
  cateringFee: number;
  activityFee: number;
  total: number;
}

const mockInvoices: Invoice[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'INV-2026-0891',
    studentName: 'Amina Mohamed',
    admissionNo: 'STA-2024-012',
    gradeClass: 'Grade 8 Red',
    term: 'Term 3 - 2026',
    totalAmount: 45000,
    paidAmount: 45000,
    balance: 0,
    dueDate: '2026-09-15',
    status: 'Paid',
    lastPaymentMethod: 'M-Pesa (QK789231)',
  },
  {
    id: 'inv-02',
    invoiceNumber: 'INV-2026-0892',
    studentName: 'Brian Kipruto',
    admissionNo: 'STA-2024-045',
    gradeClass: 'Grade 7 Blue',
    term: 'Term 3 - 2026',
    totalAmount: 42000,
    paidAmount: 25000,
    balance: 17000,
    dueDate: '2026-09-15',
    status: 'Partial',
    lastPaymentMethod: 'Bank Transfer (Equity)',
  },
  {
    id: 'inv-03',
    invoiceNumber: 'INV-2026-0893',
    studentName: 'Clara Wanjiku',
    admissionNo: 'STA-2023-112',
    gradeClass: 'Form 2 West',
    term: 'Term 3 - 2026',
    totalAmount: 58000,
    paidAmount: 0,
    balance: 58000,
    dueDate: '2026-09-10',
    status: 'Overdue',
  },
  {
    id: 'inv-04',
    invoiceNumber: 'INV-2026-0894',
    studentName: 'David Ochieng',
    admissionNo: 'STA-2025-078',
    gradeClass: 'Grade 4 Green',
    term: 'Term 3 - 2026',
    totalAmount: 38000,
    paidAmount: 38000,
    balance: 0,
    dueDate: '2026-09-20',
    status: 'Paid',
    lastPaymentMethod: 'M-Pesa (QK789901)',
  },
  {
    id: 'inv-05',
    invoiceNumber: 'INV-2026-0895',
    studentName: 'Esther Mutua',
    admissionNo: 'STA-2024-088',
    gradeClass: 'Grade 6 Yellow',
    term: 'Term 3 - 2026',
    totalAmount: 40000,
    paidAmount: 10000,
    balance: 30000,
    dueDate: '2026-10-15',
    status: 'Pending',
    lastPaymentMethod: 'Cash Deposit',
  },
];

const mockFeeStructures: FeeStructureItem[] = [
  {
    id: 'fs-1',
    title: 'Primary School (Grade 1 - 6) Standard Structure',
    gradeLevel: 'Grade 1 - 6',
    academicYear: '2026',
    term: 'Term 3',
    tuitionFee: 28000,
    transportFee: 7000,
    cateringFee: 4000,
    activityFee: 1000,
    total: 40000,
  },
  {
    id: 'fs-2',
    title: 'Junior Secondary (Grade 7 - 9) Standard Structure',
    gradeLevel: 'Grade 7 - 9',
    academicYear: '2026',
    term: 'Term 3',
    tuitionFee: 32000,
    transportFee: 8000,
    cateringFee: 4000,
    activityFee: 1000,
    total: 45000,
  },
  {
    id: 'fs-3',
    title: 'Senior Secondary (Form 1 - 4) Boarding Structure',
    gradeLevel: 'Form 1 - 4',
    academicYear: '2026',
    term: 'Term 3',
    tuitionFee: 42000,
    transportFee: 0,
    cateringFee: 12000,
    activityFee: 4000,
    total: 58000,
  },
];

export default function FinanceDashboardPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'structures' | 'transactions' | 'reconciliation'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('M-Pesa');
  const [referenceNo, setReferenceNo] = useState<string>('');

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredInvoices = mockInvoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenPaymentModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.balance);
    setReferenceNo('');
    setShowPaymentModal(true);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    triggerNotification(
      `Payment of KSh ${paymentAmount.toLocaleString()} recorded for ${selectedInvoice.studentName} (${selectedInvoice.invoiceNumber}).`
    );
    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Finance & Fee Management</h1>
          <p className="text-sm text-slate-500">
            Track tuition invoicing, automated M-Pesa collections, fee balances, and bank reconciliations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => triggerNotification('Bulk invoicing job queued for Term 3.')}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-file-invoice text-xs mr-2"></i> Generate Invoices
          </button>
          <button
            onClick={() => triggerNotification('Exporting fee collection statement...')}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-download text-xs mr-2"></i> Export Financial Report
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {notification && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-600 text-base"></i>
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Billed (Term 3)</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <i className="fa-solid fa-receipt text-sm"></i>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">KSh 18,450,000</div>
            <p className="text-xs text-slate-500 mt-1">450 Active Students Billed</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Collected</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <i className="fa-solid fa-wallet text-sm"></i>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-600">KSh 13,820,000</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">74.9% Collection Rate</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Outstanding Arrears</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <i className="fa-solid fa-clock-rotate-left text-sm"></i>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-600">KSh 4,630,000</div>
            <p className="text-xs text-slate-500 mt-1">112 Accounts Pending</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">M-Pesa Auto-Reconciled</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <i className="fa-solid fa-[#00A859] fa-mobile-screen-button text-sm"></i>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">96.4%</div>
            <p className="text-xs text-slate-500 mt-1">Paybill Express Integration</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-sm font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'invoices' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-file-invoice mr-2 text-xs"></i> Student Invoices & Balances
        </button>
        <button
          onClick={() => setActiveTab('structures')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'structures' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-sitemap mr-2 text-xs"></i> Fee Structures
        </button>
        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'reconciliation' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-building-columns mr-2 text-xs"></i> Bank & M-Pesa Reconciliation
        </button>
      </div>

      {/* Tab 1: Student Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search student, admission, or invoice #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-xs font-medium text-slate-600">Filter Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="p-4">Invoice No</th>
                  <th className="p-4">Student Info</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Total Billed</th>
                  <th className="p-4">Paid</th>
                  <th className="p-4">Balance</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-medium text-blue-600">{inv.invoiceNumber}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{inv.studentName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{inv.admissionNo}</div>
                    </td>
                    <td className="p-4 text-slate-700">{inv.gradeClass}</td>
                    <td className="p-4 font-semibold text-slate-900">KSh {inv.totalAmount.toLocaleString()}</td>
                    <td className="p-4 text-emerald-600 font-medium">KSh {inv.paidAmount.toLocaleString()}</td>
                    <td className="p-4 font-bold text-slate-900">
                      {inv.balance > 0 ? (
                        <span className="text-amber-600">KSh {inv.balance.toLocaleString()}</span>
                      ) : (
                        <span className="text-slate-400">KSh 0</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'Partial'
                            ? 'bg-blue-100 text-blue-800'
                            : inv.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.balance > 0 && (
                          <button
                            onClick={() => handleOpenPaymentModal(inv)}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                          >
                            <i className="fa-solid fa-money-bill-wave mr-1"></i> Pay
                          </button>
                        )}
                        <button
                          onClick={() => triggerNotification(`Statement sent via WhatsApp & Email to ${inv.studentName}'s guardian.`)}
                          className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
                          title="Send Fee Statement"
                        >
                          <i className="fa-solid fa-paper-plane mr-1"></i> Remind
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Fee Structures */}
      {activeTab === 'structures' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockFeeStructures.map((fs) => (
            <div key={fs.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div>
                <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                  {fs.gradeLevel} • {fs.academicYear}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{fs.title}</h3>
                <p className="text-xs text-slate-500">{fs.term}</p>
              </div>

              <div className="space-y-2 border-t border-b border-slate-100 py-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tuition & Instructional</span>
                  <span className="font-medium text-slate-900">KSh {fs.tuitionFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Transport Route Levy</span>
                  <span className="font-medium text-slate-900">KSh {fs.transportFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Catering & Lunch</span>
                  <span className="font-medium text-slate-900">KSh {fs.cateringFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Co-Curricular & Activity</span>
                  <span className="font-medium text-slate-900">KSh {fs.activityFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                <span>Total Fee</span>
                <span className="text-blue-600">KSh {fs.total.toLocaleString()}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => triggerNotification('Fee structure editing unlocked.')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  Edit Breakdown
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Bank & M-Pesa Reconciliation */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Automated Payment Gateway Gateway Status</h2>
            <p className="text-xs text-slate-500">
              Live feeds from Safaricom M-Pesa Paybill (600100) and Equity Bank API integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 text-sm">M-Pesa C2B Integration</span>
                <span className="inline-flex items-center text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-emerald-700">
                Callback URL registered. Real-time auto-matching against student Admission Numbers active.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 text-sm">Bank Statement Parser</span>
                <span className="inline-flex items-center text-[10px] bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-blue-700">
                Automated MT940 / CSV bank feed reconciliation processing active for Equity & KCB.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Fee Payment</h3>
                <p className="text-xs text-slate-500">{selectedInvoice.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Student</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedInvoice.studentName} (${selectedInvoice.admissionNo})`}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Current Balance
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`KSh ${selectedInvoice.balance.toLocaleString()}`}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-amber-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Amount Being Paid
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="M-Pesa">M-Pesa Paybill</option>
                  <option value="Bank Transfer">Bank Transfer (EFT/RTGS)</option>
                  <option value="Cheque">Bank Cheque</option>
                  <option value="Cash">Cash Deposit</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Reference / Transaction Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. QK89123049 or CHQ-0012"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500 shadow-sm transition-colors"
                >
                  Confirm & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}