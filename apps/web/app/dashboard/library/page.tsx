'use client';

import { useState } from 'react';
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

type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: 'Sciences' | 'Mathematics' | 'Literature' | 'History' | 'Reference';
  totalCopies: number;
  availableCopies: number;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
  lastBorrowedBy?: string;
};

const INITIAL_BOOKS: Book[] = [
  {
    id: 'BK-1001',
    title: 'Advanced Engineering Mathematics',
    author: 'Erwin Kreyszig',
    isbn: '978-0470458365',
    category: 'Mathematics',
    totalCopies: 15,
    availableCopies: 4,
    status: 'Available',
    lastBorrowedBy: 'Brian Kiprop (Form 4West)',
  },
  {
    id: 'BK-1002',
    title: 'Comprehensive Physics for High Schools',
    author: 'Tom Duncan & Heather Kennett',
    isbn: '978-0719553288',
    category: 'Sciences',
    totalCopies: 30,
    availableCopies: 2,
    status: 'Low Stock',
    lastBorrowedBy: 'Amina Mohamed (Form 3East)',
  },
  {
    id: 'BK-1003',
    title: 'The River and the Source',
    author: 'Margaret Ogola',
    isbn: '978-9966846174',
    category: 'Literature',
    totalCopies: 50,
    availableCopies: 18,
    status: 'Available',
    lastBorrowedBy: 'Kevin Otieno (Form 2North)',
  },
  {
    id: 'BK-1004',
    title: 'East Africa Through a Thousand Years',
    author: 'G. S. Were & D. A. Wilson',
    isbn: '978-0230534575',
    category: 'History',
    totalCopies: 20,
    availableCopies: 0,
    status: 'Out of Stock',
    lastBorrowedBy: 'Grace Wanjiku (Form 4South)',
  },
  {
    id: 'BK-1005',
    title: 'Oxford Advanced Learner Dictionary',
    author: 'A. S. Hornby',
    isbn: '978-0194799003',
    category: 'Reference',
    totalCopies: 10,
    availableCopies: 7,
    status: 'Available',
    lastBorrowedBy: 'Staff Reference Room',
  },
];

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Book Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newCategory, setNewCategory] = useState<Book['category']>('Sciences');
  const [newCopies, setNewCopies] = useState('10');

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;

    const copiesNum = parseInt(newCopies) || 10;
    const newBook: Book = {
      id: `BK-100${books.length + 1}`,
      title: newTitle,
      author: newAuthor,
      isbn: newIsbn || '978-0000000000',
      category: newCategory,
      totalCopies: copiesNum,
      availableCopies: copiesNum,
      status: 'Available',
      lastBorrowedBy: 'None (Newly Cataloged)',
    };

    setBooks([newBook, ...books]);
    setNewTitle('');
    setNewAuthor('');
    setNewIsbn('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ==================================================================
         PAGE HEADER
         ========================================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Link href="/dashboard" className="hover:text-[#006FBF]">
              Dashboard
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900">Library Management</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Library Catalog & Book Loans
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Track textbook inventory, active student loan circulation, and reference cataloging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus mr-2" />
            Add New Book
          </button>
        </div>
      </div>

      {/* ==================================================================
         METRICS OVERVIEW
         ========================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Catalog Titles
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">1,450</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-[#006FBF]">
            <i className="fa-solid fa-book mr-1" /> Across 5 categories
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Loans
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">342</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-emerald-600">
            <i className="fa-solid fa-arrow-right-arrow-left mr-1" /> Checked out to students
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Overdue Returns
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">14</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-amber-600">
            <i className="fa-solid fa-triangle-exclamation mr-1" /> Automated SMS reminders sent
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Replacement Fines (Term)
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">KES 4,500</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-slate-500">
            Collected via finance portal
          </span>
        </div>
      </div>

      {/* ==================================================================
         SEARCH & FILTER BAR
         ========================================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center">
          <i className="fa-solid fa-magnifying-glass absolute left-3 text-xs text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books by title, author, or ISBN..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
          >
            <option value="all">All Categories</option>
            <option value="Sciences">Sciences</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Literature">Literature</option>
            <option value="History">History</option>
            <option value="Reference">Reference</option>
          </select>
        </div>
      </div>

      {/* ==================================================================
         LIBRARY BOOKS TABLE
         ========================================================================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 pl-4 pr-3">Book ID & Title</th>
                <th className="px-3 py-3">Author & ISBN</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Copies (Avail / Total)</th>
                <th className="px-3 py-3">Status</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="py-3 pl-4 pr-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]">
                        <i className="fa-solid fa-book text-[11px]" />
                      </span>
                      <div>
                        <span className="font-semibold text-slate-900 block">{book.title}</span>
                        <span className="font-mono text-[10px] text-slate-400">{book.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <span className="text-slate-800 font-medium block">{book.author}</span>
                    <span className="font-mono text-[10px] text-slate-400">{book.isbn}</span>
                  </td>

                  <td className="px-3 py-3">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {book.category}
                    </span>
                  </td>

                  <td className="px-3 py-3 font-medium text-slate-700">
                    <span className="font-bold text-slate-900">{book.availableCopies}</span> / {book.totalCopies}
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        book.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                          : book.status === 'Low Stock'
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                          : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>

                  <td className="py-3 pl-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        Issue / Return
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================
         ADD BOOK MODAL
         ================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]">
                  <i className="fa-solid fa-book-medical text-xs" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">Catalog New Book</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Biology Form 2 Student Book"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Author / Publisher</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g., KLB Kenya Literature Bureau"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Book['category'])}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Literature">Literature</option>
                    <option value="History">History</option>
                    <option value="Reference">Reference</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={newCopies}
                    onChange={(e) => setNewCopies(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ISBN Number</label>
                <input
                  type="text"
                  value={newIsbn}
                  onChange={(e) => setNewIsbn(e.target.value)}
                  placeholder="978-xxxxxxxxxx"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 font-mono text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                  }}
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}