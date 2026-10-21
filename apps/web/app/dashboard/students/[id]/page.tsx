// apps/web/app/dashboard/students/[id]/page.tsx
'use client';
export const runtime = 'edge';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface StudentProfile {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  enrollmentStatus: string;
  createdAt: string;
  classId?: string | null;
  streamId?: string | null;
  grade?: string;
  house?: string;
}

interface ClassItem {
  id: string;
  name: string;
}

interface StreamItem {
  id: string;
  name: string;
  classId: string;
}

const MOCK_BOARDING_DATA = {
  hostelBlock: 'Elgon House (Boys)',
  roomNumber: 'Room B-102',
  bedNumber: 'Bed 02 (Lower)',
  dietType: 'Standard',
  allergy: 'None',
  currentStatus: 'In Hostel',
};

const MOCK_FINANCE_DATA = {
  term: '2026 - Term 3',
  amountBilled: 35000,
  amountPaid: 35000,
  balance: 0,
};

const MOCK_GUARDIAN_DATA = {
  name: 'Mary Kiprop',
  relation: 'Mother',
  phone: '+254 712 345 678',
  email: 'mary.kiprop@example.com',
};

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [streamsList, setStreamsList] = useState<StreamItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Assignment Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStreamId, setSelectedStreamId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const userJson = localStorage.getItem('elimix_user');
    let tenantId = '00000000-0000-0000-0000-000000000000';
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        tenantId = user.tenantId || tenantId;
      } catch {}
    }
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'x-tenant-id': tenantId,
    };
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const [studentRes, metaRes] = await Promise.all([
        fetch(`${API_BASE_URL}/students/${studentId}`, { headers }),
        fetch(`${API_BASE_URL}/students/meta/classes-streams`, { headers }),
      ]);

      if (!studentRes.ok) {
        if (studentRes.status === 404) throw new Error('Student profile not found in this workspace.');
        throw new Error('Failed to fetch student details.');
      }

      const sJson = await studentRes.json();
      setStudent(sJson.data);
      if (sJson.data?.classId) setSelectedClassId(sJson.data.classId);
      if (sJson.data?.streamId) setSelectedStreamId(sJson.data.streamId);

      if (metaRes.ok) {
        const mJson = await metaRes.json();
        setClassesList(mJson.data?.classes || []);
        setStreamsList(mJson.data?.streams || []);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while connecting to the server.');
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId) {
      fetchData();
    }
  }, [studentId, fetchData]);

  const modalAvailableStreams = useMemo(() => {
    if (!selectedClassId) return streamsList;
    return streamsList.filter((s) => s.classId === selectedClassId);
  }, [streamsList, selectedClassId]);

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const headers = getHeaders();
      const res = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          classId: selectedClassId || null,
          streamId: selectedStreamId || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update student assignment');
      }

      setStudent(json.data);
      setIsAssignModalOpen(false);
      setSuccessBanner('Student successfully assigned to class and stream.');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const currentClassName = classesList.find((c) => c.id === student.classId)?.name || student.grade || 'Unassigned Class';
  const currentStreamName = streamsList.find((s) => s.id === student.streamId)?.name || '';

  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8 bg-[#f4f7fb] min-h-screen text-[#042954]">
      
      {successBanner && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center justify-between shadow-sm">
          <span><i className="fa-solid fa-circle-check mr-2 text-emerald-600"></i>{successBanner}</span>
          <button onClick={() => setSuccessBanner(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/dashboard/students" className="hover:text-[#006FBF]">Students</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 font-semibold">Student Profile</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {student.firstName} {student.lastName}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
          >
            <i className="fa-solid fa-layer-group mr-2 text-[#006FBF]" /> Assign Class & Stream
          </button>
          <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 transition-all">
            <i className="fa-solid fa-file-invoice mr-2" /> Generate Statement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Column: Identity & Demographics */}
        <div className="col-span-1 space-y-6 lg:col-span-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative bg-gradient-to-b from-slate-50 to-white px-6 py-8 text-center border-b border-slate-100">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#006FBF] to-[#04B1D6] text-3xl font-bold text-white shadow-md ring-4 ring-white">
                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {currentClassName} {currentStreamName ? `(${currentStreamName})` : ''} &bull; {student.admissionNumber}
              </p>
              
              <div className="mt-4 flex justify-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {student.enrollmentStatus}
                </span>
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

          {/* Guardian Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <i className="fa-solid fa-people-roof text-[#006FBF]" />
                <h3 className="text-sm font-bold">Primary Guardian</h3>
              </div>
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

        {/* Right Column: Tabs & Modules */}
        <div className="col-span-1 flex flex-col gap-6 lg:col-span-8">
          
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

          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Class & Stream Assignment</h3>
                    <p className="text-base font-extrabold text-[#006FBF] mt-1">
                      {currentClassName} {currentStreamName ? `— Stream ${currentStreamName}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAssignModalOpen(true)}
                    className="rounded-xl bg-[#006FBF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#012E54]"
                  >
                    Change Assignment
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Boarding & Hostel</h3>
                    <p className="text-sm font-semibold text-slate-800">
                      {MOCK_BOARDING_DATA.hostelBlock} &bull; {MOCK_BOARDING_DATA.roomNumber} ({MOCK_BOARDING_DATA.bedNumber})
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Current Fees Status</h3>
                    <p className="text-sm font-bold text-emerald-600">Account Cleared (Balance: Ksh 0)</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'academics' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                <i className="fa-solid fa-graduation-cap text-4xl text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-900">Academic Records</h3>
                <p className="mt-1 text-sm text-slate-500">Termly reports, exams, and subject choices will appear here.</p>
              </div>
            )}
            {activeTab === 'hostel' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Exeat & Movement History</h3>
                <p className="text-xs text-slate-500">Elgon House &bull; Room B-102</p>
              </div>
            )}
            {activeTab === 'finance' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Fee Statement Ledger</h3>
                <p className="text-xs text-emerald-600 font-semibold">Account fully cleared for Term 3 2026.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">Assign Class & Stream</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Class / Grade *</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setSelectedStreamId('');
                  }}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-[#006FBF]"
                >
                  <option value="">-- Choose Class --</option>
                  {classesList.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Stream *</label>
                <select
                  value={selectedStreamId}
                  onChange={(e) => setSelectedStreamId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-[#006FBF]"
                >
                  <option value="">-- Choose Stream --</option>
                  {modalAvailableStreams.map((stream) => (
                    <option key={stream.id} value={stream.id}>{stream.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#006FBF] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#012E54] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}