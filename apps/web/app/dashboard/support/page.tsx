// apps/web/app/dashboard/support/page.tsx
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

// Mock data for Help Categories
const helpCategories = [
  {
    id: 'cat-1',
    title: 'Platform Onboarding',
    description: 'Initial setup, tenant configuration, and basic navigation.',
    icon: 'fa-solid fa-rocket',
    articleCount: 12,
  },
  {
    id: 'cat-2',
    title: 'Student & Parent Portals',
    description: 'Managing admissions, directories, and parent access logs.',
    icon: 'fa-solid fa-users',
    articleCount: 24,
  },
  {
    id: 'cat-3',
    title: 'Academics & Exams',
    description: 'Timetables, grading matrices, report cards, and e-learning.',
    icon: 'fa-solid fa-graduation-cap',
    articleCount: 38,
  },
  {
    id: 'cat-4',
    title: 'Finance & Billing',
    description: 'Fee structures, invoices, M-Pesa integration, and accounting.',
    icon: 'fa-solid fa-wallet',
    articleCount: 19,
  },
  {
    id: 'cat-5',
    title: 'HR & Operations',
    description: 'Staff payroll, leave management, inventory, and library.',
    icon: 'fa-solid fa-building-user',
    articleCount: 15,
  },
  {
    id: 'cat-6',
    title: 'Security & API',
    description: 'RBAC permissions, audit logs, and developer webhooks.',
    icon: 'fa-solid fa-shield-halved',
    articleCount: 9,
  },
];

// Mock data for Recent Tickets
const recentTickets = [
  {
    id: 'TKT-1042',
    subject: 'M-Pesa Paybill callback not updating student balances',
    category: 'Finance',
    status: 'In Progress',
    priority: 'High',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'TKT-1038',
    subject: 'Unable to generate Term 3 report cards in bulk',
    category: 'Academics',
    status: 'Resolved',
    priority: 'Medium',
    lastUpdated: 'Yesterday',
  },
  {
    id: 'TKT-1021',
    subject: 'Request to add custom grading rubric for IGCSE',
    category: 'Configuration',
    status: 'Resolved',
    priority: 'Low',
    lastUpdated: 'Oct 10, 2026',
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
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
      setSuccessBanner('Your support ticket has been submitted. Our team will respond shortly.');
      
      // Reset form
      setTicketSubject('');
      setTicketMessage('');
      
      setTimeout(() => setSuccessBanner(null), 5000);
    }, 1200);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'In Progress': return 'bg-blue-50/80 text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20';
      case 'Open': return 'bg-amber-50/80 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      default: return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-rose-600 font-bold';
      case 'Medium': return 'text-amber-600 font-bold';
      case 'Low': return 'text-slate-500 font-semibold';
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
            <span className="text-slate-900 truncate">Support</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Help & Support Center</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Access documentation, contact technical support, and track your active tickets.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a href="https://docs.elimix.com" target="_blank" rel="noreferrer" className="hidden sm:flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <i className="fa-solid fa-book text-[#006FBF]"></i><span>Documentation</span>
          </a>
          <button onClick={() => setTicketModalOpen(true)} className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-life-ring text-[10px]"></i><span>Create Ticket</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <i className="fa-solid fa-check text-[10px] bg-emerald-100/80 text-emerald-600 p-1.5 rounded-lg" />
          <p className="flex-1">{successBanner}</p>
        </div>
      )}

      {/* SEARCH HERO SECTION */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#006FBF]/10">
        <div className="absolute inset-0 z-0" style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})` }}>
          <div className="absolute inset-0 opacity-20 bg-[url('/grid-pattern.svg')] mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 p-8 sm:p-12 flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">How can we help you today?</h2>
          <p className="text-blue-100 text-sm mb-8 max-w-lg">Search our comprehensive knowledge base for tutorials, troubleshooting guides, and best practices.</p>
          
          <div className="relative w-full max-w-2xl">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search for articles (e.g., 'How to generate fee invoices')" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-4 text-sm text-slate-900 shadow-lg outline-none focus:ring-4 focus:ring-[#04B1D6]/30 transition-all placeholder:text-slate-400"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90" style={{ background: BRAND.blue }}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* KNOWLEDGE BASE CATEGORIES */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-4 px-1">Browse by Topic</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpCategories.map((category) => (
            <Link href={`/dashboard/support/category/${category.id}`} key={category.id} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-[#006FBF]/30 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[#006FBF] transition-colors group-hover:bg-[#006FBF]/10">
                  <i className={`${category.icon} text-lg`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#006FBF] transition-colors">{category.title}</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">{category.description}</p>
                  <span className="mt-3 inline-block text-[10px] font-semibold text-[#006FBF] bg-[#006FBF]/5 px-2 py-0.5 rounded-full">
                    {category.articleCount} articles
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* RECENT TICKETS TABLE */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold text-slate-900">Recent Support Tickets</h3>
          <Link href="/dashboard/support/tickets" className="text-xs font-semibold text-[#006FBF] hover:underline">View All Tickets</Link>
        </div>
        
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 pl-5 pr-3 w-[40%]">Ticket Subject & ID</th>
                  <th className="py-4 px-4 w-[15%]">Category</th>
                  <th className="py-4 px-4 w-[15%]">Priority</th>
                  <th className="py-4 px-4 w-[15%]">Last Updated</th>
                  <th className="py-4 pl-3 pr-5 text-right w-[15%]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/40 transition-colors text-xs cursor-pointer group">
                    <td className="py-4 pl-5 pr-3">
                      <div className="font-semibold text-slate-900 truncate max-w-[400px] group-hover:text-[#006FBF] transition-colors">{ticket.subject}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ticket.id}</div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600">{ticket.category}</td>
                    <td className="py-4 px-4">
                      <span className={getPriorityBadge(ticket.priority)}>{ticket.priority}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{ticket.lastUpdated}</td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QUICK CONTACT FOOTER */}
      <div className="mt-8 rounded-2xl border border-slate-200/80 bg-slate-50 p-6 sm:p-8 text-center flex flex-col items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
          <i className="fa-solid fa-headset text-xl"></i>
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-2">Need immediate assistance?</h3>
        <p className="text-xs text-slate-500 mb-6 max-w-md">Our enterprise support team at Mavora Technologies is available 24/7 to assist institutional administrators.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100 transition-colors">
            <i className="fa-regular fa-comment-dots text-[#006FBF]"></i> Start Live Chat
          </button>
          <a href="mailto:support@mavora.co.ke" className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100 transition-colors">
            <i className="fa-regular fa-envelope text-[#006FBF]"></i> Email Support
          </a>
        </div>
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