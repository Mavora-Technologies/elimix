// apps/web/app/dashboard/parents/notifications/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ParentNotification {
  id: string;
  subject: string;
  targetAudience: string;
  channel: 'SMS' | 'Email' | 'Push';
  sentDate: string;
  recipientsCount: number;
  status: 'Delivered' | 'Scheduled' | 'Failed';
}

const initialNotifications: ParentNotification[] = [
  {
    id: 'NOT-001',
    subject: 'Term 3 Fee Reminder & Payment Deadlines',
    targetAudience: 'All Parents',
    channel: 'Email',
    sentDate: '2026-10-01 10:30 AM',
    recipientsCount: 764,
    status: 'Delivered',
  },
  {
    id: 'NOT-002',
    subject: 'Grade 9 Parent-Teacher Conference Notice',
    targetAudience: 'Grade 9 Parents',
    channel: 'SMS',
    sentDate: '2026-09-30 02:15 PM',
    recipientsCount: 120,
    status: 'Delivered',
  },
  {
    id: 'NOT-003',
    subject: 'Emergency Weather Advisory - Early Closing',
    targetAudience: 'All Parents',
    channel: 'Push',
    sentDate: '2026-10-02 03:00 PM',
    recipientsCount: 682,
    status: 'Scheduled',
  },
  {
    id: 'NOT-004',
    subject: 'Mid-Term Exam Results & Performance Reports Released',
    targetAudience: 'Grade 6 & 8 Parents',
    channel: 'Email',
    sentDate: '2026-09-25 09:00 AM',
    recipientsCount: 215,
    status: 'Delivered',
  },
];

export default function ParentNotificationsPage() {
  const [notifications, setNotifications] = useState<ParentNotification[]>(initialNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChannel = channelFilter === 'All' || notif.channel === channelFilter;
    const matchesStatus = statusFilter === 'All' || notif.status === statusFilter;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  // Status badge styling
  const getStatusBadge = (status: ParentNotification['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Scheduled':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Failed':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Channel badge styling
  const getChannelBadge = (channel: ParentNotification['channel']) => {
    switch (channel) {
      case 'Email':
        return 'bg-sky-50 text-[#0ea5e9] border-sky-200';
      case 'SMS':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Push':
        return 'bg-teal-50 text-[#06b6d4] border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New broadcast notification successfully scheduled/sent to parents.');
    setComposeModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Parent Notifications & Broadcasts
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Send announcements, fee reminders, and emergency alerts to parents via SMS, Email, and Push notifications.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/parents"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-users mr-2 text-xs text-[#0ea5e9]"></i> Parent Directory
          </Link>
          <button
            onClick={() => setComposeModalOpen(true)}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-bullhorn mr-2 text-xs"></i> New Broadcast
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Broadcasts</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">142</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> Sent this term
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-paper-plane text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Email Delivery Rate</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">98.4%</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">High inbox placement</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-envelope-circle-check text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">SMS Gateway Balance</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">12,450</h3>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 block">Credits remaining</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-comment-sms text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Scheduled Alerts</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">3</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Queued for delivery</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[320px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search subject or target audience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Channel:</span>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="All">All Channels</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Push">Push</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Subject / Broadcast ID</th>
                <th className="py-3.5 px-5">Target Audience</th>
                <th className="py-3.5 px-5">Channel</th>
                <th className="py-3.5 px-5">Sent / Scheduled Date</th>
                <th className="py-3.5 px-5">Recipients</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => (
                  <tr key={notif.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954]">{notif.subject}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{notif.id}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-700 font-medium text-[12px]">{notif.targetAudience}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getChannelBadge(notif.channel)}`}>
                        {notif.channel}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-[#64748b] text-[12px] font-medium">{notif.sentDate}</td>
                    <td className="py-4 px-5 text-[#042954] font-bold">{notif.recipientsCount.toLocaleString()}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(notif.status)}`}>
                        {notif.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors">
                        View Report
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748b] text-[13px]">
                    No matching notification broadcasts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compose New Broadcast Modal */}
      {composeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042954]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#042954] text-[15px]">New Parent Broadcast</h3>
              <button
                onClick={() => setComposeModalOpen(false)}
                className="text-slate-400 hover:text-[#042954] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSendBroadcast} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Broadcast Subject / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Important Update Regarding School Sports Day"
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Target Audience
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                    <option value="All Parents">All Parents</option>
                    <option value="Grade 9 Parents">Grade 9 Parents</option>
                    <option value="Grade 6 & 8 Parents">Grade 6 & 8 Parents</option>
                    <option value="Overdue Fee Balances">Parents with Overdue Fees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Delivery Channel
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                    <option value="Email">Email Broadcast</option>
                    <option value="SMS">SMS Text Message</option>
                    <option value="Push">App Push Notification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your message here..."
                  className="w-full rounded-xl border border-[#cbd5e1] p-3 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setComposeModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20"
                >
                  Send / Schedule Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}