// apps/web/app/dashboard/students/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

export default function AddStudentPage() {
  const router = useRouter();
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    admissionNumber: '',
    dateOfBirth: '',
    gender: 'Male', // Default matches backend enum
    enrollmentStatus: 'Admitted', // Default matches backend enum
  });

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setValidationErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationErrors([]);

    try {
      const token = localStorage.getItem('elimix_token');
      const userJson = localStorage.getItem('elimix_user');
      
      let tenantId = '';
      if (userJson) {
        const user = JSON.parse(userJson);
        tenantId = user.tenantId || '';
      }

      if (!token || !tenantId) {
        throw new Error('Authentication or Tenant context missing. Please log in again.');
      }

      const res = await fetch('http://localhost:3001/api/v1/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.code === 'VALIDATION_ERROR' && result.errors) {
          setValidationErrors(result.errors);
          throw new Error('Please correct the highlighted fields.');
        }
        throw new Error(result.message || 'Failed to register student.');
      }

      router.push('/dashboard/students');
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
            <Link href="/dashboard" className="hover:text-[#006FBF] transition-colors">Dashboard</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/students" className="hover:text-[#006FBF] transition-colors">Students</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">New Student</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Admit New Student</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Enter the student's primary demographic and enrollment details.</p>
        </div>
        
        <div className="flex w-full sm:w-auto">
          <Link href="/dashboard/students" className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <i className="fa-solid fa-arrow-left text-[10px]"></i> Back to Directory
          </Link>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm flex items-start gap-3 shadow-sm animate-in fade-in">
          <i className="fa-solid fa-triangle-exclamation text-rose-600 mt-0.5 text-base"></i>
          <div>
            <span className="font-semibold block">{error}</span>
            {validationErrors.length > 0 && (
              <ul className="mt-1.5 ml-4 list-disc text-xs font-medium text-rose-600/80 space-y-0.5">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err.message}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* FORM CARD */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <i className="fa-solid fa-user-graduate text-[#006FBF]"></i> Basic Information
          </h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="block text-xs font-semibold text-slate-700">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Brian"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lastName" className="block text-xs font-semibold text-slate-700">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Omondi"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="admissionNumber" className="block text-xs font-semibold text-slate-700">
                  Admission Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="admissionNumber"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. ADM/2026/001"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 font-mono placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10 uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="dateOfBirth" className="block text-xs font-semibold text-slate-700">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <i className="fa-regular fa-calendar absolute left-4 top-3 text-sm text-slate-400"></i>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="gender" className="block text-xs font-semibold text-slate-700">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10 appearance-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="enrollmentStatus" className="block text-xs font-semibold text-slate-700">
                  Enrollment Status <span className="text-rose-500">*</span>
                </label>
                <select
                  id="enrollmentStatus"
                  name="enrollmentStatus"
                  value={formData.enrollmentStatus}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10 appearance-none"
                >
                  <option value="Admitted">Admitted (Pending Reg)</option>
                  <option value="Enrolled">Enrolled (Active)</option>
                  <option value="Transferred">Transferred</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>

            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 flex items-center justify-end gap-3">
            <Link href="/dashboard/students" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors shadow-sm">
              Cancel
            </Link>
            <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
              {isLoading ? (
                <><i className="fa-solid fa-spinner animate-spin"></i> Saving Student...</>
              ) : (
                <><i className="fa-solid fa-check"></i> Save & Continue</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}