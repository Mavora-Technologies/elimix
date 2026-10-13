// apps/web/app/dashboard/academics/subjects/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ==========================================================================
   ELIMIX BRAND
   ========================================================================== */

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

// Dynamic API URL for Local/Production compatibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function AddSubjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('elimix_token');
      const userJson = localStorage.getItem('elimix_user');
      const tenantId = userJson ? JSON.parse(userJson).tenantId : '';
      const activeTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

      const res = await fetch(`${API_BASE_URL}/academics/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': activeTenantId,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to create subject');
      }

      router.push('/dashboard/academics/subjects');
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* ==================================================================
         BREADCRUMBS & HEADER
         ================================================================== */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
          <Link href="/dashboard" className="hover:text-[#006FBF]">
            Dashboard
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px]" />
          <Link href="/dashboard/academics/subjects" className="hover:text-[#006FBF]">
            Subjects & Curriculum
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px]" />
          <span className="text-slate-900">Add Subject</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-xs"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Add New Subject
            </h1>
            <p className="text-xs text-slate-500">
              Register a new academic subject into the curriculum.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================================
         FORM CARD
         ================================================================== */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6"
      >
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-xs" />
            </span>
            <p className="flex-1">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Subject Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mathematics"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
            />
            <p className="text-[11px] text-slate-400">
              Enter the full official name of the subject or course module.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Course Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. MAT-101"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-mono uppercase text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
            />
            <p className="text-[11px] text-slate-400">
              Unique course identifier used across schedules and report cards.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Link
            href="/dashboard/academics/subjects"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner animate-spin text-xs" />
                <span>Saving Subject...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-check text-xs" />
                <span>Save Subject</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}