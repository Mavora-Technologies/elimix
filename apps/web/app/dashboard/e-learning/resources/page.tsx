// apps/web/app/dashboard/e-learning/resources/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ResourceItem {
  id: string;
  title: string;
  resourceType: 'PDF Document' | 'Video Lecture' | 'E-Book' | 'Interactive Link' | 'Past Paper';
  fileSize: string;
  fileUrl: string;
  downloadsCount: number;
  description?: string;
  subjectId?: string;
  subject: string;
  teacherId?: string;
  uploader: string;
  uploadDate: string;
}

export default function ELearningResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    teacherId: '',
    resourceType: 'PDF Document' as ResourceItem['resourceType'],
    fileSize: '2.4 MB',
    fileUrl: '',
    description: '',
  });

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const userStr = localStorage.getItem('elimix_user');
    let tenantId = '00000000-0000-0000-0000-000000000000';
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        tenantId = JSON.parse(userStr).tenantId || tenantId;
      } catch (e) {}
    }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-tenant-id': tenantId,
    };
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = getHeaders();
      const [resRes, subRes, teachRes] = await Promise.all([
        fetch(`${API_BASE_URL}/e-learning/resources`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/academics/subjects`, { headers }),
        fetch(`${API_BASE_URL}/teachers`, { headers }),
      ]);

      if (resRes && resRes.ok) {
        const json = await resRes.json();
        setResources(json.data || []);
      }
      if (subRes.ok) setSubjects((await subRes.json()).data || []);
      if (teachRes.ok) setTeachers((await teachRes.json()).data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/e-learning/resources`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to upload resource');

      await fetchData();
      setSuccessBanner('Digital resource successfully uploaded to library.');
      setCreateModalOpen(false);
      setFormData({
        title: '',
        subjectId: '',
        teacherId: '',
        resourceType: 'PDF Document',
        fileSize: '2.4 MB',
        fileUrl: '',
        description: '',
      });
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (resItem: ResourceItem) => {
    try {
      await fetch(`${API_BASE_URL}/e-learning/resources/${resItem.id}/download`, {
        method: 'POST',
        headers: getHeaders(),
      });
      await fetchData();
      window.open(resItem.fileUrl, '_blank');
    } catch (e) {
      window.open(resItem.fileUrl, '_blank');
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/e-learning/resources/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchData();
        setSuccessBanner('Resource deleted.');
        setTimeout(() => setSuccessBanner(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'All' || r.resourceType === typeFilter;
      const matchesSubject = subjectFilter === 'All' || r.subject === subjectFilter;

      return matchesSearch && matchesType && matchesSubject;
    });
  }, [resources, searchQuery, typeFilter, subjectFilter]);

  const availableSubjectsFilter = Array.from(new Set(resources.map((r) => r.subject)));

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Digital Resources & Multimedia Library
          </h1>
          <p className="text-sm text-slate-500">
            Access, upload, and track downloads for e-books, lecture videos, revision notes, and past papers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/e-learning/courses"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-laptop-code mr-2 text-xs text-[#006FBF]"></i> E-Learning Courses
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
          >
            <i className="fa-solid fa-cloud-arrow-up mr-2 text-xs"></i> Upload Resource
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm flex items-center shadow-sm">
          <i className="fa-solid fa-circle-check text-emerald-600 mr-2 text-base"></i>
          <span>{successBanner}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Resources</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{resources.length}</p>
          <span className="text-xs text-emerald-600 font-medium">Live database items</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Downloads</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {resources.reduce((sum, r) => sum + (r.downloadsCount || 0), 0)}
          </p>
          <span className="text-xs text-[#006FBF] font-medium">Real-time tracking</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PDF Documents</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {resources.filter((r) => r.resourceType === 'PDF Document').length}
          </p>
          <span className="text-xs text-purple-600 font-medium">Syllabus notes & texts</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Video Lectures</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {resources.filter((r) => r.resourceType === 'Video Lecture').length}
          </p>
          <span className="text-xs text-amber-600 font-medium">Streaming media</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search resource title, subject, or uploader..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#006FBF]"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Subject:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
            >
              <option value="All">All Subjects</option>
              {availableSubjectsFilter.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
            >
              <option value="All">All Types</option>
              <option value="PDF Document">PDF Document</option>
              <option value="Video Lecture">Video Lecture</option>
              <option value="E-Book">E-Book</option>
              <option value="Interactive Link">Interactive Link</option>
              <option value="Past Paper">Past Paper</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Resource Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Uploader</th>
                <th className="py-3.5 px-4">File Size</th>
                <th className="py-3.5 px-4">Downloads</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading digital resources...
                  </td>
                </tr>
              ) : filteredResources.length > 0 ? (
                filteredResources.map((resItem) => (
                  <tr key={resItem.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{resItem.title}</div>
                      {resItem.description && (
                        <div className="text-xs text-slate-500 truncate max-w-xs">{resItem.description}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-50 text-[#006FBF] border border-sky-200">
                        {resItem.resourceType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{resItem.subject}</td>
                    <td className="py-3.5 px-4 text-slate-800 text-xs font-medium">{resItem.uploader}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{resItem.fileSize}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-mono text-xs font-bold">
                      {resItem.downloadsCount} downloads
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleDownload(resItem)}
                        className="rounded-lg bg-[#006FBF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#012E54] shadow-sm"
                      >
                        <i className="fa-solid fa-download mr-1.5 text-[10px]"></i>Download / Open
                      </button>
                      <button
                        onClick={() => handleDeleteResource(resItem.id)}
                        className="text-rose-500 hover:text-rose-700 text-xs px-2 py-1.5 rounded-lg hover:bg-rose-50"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No digital resources found in the database. Click <strong>Upload Resource</strong> to add materials.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Resource Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Upload Digital Resource</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateResource} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium">{formError}</div>
              )}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Form 3 Chemistry Revision Guide 2026"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Subject *</label>
                  <select
                    required
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="">Select subject...</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Uploader / Teacher *</label>
                  <select
                    required
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="">Select uploader...</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName || `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.employeeNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Resource Type</label>
                  <select
                    value={formData.resourceType}
                    onChange={(e) => setFormData({ ...formData, resourceType: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="PDF Document">PDF Document</option>
                    <option value="Video Lecture">Video Lecture</option>
                    <option value="E-Book">E-Book</option>
                    <option value="Interactive Link">Interactive Link</option>
                    <option value="Past Paper">Past Paper</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">File Size</label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    placeholder="e.g. 4.2 MB"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">File URL / Download Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://storage.googleapis.com/..."
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of the document or video content..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
                >
                  {isSubmitting ? 'Uploading...' : 'Publish Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}