// apps/web/app/dashboard/students/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface StudentProfile {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  enrollmentStatus: string;
  createdAt: string;
}

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const res = await fetch(`http://localhost:3001/api/v1/students/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': activeTenantId,
          },
        });

        const result = await res.json();

        if (!res.ok) {
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
          <i className="fa-solid fa-spinner animate-spin text-2xl text-blue-600"></i>
          <span className="text-sm font-medium">Loading student profile...</span>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-rose-50 p-4 text-rose-600">
          <i className="fa-solid fa-user-xmark text-3xl"></i>
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
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/dashboard/students" className="hover:text-blue-600">Students</Link>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span className="text-slate-900">Student Profile</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {student.firstName} {student.lastName}
          </h1>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            <i className="fa-solid fa-pen mr-2 text-xs"></i> Edit Profile
          </button>
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
            <i className="fa-solid fa-file-invoice mr-2 text-xs"></i> Generate Statement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Core Identity Card */}
        <div className="col-span-1 space-y-6">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-slate-50 px-6 py-8 text-center border-b border-slate-100">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700 shadow-sm">
                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">{student.firstName} {student.lastName}</h2>
              <p className="text-sm font-mono text-slate-500">{student.admissionNumber}</p>
              
              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {student.enrollmentStatus}
                </span>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Demographics</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Gender</dt>
                  <dd className="font-medium text-slate-900">{student.gender}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Date of Birth</dt>
                  <dd className="font-medium text-slate-900">{new Date(student.dateOfBirth).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Joined Date</dt>
                  <dd className="font-medium text-slate-900">{new Date(student.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Right Column: Modules (Academics, Medical, Finance) */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* Medical & Family Quick View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-rose-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-rose-600">
                <i className="fa-solid fa-staff-snake"></i>
                <h3 className="text-sm font-bold">Medical Restrictions</h3>
              </div>
              <p className="text-xs text-slate-500">
                Data access is restricted. Full medical records require Nurse/Medical Officer clearance.
              </p>
              <button className="mt-3 text-xs font-semibold text-blue-600 hover:underline">
                Request Medical Record Unlock &rarr;
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-slate-700">
                <i className="fa-solid fa-people-roof"></i>
                <h3 className="text-sm font-bold">Family / Guardian</h3>
              </div>
              <p className="text-xs text-slate-500">
                Linked to the primary family account.
              </p>
              <button className="mt-3 text-xs font-semibold text-blue-600 hover:underline">
                View Family Workspace &rarr;
              </button>
            </div>
          </div>

          {/* Academic Timeline Placeholder */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Academic Timeline</h3>
            <div className="flex items-center justify-center py-12 border-2 border-dashed border-slate-100 rounded-lg bg-slate-50">
              <div className="text-center">
                <i className="fa-solid fa-timeline text-3xl text-slate-300 mb-2"></i>
                <p className="text-sm font-medium text-slate-600">No academic events recorded yet.</p>
                <p className="text-xs text-slate-400">Class allocations and exams will appear here (Phases 3-5).</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}