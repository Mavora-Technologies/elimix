// apps/web/app/dashboard/library/books/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ==========================================================================
   ELIMIX BRAND PALETTE
   ========================================================================== */
const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

interface BookItem {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: 'Textbook' | 'Fiction' | 'Non-Fiction' | 'Reference' | 'Periodical';
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  status: 'Available' | 'Low Availability' | 'Checked Out' | 'Lost/Damaged';
}

const initialBooks: BookItem[] = [
  {
    id: 'LIB-B-1001',
    isbn: '978-0134093413',
    title: 'Campbell Biology (11th Edition)',
    author: 'Lisa A. Urry, Michael L. Cain',
    category: 'Textbook',
    shelfLocation: 'Science-A1',
    totalCopies: 45,
    availableCopies: 12,
    status: 'Available',
  },
  {
    id: 'LIB-B-1002',
    isbn: '978-0743273565',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    shelfLocation: 'Lit-F3',
    totalCopies: 30,
    availableCopies: 2,
    status: 'Low Availability',
  },
  {
    id: 'LIB-B-1003',
    isbn: '978-0199232133',
    title: 'Oxford English Dictionary',
    author: 'Oxford University Press',
    category: 'Reference',
    shelfLocation: 'Ref-R1',
    totalCopies: 5,
    availableCopies: 5,
    status: 'Available',
  },
  {
    id: 'LIB-B-1004',
    isbn: '978-1449331818',
    title: 'Learning Python, 5th Edition',
    author: 'Mark Lutz',
    category: 'Non-Fiction',
    shelfLocation: 'Tech-T2',
    totalCopies: 8,
    availableCopies: 0,
    status: 'Checked Out',
  },
  {
    id: 'LIB-B-1005',
    isbn: '978-0060936220',
    title: "A People's History of the United States",
    author: 'Howard Zinn',
    category: 'Non-Fiction',
    shelfLocation: 'Hist-H4',
    totalCopies: 15,
    availableCopies: 14,
    status: 'Available',
  },
];

export default function LibraryBooksPage() {
  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, category, and status
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || book.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: BookItem['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Low Availability':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Checked Out':
        return 'bg-sky-50 text-[#006FBF] border-sky-200';
      case 'Lost/Damaged':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New book successfully added to the library catalog.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#012E54]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#012E54] mb-1 tracking-tight">
            Library Catalog & Book Management
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Manage library inventory, track book availability, and oversee categorization and shelving locations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/library/circulation"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-book-open-reader mr-2 text-xs text-[#006FBF]"></i> Circulation Desk
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="h-[38px] px-4 rounded-xl text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Add New Book
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <i className="fa-solid fa-circle-check text-emerald-600 mr-2 text-base"></i>
            <span className="font-semibold">{successBanner}</span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Catalog Titles</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">14,208</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> +120 this semester
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#006FBF] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-book text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Currently Checked Out</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">1,845</h3>
            <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">13% of total inventory</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-hand-holding-hand text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Overdue Returns</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">42</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Pending circulation review</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock-rotate-left text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Lost / Damaged</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">18</h3>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Requires replacement purchasing</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-book-skull text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Textbook">Textbook</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Reference">Reference</option>
              <option value="Periodical">Periodical</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Low Availability">Low Availability</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Lost/Damaged">Lost/Damaged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Title & Author</th>
                <th className="py-3.5 px-5">ISBN</th>
                <th className="py-3.5 px-5">Category / Shelf</th>
                <th className="py-3.5 px-5">Availability</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5 max-w-xs">
                      <div className="font-bold text-[#012E54] text-[12px] truncate">{book.title}</div>
                      <div className="text-[11px] text-[#64748b] truncate mt-0.5">{book.author}</div>
                    </td>
                    <td className="py-4 px-5 text-[#64748b] font-mono text-[12px]">{book.isbn}</td>
                    <td className="py-4 px-5">
                      <div className="text-[#012E54] font-semibold text-[12px]">{book.category}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">Loc: {book.shelfLocation}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-mono text-[12px] font-bold text-[#012E54]">{book.availableCopies} / {book.totalCopies}</div>
                      <div className="text-[10px] text-[#64748b] uppercase tracking-wide mt-0.5">Copies Available</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(book.status)}`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#006FBF] hover:bg-sky-100 font-semibold text-[12px] transition-colors">
                        Edit
                      </button>
                      <button className="h-[32px] px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[12px] transition-colors">
                        Checkout
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b] text-[13px]">
                    No books matching your criteria were found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Book Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012E54]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#012E54] text-[15px]">Add Book to Catalog</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-[#012E54] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleAddBook} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                  Book Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Quantum Mechanics"
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Author(s)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David J. Griffiths"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    ISBN (10 or 13)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 978-1107189638"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]">
                    <option value="Textbook">Textbook</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Reference">Reference</option>
                    <option value="Periodical">Periodical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Shelf Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sci-P3"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Total Copies
                  </label>
                  <input
                    type="number"
                    required
                    defaultValue={1}
                    min={1}
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Publication Year
                  </label>
                  <input
                    type="number"
                    placeholder="YYYY"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                  }}
                >
                  Save to Catalog
                </button>
              </div> 
            </form>
          </div>
        </div>
      )}
    </div>
  );
}