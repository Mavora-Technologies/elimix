// apps/web/app/dashboard/library/page.tsx
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

interface RecentActivity {
  id: string;
  action: 'Checked Out' | 'Returned' | 'Fine Paid' | 'New Catalog';
  bookTitle: string;
  borrower: string;
  timestamp: string;
}

const recentActivities: RecentActivity[] = [
  {
    id: 'ACT-901',
    action: 'Checked Out',
    bookTitle: 'Campbell Biology (11th Edition)',
    borrower: 'Brian Kiprop (STD-2026-088)',
    timestamp: '10 mins ago',
  },
  {
    id: 'ACT-902',
    action: 'Returned',
    bookTitle: "A People's History of the United States",
    borrower: 'Grace Wanjiku (STD-2026-045)',
    timestamp: '45 mins ago',
  },
  {
    id: 'ACT-903',
    action: 'Fine Paid',
    bookTitle: 'Campbell Biology (11th Edition)',
    borrower: 'Emily Clark (STD-2026-211)',
    timestamp: '2 hours ago',
  },
  {
    id: 'ACT-904',
    action: 'New Catalog',
    bookTitle: 'Introduction to Quantum Mechanics',
    borrower: 'Science Department Shelf Sci-P3',
    timestamp: '3 hours ago',
  },
];

export default function LibraryOverviewDashboard() {
  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#012E54]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#012E54] mb-1 tracking-tight">
            Library & Information Center Overview
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Monitor comprehensive library statistics, textbook inventories, circulation activity, and outstanding fines.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/library/books"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-book mr-2 text-xs text-[#006FBF]"></i> Book Catalog
          </Link>
          <Link
            href="/dashboard/library/circulation"
            className="h-[38px] px-4 rounded-xl text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-hand-holding-hand mr-2 text-xs"></i> Circulation Desk
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <Link href="/dashboard/library/books" className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all group">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Catalog Titles</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54] group-hover:text-[#006FBF] transition-colors">14,208</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> +120 this semester
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#006FBF] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-book text-lg"></i>
          </div>
        </Link>

        <Link href="/dashboard/library/circulation" className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all group">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Active Loans</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54] group-hover:text-[#006FBF] transition-colors">1,845</h3>
            <span className="text-[11px] text-[#006FBF] font-semibold mt-1 block">1,420 Students • 425 Faculty</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-book-open-reader text-lg"></i>
          </div>
        </Link>

        <Link href="/dashboard/library/circulation" className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all group">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Overdue Returns</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54] group-hover:text-rose-600 transition-colors">42</h3>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Automated reminders active</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock-rotate-left text-lg"></i>
          </div>
        </Link>

        <Link href="/dashboard/library/fines" className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all group">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Outstanding Fines</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54] group-hover:text-amber-600 transition-colors">KES 40,860</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">28 accounts pending payment</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-receipt text-lg"></i>
          </div>
        </Link>
      </div>

      {/* Main Grid: Category Breakdown & Recent Circulation Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Category Breakdown (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-[#012E54] text-[15px]">Inventory Breakdown by Category</h3>
            <Link href="/dashboard/library/books" className="text-[12px] font-semibold text-[#006FBF] hover:underline">
              View All Books &rarr;
            </Link>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[12px] font-semibold mb-1">
                <span className="text-[#012E54]">Academic Textbooks</span>
                <span className="text-[#64748b]">6,850 copies (48%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#006FBF] h-full rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] font-semibold mb-1">
                <span className="text-[#012E54]">Fiction & Literature</span>
                <span className="text-[#64748b]">3,410 copies (24%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#04B1D6] h-full rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] font-semibold mb-1">
                <span className="text-[#012E54]">Non-Fiction & Research</span>
                <span className="text-[#64748b]">2,130 copies (15%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] font-semibold mb-1">
                <span className="text-[#012E54]">Reference & Dictionaries</span>
                <span className="text-[#64748b]">1,120 copies (8%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] font-semibold mb-1">
                <span className="text-[#012E54]">Periodicals & Journals</span>
                <span className="text-[#64748b]">698 copies (5%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel (1 Col) */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-[#012E54] text-[15px] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/library/circulation"
                className="w-full h-[42px] px-4 rounded-xl bg-sky-50 text-[#006FBF] hover:bg-sky-100 font-semibold text-[12px] transition-colors flex items-center justify-between"
              >
                <span className="flex items-center"><i className="fa-solid fa-hand-holding-hand mr-2.5 text-sm"></i> Issue / Return Book</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </Link>
              <Link
                href="/dashboard/library/books"
                className="w-full h-[42px] px-4 rounded-xl bg-slate-50 text-[#012E54] hover:bg-slate-100 font-semibold text-[12px] transition-colors flex items-center justify-between"
              >
                <span className="flex items-center"><i className="fa-solid fa-book-medical mr-2.5 text-sm text-[#006FBF]"></i> Add New Book to Catalog</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </Link>
              <Link
                href="/dashboard/library/fines"
                className="w-full h-[42px] px-4 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-[12px] transition-colors flex items-center justify-between"
              >
                <span className="flex items-center"><i className="fa-solid fa-sack-dollar mr-2.5 text-sm"></i> Process Fines & Penalties</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#f1f5f9]">
            <div className="rounded-xl bg-gradient-to-br from-[#012E54] to-[#006FBF] p-4 text-white">
              <h4 className="font-bold text-[13px] mb-1">Need a Library Report?</h4>
              <p className="text-[11px] text-sky-100 mb-3">Export full inventory audit or term circulation summary to PDF/CSV.</p>
              <button className="h-[32px] px-3 rounded-lg bg-white text-[#012E54] font-bold text-[11px] hover:bg-sky-50 transition-colors shadow-sm">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Circulation Activity Feed */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-[#012E54] text-[15px]">Recent Circulation Activity</h3>
          <Link href="/dashboard/library/circulation" className="text-[12px] font-semibold text-[#006FBF] hover:underline">
            View All Logs &rarr;
          </Link>
        </div>

        <div className="divide-y divide-[#f1f5f9]">
          {recentActivities.map((act) => (
            <div key={act.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                  act.action === 'Checked Out' ? 'bg-sky-50 text-[#006FBF]' :
                  act.action === 'Returned' ? 'bg-emerald-50 text-emerald-700' :
                  act.action === 'Fine Paid' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'
                }`}>
                  <i className={`fa-solid ${
                    act.action === 'Checked Out' ? 'fa-book-open-reader' :
                    act.action === 'Returned' ? 'fa-arrow-rotate-left' :
                    act.action === 'Fine Paid' ? 'fa-receipt' : 'fa-plus'
                  }`}></i>
                </span>
                <div>
                  <div className="font-bold text-[#012E54] text-[12px]">{act.bookTitle}</div>
                  <div className="text-[11px] text-[#64748b]">{act.borrower}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                  {act.action}
                </span>
                <div className="text-[10px] text-[#94a3b8] font-mono">{act.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}