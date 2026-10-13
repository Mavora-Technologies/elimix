// apps/web/app/dashboard/students/classes/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

// Dynamic API URL for Local/Production compatibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function AddStreamPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [referenceData, setReferenceData] = useState({ classes: [], teachers: [] });

  const [formData, setFormData] = useState({
    classId: '',
    name: '',
    classTeacherId: '',
    capacity: 40,
    roomNumber: '',
  });

  useEffect(() => {
    async function loadReferenceData() {
      try {
        const token = localStorage.getItem('elimix_token');
        const userJson = localStorage.getItem('elimix_user');
        const tenantId = userJson ? JSON.parse(userJson).tenantId : '';
        const activeTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

        const res = await fetch(`${API_BASE_URL}/academics/reference`, {
          headers: { 'Authorization': `Bearer ${token}`, 'x-tenant-id': activeTenantId },
        });
        const result = await res.json();
        if (result.success) setReferenceData(result.data);
      } catch (err) {
        console.error('Failed to load reference data');
      } finally {
        setIsFetchingData(false);
      }
    }
    loadReferenceData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('elimix_token');
      const userJson = localStorage.getItem('elimix_user');
      const tenantId = userJson ? JSON.parse(userJson).tenantId : '';
      const activeTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

      const payload = {
        ...formData,
        classTeacherId: formData.classTeacherId || null,
      };

      const res = await fetch(`${API_BASE_URL}/academics/streams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': activeTenantId,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to create stream');
      }

      router.push('/dashboard/students/classes');
    } catch (err: any) {
      setError(err.message);
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
            <Link href="/dashboard/students/classes" className="hover:text-[#006FBF] transition-colors">Classes & Streams</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">New Stream</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Add Grade Stream</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Provision a new classroom stream and allocate faculty.</p>
        </div>

        <div className="flex w-full sm:w-auto">
          <Link href="/dashboard/students/classes" className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <i className="fa-solid fa-arrow-left text-[10px]"></i> Back to Classes
          </Link>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm flex items-start gap-3 shadow-sm animate-in fade-in">
          <i className="fa-solid fa-triangle-exclamation text-rose-600 mt-0.5 text-base"></i>
          <span className="font-semibold block">{error}</span>
        </div>
      )}

      {/* FORM CARD */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-[#006FBF]"></i> Stream Configuration
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Target Grade / Class <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  disabled={isFetchingData}
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{isFetchingData ? 'Loading grades...' : 'Select a grade...'}</option>
                  {referenceData.classes.map((cls: any) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Stream Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. East Stream"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Room Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rm 104"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Class Teacher / Form Tutor
                </label>
                <select
                  disabled={isFetchingData}
                  value={formData.classTeacherId}
                  onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Unassigned (Pending)</option>
                  {referenceData.teachers.map((teacher: any) => (
                    <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Maximum Desk Capacity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10 font-mono"
                />
              </div>

            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 flex items-center justify-end gap-3">
            <Link href="/dashboard/students/classes" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors shadow-sm">
              Cancel
            </Link>
            <button type="submit" disabled={isLoading || isFetchingData} className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
              {isLoading ? (
                <><i className="fa-solid fa-spinner animate-spin"></i> Provisioning...</>
              ) : (
                <><i className="fa-solid fa-check"></i> Create Stream</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}