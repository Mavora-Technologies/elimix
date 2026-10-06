// apps/web/app/dashboard/hr/staff/[id]/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA (EMP-001 - Sarah Jenkins)
   ========================================================================== */

const STAFF_DETAILS = {
  id: 'EMP-001',
  name: 'Sarah Jenkins',
  role: 'Mathematics Teacher',
  department: 'Academics',
  status: 'Active',
  avatar: 'SJ',
  email: 's.jenkins@school.edu',
  phone: '+254 712 345 678',
  nationalId: '34567890',
  gender: 'Female',
  dob: '1988-04-12',
  joinDate: '2021-09-01',
  employmentType: 'Full-Time',
  contractType: 'Permanent',
  salaryGrade: 'Grade K - Senior Teacher',
  bankName: 'Equity Bank Kenya',
  accountNumber: '••••••••4892',
  taxPin: 'A009876543Z',
  nhifNumber: 'NHIF-8839201',
  nssfNumber: 'NSSF-5544332',
  address: 'Kilimani, Nairobi, Kenya',
  emergencyContact: {
    name: 'David Jenkins',
    relationship: 'Spouse',
    phone: '+254 722 000 111',
  },
  leaveBalance: {
    annual: 18,
    sick: 10,
    maternity: 90,
  },
  recentLeaves: [
    {
      id: 'L-1042',
      type: 'Sick Leave',
      dates: 'Oct 6, 2026 - Oct 8, 2026',
      days: 3,
      status: 'Pending',
    },
    {
      id: 'L-0912',
      type: 'Annual Leave',
      dates: 'Apr 10, 2026 - Apr 17, 2026',
      days: 5,
      status: 'Approved',
    },
  ],
  documents: [
    { name: 'Employment_Contract_2021.pdf', size: '1.2 MB', date: 'Sep 1, 2021' },
    { name: 'Degree_Certificate_BEd.pdf', size: '2.4 MB', date: 'Aug 20, 2021' },
    { name: 'National_ID_Copy.pdf', size: '850 KB', date: 'Aug 20, 2021' },
    { name: 'Tax_Compliance_Certificate.pdf', size: '420 KB', date: 'Jan 15, 2026' },
  ],
};

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          TOP BREADCRUMB & BACK BUTTON
          ---------------------------------------------------------------------- */}
      <div>
        <Link
          href="/dashboard/hr/staff"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#006FBF]"
        >
          <i className="fa-solid fa-arrow-left mr-2 text-xs" />
          Back to Staff Directory
        </Link>
      </div>

      {/* ----------------------------------------------------------------------
          PROFILE HEADER CARD
          ---------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#012E54] to-[#006FBF] text-2xl font-bold text-white shadow-md">
              {STAFF_DETAILS.avatar}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  {STAFF_DETAILS.name}
                </h1>
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  {STAFF_DETAILS.status}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {STAFF_DETAILS.role} &bull;{' '}
                <span className="text-slate-500">{STAFF_DETAILS.department}</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">
                ID: {id || STAFF_DETAILS.id} &bull; Joined{' '}
                {STAFF_DETAILS.joinDate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
              <i className="fa-regular fa-pen-to-square mr-2 text-slate-400" />
              Edit Profile
            </button>
            <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF]">
              <i className="fa-solid fa-file-invoice-dollar mr-2" />
              View Payslips
            </button>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          MAIN CONTENT GRID
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT 2 COLUMNS: Personal, Job & Financial Information */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* PERSONAL & CONTACT INFORMATION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Personal & Contact Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{STAFF_DETAILS.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Phone Number</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{STAFF_DETAILS.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">National ID / Passport</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{STAFF_DETAILS.nationalId}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date of Birth</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{STAFF_DETAILS.dob}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gender</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{STAFF_DETAILS.gender}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Residential Address</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{STAFF_DETAILS.address}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Emergency Contact</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-slate-400">Name</p>
                  <p className="text-sm font-medium text-slate-800">{STAFF_DETAILS.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Relationship</p>
                  <p className="text-sm font-medium text-slate-800">{STAFF_DETAILS.emergencyContact.relationship}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="text-sm font-medium text-slate-800">{STAFF_DETAILS.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* EMPLOYMENT & SALARY DETAILS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Employment & Statutory Details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Employment Type</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{STAFF_DETAILS.employmentType}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Contract Type</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{STAFF_DETAILS.contractType}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Salary Grade</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{STAFF_DETAILS.salaryGrade}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">KRA Tax PIN</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{STAFF_DETAILS.taxPin}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Bank Account</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {STAFF_DETAILS.bankName} ({STAFF_DETAILS.accountNumber})
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">NHIF / NSSF</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {STAFF_DETAILS.nhifNumber} / {STAFF_DETAILS.nssfNumber}
                </p>
              </div>
            </div>
          </div>

          {/* LEAVE HISTORY */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-semibold text-slate-900">
                Recent Leave Requests
              </h2>
              <button className="text-xs font-medium text-[#006FBF] hover:text-[#012E54]">
                + Apply Leave for Staff
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th scope="col" className="py-2 text-left text-xs font-medium text-slate-400 uppercase">Type</th>
                    <th scope="col" className="py-2 text-left text-xs font-medium text-slate-400 uppercase">Dates</th>
                    <th scope="col" className="py-2 text-left text-xs font-medium text-slate-400 uppercase">Days</th>
                    <th scope="col" className="py-2 text-right text-xs font-medium text-slate-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {STAFF_DETAILS.recentLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td className="py-3 text-sm font-medium text-slate-800">{leave.type}</td>
                      <td className="py-3 text-sm text-slate-600">{leave.dates}</td>
                      <td className="py-3 text-sm text-slate-600">{leave.days}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                            leave.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                              : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT 1 COLUMN: Leave Balance & Documents */}
        <div className="flex flex-col gap-6">
          {/* LEAVE BALANCE METRICS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Leave Balances
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <p className="text-xs font-medium text-slate-500">Annual Leave</p>
                  <p className="text-lg font-bold text-slate-900">{STAFF_DETAILS.leaveBalance.annual} days</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#006FBF]/10 text-[#006FBF]">
                  <i className="fa-solid fa-calendar-check" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <p className="text-xs font-medium text-slate-500">Sick Leave</p>
                  <p className="text-lg font-bold text-slate-900">{STAFF_DETAILS.leaveBalance.sick} days</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <i className="fa-solid fa-notes-medical" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <p className="text-xs font-medium text-slate-500">Maternity Leave</p>
                  <p className="text-lg font-bold text-slate-900">{STAFF_DETAILS.leaveBalance.maternity} days</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                  <i className="fa-solid fa-person-breastfeeding" />
                </div>
              </div>
            </div>
          </div>

          {/* DOCUMENTS & ATTACHMENTS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-semibold text-slate-900">
                Documents & Files
              </h2>
              <button className="text-xs font-medium text-[#006FBF] hover:text-[#012E54]">
                + Upload
              </button>
            </div>
            <ul className="divide-y divide-slate-100">
              {STAFF_DETAILS.documents.map((doc, idx) => (
                <li key={idx} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <i className="fa-regular fa-file-pdf text-red-500 text-lg flex-shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-medium text-slate-800 truncate">{doc.name}</p>
                      <p className="text-[11px] text-slate-400">{doc.size} &bull; {doc.date}</p>
                    </div>
                  </div>
                  <button className="ml-2 text-slate-400 hover:text-[#006FBF]" title="Download">
                    <i className="fa-solid fa-download text-xs" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}