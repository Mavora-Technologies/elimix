'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

        const res = await fetch('http://localhost:3001/api/v1/academics/reference', {
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

      const res = await fetch('http://localhost:3001/api/v1/academics/streams', {
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Stream</h1>
          <p className="text-sm text-slate-500">Provision a new classroom stream for an existing grade.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm font-medium">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Target Grade / Class <span className="text-rose-500">*</span></label>
            <select
              required
              disabled={isFetchingData}
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">{isFetchingData ? 'Loading...' : 'Select a grade...'}</option>
              {referenceData.classes.map((cls: any) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Stream Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. East Stream"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Room Number</label>
            <input
              type="text"
              placeholder="e.g. Rm 104"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Class Teacher</label>
            <select
              disabled={isFetchingData}
              value={formData.classTeacherId}
              onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Unassigned</option>
              {referenceData.teachers.map((teacher: any) => (
                <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Max Capacity <span className="text-rose-500">*</span></label>
            <input
              type="number"
              min="1"
              required
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Link href="/dashboard/students/classes" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">
            Cancel
          </Link>
          <button type="submit" disabled={isLoading} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm disabled:opacity-50">
            {isLoading ? 'Saving...' : 'Create Stream'}
          </button>
        </div>
      </form>
    </div>
  );
}