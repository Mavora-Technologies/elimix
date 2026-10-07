'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface TeacherDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  employeeNumber: string;
  qualifications: string;
  department: string;
  subjects: string[];
  assignedClasses: string[];
  status: string;
}

export default function TeacherProfilePage() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState<TeacherDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeacher() {
      try {
        const token = localStorage.getItem('elimix_token');
        const userJson = localStorage.getItem('elimix_user');
        const tenantId = userJson ? JSON.parse(userJson).tenantId : '00000000-0000-0000-0000-000000000000';

        const res = await fetch(`http://localhost:3001/api/v1/teachers/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
          },
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to fetch teacher profile');
        
        setTeacher(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTeacher();
  }, [id]);

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i> Loading Profile...</div>;
  }

  if (error || !teacher) {
    return (
      <div className="p-12 text-center text-rose-600">
        <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error || 'Teacher not found'}
        <div className="mt-4">
          <Link href="/dashboard/teachers" className="text-blue-600 hover:underline">Return to Directory</Link>
        </div>
      </div>
    );
  }

  const initials = teacher.fullName.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header / Back navigation */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/teachers" className="text-slate-400 hover:text-slate-600">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teacher Profile</h1>
          <p className="text-sm text-slate-500">View detailed staff information and assignments.</p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-[#006FBF] to-[#04B1D6]"></div>
        
        <div className="px-6 pb-6 sm:px-8 sm:pb-8 relative">
          {/* Avatar */}
          <div className="absolute -top-12 h-24 w-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-600 shadow-sm">
            {initials}
          </div>

          <div className="pt-14 sm:flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{teacher.fullName}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm font-medium">
                <span className="text-slate-500"><i className="fa-solid fa-id-badge mr-1"></i> {teacher.employeeNumber}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500"><i className="fa-solid fa-building mr-1"></i> {teacher.department}</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold ${
                  teacher.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                {teacher.status === 'Active' ? <i className="fa-solid fa-circle-check mr-1.5"></i> : <i className="fa-solid fa-clock mr-1.5"></i>}
                {teacher.status}
              </span>
            </div>
          </div>

          <hr className="my-6 border-slate-100" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-slate-400">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded bg-slate-50 text-slate-400 mr-3"><i className="fa-solid fa-envelope"></i></span>
                    <span className="font-medium text-slate-700">{teacher.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded bg-slate-50 text-slate-400 mr-3"><i className="fa-solid fa-phone"></i></span>
                    <span className="font-medium text-slate-700">{teacher.phone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-slate-400">Qualifications</h3>
                <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {teacher.qualifications}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-slate-400">Assigned Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((sub, i) => (
                    <span key={i} className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-100">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-slate-400">Class Roster Allocations</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.assignedClasses.map((cls, i) => (
                    <span key={i} className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                      <i className="fa-solid fa-users mr-1.5 text-slate-400"></i> {cls}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}