// apps/web/app/dashboard/students/[id]/page.tsx
'use client';
export const runtime = 'edge';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */

interface StudentProfile {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  enrollmentStatus: string;
  createdAt: string;
  // Mock extensions for a richer 360-view
  grade?: string;
  house?: string;
}

/* ==========================================================================
   MOCK DATA (To supplement the API for the UI demo)
   ========================================================================== */

const MOCK_BOARDING_DATA = {
  hostelBlock: 'Elgon House (Boys)',
  roomNumber: 'Room B-102',
  bedNumber: 'Bed 02 (Lower)',
  dietType: 'Standard',
  allergy: 'None',
  currentStatus: 'In Hostel',
  lastMovement: 'Return from Weekend Exeat (Oct 06, 2026)',
};

const MOCK_FINANCE_DATA = {
  term: '2026 - Term 3',
  amountBilled: 35000,
  amountPaid: 35000,
  balance: 0,
  status: 'Cleared',
};

const MOCK_GUARDIAN_DATA = {
  name: 'Mary Kiprop',
  relation: 'Mother',
  phone: '+254 712 345 678',
  email: 'mary.kiprop@example.com',
};

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchStudent() {
      try {
        const token = localStorage.getItem('elimix_token');
        const userJson = localStorage.getItem('elimix_user');
        
        let tenantId = '';
        if (userJson) {
          const user = JSON.parse(userJson);
          tenantId = user.tenantId || '';
        }

        const activeTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

        // Attempt API fetch
        const res = await fetch(`http://localhost:3001/api/v1/students/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': activeTenantId,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          // If API fails, inject fallback mock data for STU-2024-045 to demonstrate UI
          if (studentId === 'STU-2024-045') {
            setStudent({
              id: 'STU-2024-045',
              admissionNumber: 'ADM-24-0891',
              firstName: 'Brian',
              lastName: 'Kiprop',
              dateOfBirth: '2009-04-12T00:00:00Z',
              gender: 'Male',
              enrollmentStatus: 'Active',
              createdAt: '2024-01-15T00:00:00Z',
              grade: 'Form 3 Blue',
              house: 'Elgon House',
            });
            setIsLoading(false);
            return;
          }
          if (res.status === 404) throw new Error('Student profile not found in this workspace.');
          throw new Error(result.message || 'Failed to fetch student details.');
        }

        setStudent(result.data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while connecting to the server.');
      } finally {
        setIsLoading(false);
      }
    }

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <i className="fa-solid fa-spinner animate-spin text-2xl text-[#006FBF]" />
          <span className="text-sm font-medium">Loading student profile...</span>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-rose-50 p-4 text-rose-600">
          <i className="fa-solid fa-user-xmark text-3xl" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Profile Not Found</h2>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="mt-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER & BREADCRUMBS
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/dashboard/students" className="hover:text-[#006FBF]">Students</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900">Student Profile</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {student.firstName} {student.lastName}
          </h1>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:ring-2 focus:ring-[#006FBF] focus:outline-none transition-all">
            <i className="fa-solid fa-pen mr-2 text-slate-400" /> Edit Profile
          </button>
          <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-[#012E54] hover:to-[#006FBF] focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2 transition-all">
            <i className="fa-solid fa-file-invoice mr-2" /> Generate Statement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ----------------------------------------------------------------------
            LEFT COLUMN: IDENTITY & QUICK INFO (Span 4)
            ---------------------------------------------------------------------- */}
        <div className="col-span-1 space-y-6 lg:col-span-4">
          {/* Identity Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative bg-gradient-to-b from-slate-50 to-white px-6 py-8 text-center border-b border-slate-100">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#006FBF] to-[#04B1D6] text-3xl font-bold text-white shadow-md ring-4 ring-white">
                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {student.grade || 'Unassigned Class'} &bull; {studentId}
              </p>
              
              <div className="mt-4 flex justify-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {student.enrollmentStatus}
                </span>
                {student.house && (
                  <span className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    <i className="fa-solid fa-house-chimney mr-1.5" />
                    {student.house}
                  </span>
                )}
              </div>
            </div>
            
            <div className="px-6 py-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Demographics</h3>
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <dt className="text-slate-500">Gender</dt>
                  <dd className="font-medium text-slate-900">{student.gender}</dd>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <dt className="text-slate-500">Date of Birth</dt>
                  <dd className="font-medium text-slate-900">{new Date(student.dateOfBirth).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <dt className="text-slate-500">Admission No.</dt>
                  <dd className="font-medium text-slate-900">{student.admissionNumber}</dd>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <dt className="text-slate-500">Joined Date</dt>
                  <dd className="font-medium text-slate-900">{new Date(student.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Guardian / Family Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <i className="fa-solid fa-people-roof text-[#006FBF]" />
                <h3 className="text-sm font-bold">Primary Guardian</h3>
              </div>
              <button className="text-xs font-semibold text-[#006FBF] hover:underline">Edit</button>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <i className="fa-solid fa-user" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-900">{MOCK_GUARDIAN_DATA.name}</p>
                <p className="text-xs text-slate-500">{MOCK_GUARDIAN_DATA.relation}</p>
                <div className="mt-2 space-y-1 text-slate-600">
                  <p><i className="fa-solid fa-phone mr-2 w-3 text-slate-400" /> {MOCK_GUARDIAN_DATA.phone}</p>
                  <p><i className="fa-solid fa-envelope mr-2 w-3 text-slate-400" /> {MOCK_GUARDIAN_DATA.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------
            RIGHT COLUMN: MODULES & TABS (Span 8)
            ---------------------------------------------------------------------- */}
        <div className="col-span-1 flex flex-col gap-6 lg:col-span-8">
          
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">Attendance</p>
              <p className="mt-1 text-xl font-bold text-emerald-600">98.5%</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">Discipline Points</p>
              <p className="mt-1 text-xl font-bold text-slate-900">100</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">Term Average</p>
              <p className="mt-1 text-xl font-bold text-[#006FBF]">A- (78%)</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">Fee Balance</p>
              <p className="mt-1 text-xl font-bold text-slate-900">Ksh 0</p>
            </div>
          </div>

          {/* Custom Tabs */}
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {['overview', 'academics', 'hostel', 'finance'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-[#006FBF] text-[#006FBF]'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content Panels */}
          <div className="min-h-[400px]">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Boarding Snapshot */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">Boarding & Hostel</h3>
                    <Link href="/dashboard/hostel" className="text-xs text-[#006FBF] hover:underline">View Module</Link>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500">Assigned Room</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {MOCK_BOARDING_DATA.hostelBlock} &bull; {MOCK_BOARDING_DATA.roomNumber} ({MOCK_BOARDING_DATA.bedNumber})
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Current Status</p>
                      <span className="mt-1 inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        <i className="fa-solid fa-check mr-1.5" /> {MOCK_BOARDING_DATA.currentStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Diet & Medical</p>
                      <p className="text-sm font-medium text-slate-800">
                        {MOCK_BOARDING_DATA.dietType} Diet &bull; Allergies: {MOCK_BOARDING_DATA.allergy}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Finance Snapshot */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">Current Fees Status</h3>
                    <button className="text-xs text-[#006FBF] hover:underline">View Statement</button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500">Term</p>
                      <p className="text-sm font-semibold text-slate-800">{MOCK_FINANCE_DATA.term}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                      <p className="text-sm text-slate-600">Total Billed</p>
                      <p className="text-sm font-medium text-slate-900">Ksh {MOCK_FINANCE_DATA.amountBilled.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                      <p className="text-sm text-slate-600">Amount Paid</p>
                      <p className="text-sm font-medium text-emerald-600">Ksh {MOCK_FINANCE_DATA.amountPaid.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                      <p className="text-sm font-bold text-slate-900">Outstanding Balance</p>
                      <p className="text-sm font-bold text-slate-900">Ksh {MOCK_FINANCE_DATA.balance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACADEMICS TAB */}
            {activeTab === 'academics' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                <i className="fa-solid fa-graduation-cap text-4xl text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-900">Academic Records</h3>
                <p className="mt-1 text-sm text-slate-500">Termly reports, exams, and subject choices will appear here.</p>
                <button className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200">
                  Upload Past Report
                </button>
              </div>
            )}

            {/* HOSTEL TAB */}
            {activeTab === 'hostel' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Exeat & Movement History</h3>
                  <div className="relative pl-4 border-l-2 border-slate-200 space-y-6">
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 flex h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                      <p className="text-sm font-medium text-slate-900">Checked In (Return from Exeat)</p>
                      <p className="text-xs text-slate-500">Oct 06, 2026 at 08:00 AM &bull; Authorized by Mr. David Njoroge</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 flex h-3 w-3 rounded-full bg-amber-400 ring-4 ring-white" />
                      <p className="text-sm font-medium text-slate-900">Checked Out (Weekend Leave)</p>
                      <p className="text-xs text-slate-500">Oct 02, 2026 at 04:30 PM &bull; Accompanied by Mary Kiprop</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 flex h-3 w-3 rounded-full bg-slate-300 ring-4 ring-white" />
                      <p className="text-sm font-medium text-slate-900">Room Allocation Assigned</p>
                      <p className="text-xs text-slate-500">Sep 01, 2026 at 10:00 AM &bull; Room B-102</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FINANCE TAB */}
            {activeTab === 'finance' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-0 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Amount (Ksh)</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-500">Sep 28, 2026</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">M-Pesa Payment (Receipt #RC-9821)</td>
                      <td className="px-6 py-4 text-sm text-right text-emerald-600">+15,000</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-500">Sep 05, 2026</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Bank Transfer Payment (Receipt #RC-9011)</td>
                      <td className="px-6 py-4 text-sm text-right text-emerald-600">+20,000</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">15,000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-500">Sep 01, 2026</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Term 3 Boarding & Tuition Invoice Billed</td>
                      <td className="px-6 py-4 text-sm text-right text-rose-600">-35,000</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">35,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}