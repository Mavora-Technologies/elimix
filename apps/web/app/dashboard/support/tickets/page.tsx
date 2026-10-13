// apps/web/app/dashboard/support/tickets/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

// Mock data for Support Tickets
const mockTickets = [
  {
    id: 'TKT-1042',
    subject: 'M-Pesa Paybill callback not updating student balances',
    category: 'Finance & Billing',
    status: 'In Progress',
    priority: 'High',
    lastUpdated: '2 hours ago',
    created: 'Oct 12, 2026',
  },
  {
    id: 'TKT-1041',
    subject: 'Need assistance setting up termly transport routes',
    category: 'Operations',
    status: 'Open',
    priority: 'Medium',
    lastUpdated: '5 hours ago',
    created: 'Oct 12, 2026',
  },
  {
    id: 'TKT-1038',
    subject: 'Unable to generate Term 3 report cards in bulk',
    category: 'Academics & Exams',
    status: 'Resolved',
    priority: 'High',
    lastUpdated: 'Yesterday',
    created: 'Oct 10, 2026',
  },
  {
    id: 'TKT-1029',
    subject: 'How to add a new Deputy Principal to the system?',
    category: 'General Inquiry',
    status: 'Resolved',
    priority: 'Low',
    lastUpdated: 'Oct 08, 2026',
    created: 'Oct 08, 2026',
  },
  {
    id: 'TKT-1021',
    subject: 'Request to add custom grading rubric for IGCSE',
    category: 'Academics & Exams',
    status: 'Closed',
    priority: 'Medium',
    lastUpdated: 'Oct 05, 2026',
    created: 'Oct 02, 2026',
  },
  {
    id: 'TKT-1015',
    subject: 'Parent portal login issues for multiple parents',
    category: 'Student Directory',
    status: 'Closed',
    priority: 'High',
    lastUpdated: 'Sep 28, 2026',
    created: 'Sep 27, 2026',
  },
];

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Form State for New Ticket
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('General Inquiry');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setTicketModalOpen(false);
      setSuccessBanner('Your support ticket has been submitted successfully.');
      
      // Reset form
      setTicketSubject('');
      setTicketMessage('');
      
      setTimeout(() => setSuccessBanner(null), 4000);
    }, 1200);
  };

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'Closed': return 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-300';
      case 'In Progress': return 'bg-blue-50/80 text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20';
      case 'Open': return 'bg-amber-50/80 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      default: return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded text-[10px] ring-1 ring-inset ring-rose-200';
      case 'Medium': return 'text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px] ring-1 ring-inset ring-amber-200';
      case 'Low': return 'text-slate-600 font-semibold bg-slate-50 px-2 py-0.5 rounded text-[10px] ring-1 ring-inset ring-slate-200';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
            <Link href="/dashboard" className="hover:text-[#006FBF] transition-colors">Dashboard</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/support" className="hover:text-[#006FBF] transition-colors">Support Center</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">My Tickets</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Support Tickets</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Track your ongoing inquiries, feature requests, and issue reports.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/support" className="hidden sm:flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <i className="fa-solid fa-magnifying-glass text-[#006FBF]"></i><span>Knowledge Base</span>
          </Link>
          <button onClick={() => setTicketModalOpen(true)} className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-plus text-[10px]"></i><span>Create Ticket</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <i className="fa-solid fa-check text-[10px] bg-emerald-100/80 text-emerald-600 p-1.5 rounded-lg" />
          <p className="flex-1">{successBanner}</p>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Total Tickets</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{mockTickets.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider truncate">Open & Waiting</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{mockTickets.filter(t => t.status === 'Open').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-[#006FBF] uppercase tracking-wider truncate">In Progress</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{mockTickets.filter(t => t.status === 'In Progress').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Resolved / Closed</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{mockTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search tickets by subject or ID..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 sm:py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white transition-colors" 
          />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white transition-colors">
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white transition-colors">
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-5 pr-3 w-[35%]">Ticket Subject & ID</th>
                <th className="py-4 px-4 w-[15%]">Category</th>
                <th className="py-4 px-4 w-[10%]">Priority</th>
                <th className="py-4 px-4 w-[15%]">Last Updated</th>
                <th className="py-4 px-4 w-[10%]">Status</th>
                <th className="py-4 pl-3 pr-5 text-right w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/40 transition-colors text-xs group cursor-pointer">
                    <td className="py-4 pl-5 pr-3">
                      <div className="font-semibold text-slate-900 truncate max-w-[350px] group-hover:text-[#006FBF] transition-colors">{ticket.subject}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{ticket.id}</span>
                        <span className="text-[10px] text-slate-400">Created {ticket.created}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600">{ticket.category}</td>
                    <td className="py-4 px-4">
                      <span className={getPriorityBadge(ticket.priority)}>{ticket.priority}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{ticket.lastUpdated}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 hover:text-[#006FBF] hover:bg-[#006FBF]/10 flex items-center justify-center border border-slate-200/60 transition-colors" title="View Ticket">
                          <i className="fa-solid fa-eye text-[10px]"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-xs">No matching tickets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0 relative">
              <div className="flex justify-between items-start gap-2 min-w-0">
                <div className="min-w-0 flex-1 pr-2">
                  <span className="font-semibold text-slate-900 block text-sm leading-snug">{ticket.subject}</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-600 border border-slate-200">{ticket.id}</span>
                  </div>
                </div>
                <span className={`inline-flex flex-shrink-0 items-center px-2 py-1 rounded-md text-[9px] font-bold ${getStatusBadge(ticket.status)}`}>{ticket.status}</span>
              </div>

              <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-solid fa-folder-open text-slate-400 w-4 text-center flex-shrink-0" />
                  <span className="truncate flex-1 font-medium text-slate-700">{ticket.category}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-regular fa-clock text-slate-400 w-4 text-center flex-shrink-0" />
                  <span className="truncate flex-1 text-slate-500">Updated: {ticket.lastUpdated}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className={getPriorityBadge(ticket.priority)}>{ticket.priority}</span>
                <button className="flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-[#006FBF] hover:bg-[#006FBF]/10 transition-colors border border-slate-200/60">
                  View <i className="fa-solid fa-arrow-right text-[9px]"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm">No tickets found.</div>
        )}
      </div>

      {/* CREATE TICKET MODAL */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Create Support Ticket</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Submit an issue to the Mavora technical team.</p>
              </div>
              <button onClick={() => setTicketModalOpen(false)} className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-200/50 flex items-center justify-center transition-colors">
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitTicket}>
              <div className="p-6 space-y-4 text-xs max-h-[60vh] overflow-y-auto">
                
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Ticket Subject <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Briefly summarize the issue" 
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700">Module / Category <span className="text-rose-500">*</span></label>
                    <select 
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Finance & Billing">Finance & Billing</option>
                      <option value="Academics & Exams">Academics & Exams</option>
                      <option value="Student Directory">Student Directory</option>
                      <option value="HR & Payroll">HR & Payroll</option>
                      <option value="Integrations (M-Pesa/SMS)">Integrations (M-Pesa/SMS)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700">Priority Level <span className="text-rose-500">*</span></label>
                    <select 
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors"
                    >
                      <option value="Low">Low - Minor issue / Question</option>
                      <option value="Medium">Medium - Feature not working</option>
                      <option value="High">High - Critical system failure</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Detailed Description <span className="text-rose-500">*</span></label>
                  <textarea 
                    rows={5} 
                    required 
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide as much detail as possible to help us resolve the issue quickly..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 outline-none focus:border-[#006FBF] focus:bg-white transition-colors resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Attachments (Optional)</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <i className="fa-solid fa-cloud-arrow-up text-slate-400 text-lg mb-1"></i>
                        <p className="text-[11px] text-slate-500 font-medium">
                          <span className="font-semibold text-[#006FBF]">Click to upload</span> screenshots or logs
                        </p>
                      </div>
                      <input type="file" className="hidden" multiple />
                    </label>
                  </div>
                </div>

              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setTicketModalOpen(false)} disabled={isSubmitting} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors shadow-sm">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-50" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
                  {isSubmitting ? (
                    <><i className="fa-solid fa-spinner animate-spin"></i> Submitting...</>
                  ) : (
                    <><i className="fa-solid fa-paper-plane text-[10px]"></i> Submit Ticket</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}