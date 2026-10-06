'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for an E-Learning Resource
interface ResourceItem {
  id: string;
  title: string;
  subject: string;
  fileType: 'PDF' | 'Video' | 'Document' | 'Link';
  fileSize: string;
  uploader: string;
  uploadDate: string;
  downloads: number;
}

// Initial mock data for e-learning resources
const initialResources: ResourceItem[] = [
  {
    id: 'RES-001',
    title: 'Algebra II Comprehensive Formula Sheet & Problem Bank',
    subject: 'Algebra II',
    fileType: 'PDF',
    fileSize: '4.2 MB',
    uploader: 'Mr. David Wilson',
    uploadDate: '2026-09-28',
    downloads: 318,
  },
  {
    id: 'RES-002',
    title: 'Cellular Mitosis & Meiosis 3D Lecture Recording',
    subject: 'General Science',
    fileType: 'Video',
    fileSize: '145 MB',
    uploader: 'Ms. Emily Davis',
    uploadDate: '2026-09-29',
    downloads: 245,
  },
  {
    id: 'RES-003',
    title: 'Industrial Revolution Primary Source Analysis Pack',
    subject: 'World History',
    fileType: 'Document',
    fileSize: '8.7 MB',
    uploader: 'Dr. James Anderson',
    uploadDate: '2026-09-30',
    downloads: 189,
  },
  {
    id: 'RES-004',
    title: 'Hamlet Act III Scene Analysis & Discussion Prompts',
    subject: 'English Literature',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    uploader: 'Mrs. Amanda Martinez',
    uploadDate: '2026-10-01',
    downloads: 142,
  },
  {
    id: 'RES-005',
    title: 'AP Calculus Derivative Cheat Sheet & Practice Set',
    subject: 'Calculus',
    fileType: 'PDF',
    fileSize: '5.5 MB',
    uploader: 'Mr. David Wilson',
    uploadDate: '2026-10-02',
    downloads: 210,
  },
];

export default function ELearningResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, file type, and subject
  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'All' || res.fileType === typeFilter;
    const matchesSubject = subjectFilter === 'All' || res.subject === subjectFilter;

    return matchesSearch && matchesType && matchesSubject;
  });

  // Helper for file type badge styling & icon
  const getFileTypeBadge = (fileType: ResourceItem['fileType']) => {
    switch (fileType) {
      case 'PDF':
        return { style: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'fa-file-pdf' };
      case 'Video':
        return { style: 'bg-purple-50 text-purple-700 border-purple-200', icon: 'fa-file-video' };
      case 'Document':
        return { style: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'fa-file-word' };
      case 'Link':
        return { style: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'fa-link' };
      default:
        return { style: 'bg-slate-50 text-slate-700 border-slate-200', icon: 'fa-file' };
    }
  };

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New study resource successfully uploaded to the repository.');
    setUploadModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            E-Learning Resources & Study Materials
          </h1>
          <p className="text-sm text-slate-500">
            Manage course documents, lecture recordings, reading lists, and digital study assets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/e-learning/courses"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-laptop-code mr-2 text-xs text-blue-600"></i> All Courses
          </Link>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-cloud-arrow-up mr-2 text-xs"></i> Upload Resource
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <i className="fa-solid fa-circle-check text-emerald-600 mr-2 text-base"></i>
            <span>{successBanner}</span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Resources</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-folder-open text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">142</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Active library assets</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Downloads</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-download text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">3,480</p>
          <span className="text-xs text-emerald-600 font-medium">By students & teachers</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Storage Utilized</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-hard-drive text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">18.4 GB</p>
          <span className="text-xs text-purple-600 font-medium">Secure cloud storage</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Video Lectures</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-video text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">38</p>
          <span className="text-xs text-amber-600 font-medium">Recorded sessions</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search resource title, subject, or uploader..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Subject:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Subjects</option>
              <option value="Algebra II">Algebra II</option>
              <option value="General Science">General Science</option>
              <option value="World History">World History</option>
              <option value="English Literature">English Literature</option>
              <option value="Calculus">Calculus</option>
            </select>
          </div>

          {/* File Type Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Format:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Formats</option>
              <option value="PDF">PDF</option>
              <option value="Video">Video</option>
              <option value="Document">Document</option>
              <option value="Link">Link</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Resource Title / ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Uploader</th>
                <th className="py-3 px-4">Downloads</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredResources.length > 0 ? (
                filteredResources.map((res) => {
                  const badge = getFileTypeBadge(res.fileType);
                  return (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{res.title}</div>
                        <div className="text-xs text-slate-500 font-mono">Uploaded: {res.uploadDate} • {res.id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{res.subject}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${badge.style}`}>
                          <i className={`fa-solid ${badge.icon} text-[10px]`}></i>
                          {res.fileType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{res.fileSize}</td>
                      <td className="py-3.5 px-4 text-slate-800 text-xs font-medium">{res.uploader}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-mono text-xs font-semibold">{res.downloads}</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                          Download
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No matching e-learning resources found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Resource Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Upload Study Resource</h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleUploadResource} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Chemistry Nomenclature Guide"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Algebra II">Algebra II</option>
                    <option value="General Science">General Science</option>
                    <option value="World History">World History</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Calculus">Calculus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    File Format
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="PDF">PDF Document</option>
                    <option value="Video">Video Recording</option>
                    <option value="Document">Word / Worksheet</option>
                    <option value="Link">External Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Select File or Link
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <i className="fa-solid fa-cloud-arrow-up text-slate-400 text-xl mb-1"></i>
                      <p className="text-xs text-slate-500 font-medium">
                        <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[10px] text-slate-400">PDF, MP4, DOCX up to 500MB</p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}