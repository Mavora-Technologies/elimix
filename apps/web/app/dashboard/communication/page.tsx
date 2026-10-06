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

type Broadcast = {
  id: string;
  title: string;
  recipientGroup: string;
  channel: 'SMS' | 'Email' | 'Multi-Channel';
  status: 'Delivered' | 'Scheduled' | 'Failed';
  recipientsCount: number;
  sentAt: string;
  preview: string;
};

const INITIAL_BROADCASTS: Broadcast[] = [
  {
    id: 'MSG-301',
    title: 'Term 2 Fee Balance Reminder',
    recipientGroup: 'All Parents (Forms 1-4)',
    channel: 'SMS',
    status: 'Delivered',
    recipientsCount: 1248,
    sentAt: 'Today, 08:30 AM',
    preview: 'Dear Parent, this is a reminder that Term 2 fee balances are due by Friday. Pay via M-Pesa Paybill 522522.',
  },
  {
    id: 'MSG-302',
    title: 'Mid-Term Examination Results Dispatched',
    recipientGroup: 'Form 4 Students & Parents',
    channel: 'Multi-Channel',
    status: 'Delivered',
    recipientsCount: 312,
    sentAt: 'Yesterday, 04:15 PM',
    preview: 'Mid-term report cards have been published to the student portal. Access rankings and teacher remarks online.',
  },
  {
    id: 'MSG-303',
    title: 'Board of Management (BOM) Meeting Notice',
    recipientGroup: 'Faculty & Board Members',
    channel: 'Email',
    status: 'Delivered',
    recipientsCount: 45,
    sentAt: 'Oct 04, 2026',
    preview: 'Notice for the scheduled quarterly BOM meeting in the main boardroom at 10:00 AM tomorrow.',
  },
  {
    id: 'MSG-304',
    title: 'Inter-House Athletics Championship Postponement',
    recipientGroup: 'Entire School Community',
    channel: 'SMS',
    status: 'Scheduled',
    recipientsCount: 1312,
    sentAt: 'Scheduled for Oct 10, 09:00 AM',
    preview: 'Due to weather forecasts, the inter-house athletics competition has been rescheduled to next Tuesday.',
  },
];

export default function CommunicationPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(INITIAL_BROADCASTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Broadcast Form State
  const [title, setTitle] = useState('');
  const [recipientGroup, setRecipientGroup] = useState('All Parents');
  const [channel, setChannel] = useState<Broadcast['channel']>('SMS');
  const [messageBody, setMessageBody] = useState('');

  const filteredBroadcasts = broadcasts.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipientGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel =
      channelFilter === 'all' || item.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !messageBody) return;

    const newBroadcast: Broadcast = {
      id: `MSG-30${broadcasts.length + 1}`,
      title,
      recipientGroup,
      channel,
      status: 'Delivered',
      recipientsCount: 1248,
      sentAt: 'Just now',
      preview: messageBody,
    };

    setBroadcasts([newBroadcast, ...broadcasts]);
    setTitle('');
    setMessageBody('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ==================================================================
         PAGE HEADER
         ================================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Link href="/dashboard" className="hover:text-[#006FBF]">
              Dashboard
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900">Communication & SMS Hub</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Institutional Broadcasts & Parent Alerts
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Manage bulk SMS gateway credits, email dispatches, and automated push notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-paper-plane mr-2" />
            Compose Broadcast
          </button>
        </div>
      </div>

      {/* ==================================================================
         METRICS OVERVIEW
         ================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            SMS Credits Balance
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">45,820</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-[#006FBF]">
            <i className="fa-solid fa-bolt mr-1" /> Gateway active (Africa's Talking)
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Messages Sent (Month)
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">18,450</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-emerald-600">
            <i className="fa-solid fa-check-double mr-1" /> 99.4% delivery success
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Broadcast Groups
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">12</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-slate-500">
            Parents, Staff, Board & Streams
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Scheduled Dispatches
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">3</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-amber-600">
            <i className="fa-solid fa-clock mr-1" /> Queued for upcoming week
          </span>
        </div>
      </div>

      {/* ==================================================================
         SEARCH & FILTER BAR
         ================================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center">
          <i className="fa-solid fa-magnifying-glass absolute left-3 text-xs text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search broadcasts by title, recipient group, or message content..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
          >
            <option value="all">All Channels</option>
            <option value="SMS">SMS</option>
            <option value="Email">Email</option>
            <option value="Multi-Channel">Multi-Channel</option>
          </select>
        </div>
      </div>

      {/* ==================================================================
         BROADCASTS TABLE
         ================================================================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 pl-4 pr-3">Broadcast Title & Target</th>
                <th className="px-3 py-3">Channel</th>
                <th className="px-3 py-3">Recipients</th>
                <th className="px-3 py-3">Timestamp / Status</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBroadcasts.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="py-3 pl-4 pr-3 max-w-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]">
                        <i className="fa-solid fa-bullhorn text-[11px]" />
                      </span>
                      <div>
                        <span className="font-semibold text-slate-900 block">{item.title}</span>
                        <span className="text-[11px] text-slate-500 block">{item.recipientGroup}</span>
                        <p className="mt-1 text-[11px] text-slate-400 truncate max-w-xs">
                          {item.preview}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {item.channel}
                    </span>
                  </td>

                  <td className="px-3 py-3 font-semibold text-slate-700">
                    {item.recipientsCount} <span className="text-[10px] text-slate-400 font-normal">recipients</span>
                  </td>

                  <td className="px-3 py-3">
                    <span className="text-slate-700 block font-medium">{item.sentAt}</span>
                    <span
                      className={`inline-flex items-center mt-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${
                        item.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                          : item.status === 'Scheduled'
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                          : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3 pl-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        View Report
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
         COMPOSE BROADCAST MODAL
         ================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]">
                  <i className="fa-solid fa-paper-plane text-xs" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">Compose New Broadcast</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Broadcast Title / Subject</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., End of Term Closing Notice"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Recipient Group</label>
                  <select
                    value={recipientGroup}
                    onChange={(e) => setRecipientGroup(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
                  >
                    <option value="All Parents">All Parents & Guardians</option>
                    <option value="Form 4 Students & Parents">Form 4 Candidates Only</option>
                    <option value="All Faculty & Staff">All Faculty & Staff</option>
                    <option value="Board of Management">Board of Management</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delivery Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as Broadcast['channel'])}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
                  >
                    <option value="SMS">SMS Gateway</option>
                    <option value="Email">Email Dispatch</option>
                    <option value="Multi-Channel">Multi-Channel (SMS + Email)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message Body</label>
                <textarea
                  required
                  rows={4}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white resize-none"
                />
                <span className="mt-1 block text-[10px] text-slate-400">
                  Estimated character count: {messageBody.length} (Approx. {Math.ceil(messageBody.length / 160) || 1} SMS unit(s) per recipient)
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  Send Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}