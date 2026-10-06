'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Parent Notification Broadcast
interface ParentNotification {
  id: string;
  subject: string;
  targetAudience: string;
  channel: 'SMS' | 'Email' | 'Push';
  sentDate: string;
  recipientsCount: number;
  status: 'Delivered' | 'Scheduled' | 'Failed';
}

// Initial mock data for notifications
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

  // Filter logic based on search, channel, and status
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChannel = channelFilter === 'All' || notif.channel === channelFilter;
    const matchesStatus = statusFilter === 'All' || notif.status === statusFilter;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: ParentNotification['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Scheduled':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Helper for channel icon badge
  const getChannelBadge = (channel: ParentNotification['channel']) => {
    switch (channel) {
      case 'Email':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SMS':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Push':
        return 'bg-teal-50 text-teal-700 border-teal-200';
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Parent Notifications & Broadcasts
          </h1>
          <p className="text-sm text-slate-500">
            Send announcements, fee reminders, and emergency alerts to parents via SMS, Email, and Push notifications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/parents"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-users mr-2 text-xs text-blue-600"></i> Parent Directory
          </Link>
          <button
            onClick={() => setComposeModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-bullhorn mr-2 text-xs"></i> New Broadcast
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Broadcasts</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">142</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Sent this term</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Delivery Rate</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-envelope-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">98.4%</p>
          <span className="text-xs text-emerald-600 font-medium">High inbox placement</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SMS Gateway Balance</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-comment-sms text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">12,450</p>
          <span className="text-xs text-slate-500 font-medium">Credits remaining</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled Alerts</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
          <span className="text-xs text-amber-600 font-medium">Queued for delivery</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search subject or target audience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Channel Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Channel:</span>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Channels</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Push">Push</option>
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
              <option value="Delivered">Delivered</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Subject / Broadcast ID</th>
                <th className="py-3 px-4">Target Audience</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Sent / Scheduled Date</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => (
                  <tr key={notif.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{notif.subject}</div>
                      <div className="text-xs text-slate-500 font-mono">{notif.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{notif.targetAudience}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getChannelBadge(notif.channel)}`}>
                        {notif.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">{notif.sentDate}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{notif.recipientsCount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(notif.status)}`}>
                        {notif.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        View Report
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">New Parent Broadcast</h3>
              <button
                onClick={() => setComposeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSendBroadcast} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Broadcast Subject / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Important Update Regarding School Sports Day"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Target Audience
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="All Parents">All Parents</option>
                    <option value="Grade 9 Parents">Grade 9 Parents</option>
                    <option value="Grade 6 & 8 Parents">Grade 6 & 8 Parents</option>
                    <option value="Overdue Fee Balances">Parents with Overdue Fees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Delivery Channel
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Email">Email Broadcast</option>
                    <option value="SMS">SMS Text Message</option>
                    <option value="Push">App Push Notification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your message here..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setComposeModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
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