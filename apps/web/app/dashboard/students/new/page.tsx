// apps/web/app/dashboard/students/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    // Clear errors when user types
    setError(null);
    setValidationErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationErrors([]);

    try {
      // Retrieve auth and tenant context
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
        // Handle Zod Validation Errors from backend
        if (result.code === 'VALIDATION_ERROR' && result.errors) {
          setValidationErrors(result.errors);
          throw new Error('Please correct the highlighted fields.');
        }
        throw new Error(result.message || 'Failed to register student.');
      }

      // Success: Redirect back to directory
      router.push('/dashboard/students');
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Admit New Student
          </h1>
          <p className="text-sm text-slate-500">
            Enter the student's primary demographic and enrollment details.
          </p>
        </div>
        <Link
          href="/dashboard/students"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          Cancel
        </Link>
      </div>

      {/* Main Form Card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-slate-200">
          
          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-start gap-3">
              <i className="fa-solid fa-circle-exclamation text-rose-600 mt-0.5"></i>
              <div className="text-sm text-rose-700 font-medium">
                {error}
                {validationErrors.length > 0 && (
                  <ul className="mt-1 ml-4 list-disc text-xs font-normal text-rose-600">
                    {validationErrors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700">
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700">
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Admission Number */}
              <div className="space-y-2">
                <label htmlFor="admissionNumber" className="block text-sm font-semibold text-slate-700">
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-slate-700">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="block text-sm font-semibold text-slate-700">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Enrollment Status */}
              <div className="space-y-2">
                <label htmlFor="enrollmentStatus" className="block text-sm font-semibold text-slate-700">
                  Enrollment Status <span className="text-rose-500">*</span>
                </label>
                <select
                  id="enrollmentStatus"
                  name="enrollmentStatus"
                  value={formData.enrollmentStatus}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Admitted">Admitted (Pending Full Registration)</option>
                  <option value="Enrolled">Enrolled (Active)</option>
                  <option value="Transferred">Transferred</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>

            </div>
          </div>

          {/* Form Actions */}
          <div className="p-6 bg-slate-50 flex items-center justify-end gap-3">
            <Link
              href="/dashboard/students"
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin mr-2"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check mr-2"></i> Save Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}