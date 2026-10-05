'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Library Book
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

// Initial mock data for the library catalog
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
    title: 'A People\'s History of the United States',
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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Low Availability':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Checked Out':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Lost/Damaged':
        return 'bg-rose-50 text-rose-700 border-rose-200';
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Library Catalog & Book Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage library inventory, track book availability, and oversee categorization and shelving locations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/library/circulation"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-book-open-reader mr-2 text-xs text-blue-600"></i> Circulation Desk
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Add New Book
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Catalog Titles</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-book text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">14,208</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> +120 this semester</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Currently Checked Out</p>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <i className="fa-solid fa-hand-holding-hand text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">1,845</p>
          <span className="text-xs text-indigo-600 font-medium">13% of total inventory</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue Returns</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock-rotate-left text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">42</p>
          <span className="text-xs text-amber-600 font-medium">Pending circulation review</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lost / Damaged</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-book-skull text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">18</p>
          <span className="text-xs text-rose-600 font-medium">Requires replacement purchasing</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Textbook">Textbook</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Reference">Reference</option>
              <option value="Periodical">Periodical</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
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
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Title & Author</th>
                <th className="py-3 px-4">ISBN</th>
                <th className="py-3 px-4">Category / Shelf</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">{book.title}</div>
                      <div className="text-xs text-slate-500 truncate">{book.author}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{book.isbn}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium text-xs">{book.category}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Loc: {book.shelfLocation}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 text-xs">{book.availableCopies} / {book.totalCopies}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wide">Copies Available</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(book.status)}`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Edit
                      </button>
                      <button className="text-emerald-600 hover:text-emerald-800 font-medium text-xs px-2 py-1 rounded hover:bg-emerald-50 transition-colors">
                        Checkout
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Add Book to Catalog</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleAddBook} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Quantum Mechanics"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Author(s)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David J. Griffiths"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    ISBN (10 or 13)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 978-1107189638"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Textbook">Textbook</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Reference">Reference</option>
                    <option value="Periodical">Periodical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Shelf Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sci-P3"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Total Copies
                  </label>
                  <input
                    type="number"
                    required
                    defaultValue={1}
                    min={1}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Publication Year
                  </label>
                  <input
                    type="number"
                    placeholder="YYYY"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
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