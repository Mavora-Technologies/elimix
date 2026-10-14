// apps/web/app/dashboard/settings/page.tsx
'use client';

import { useState } from 'react';

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'localization'>('general');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Form State
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: 'St. Andrew Academy',
    schoolCode: 'STA-2026',
    contactEmail: 'admin@standrew.ac.ke',
    contactPhone: '+254 700 000 000',
    address: 'P.O. Box 40123, Nairobi, Kenya',
    academicYear: '2026/2027',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    parentAppPush: true,
    feeReminderFrequency: 'Weekly',
    transportDelayAlerts: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    enforce2FA: true,
    sessionTimeout: '30',
    passwordExpiryDays: '90',
    allowMultiSession: false,
  });

  const [localizationSettings, setLocalizationSettings] = useState({
    currency: 'KES (KSh)',
    dateFormat: 'YYYY-MM-DD',
    timezone: 'Africa/Nairobi (EAT +03:00)',
    language: 'English (US)',
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('Dashboard settings updated successfully.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            System Settings
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Configure system defaults, portal preferences, notification rules, and security controls.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveSettings}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-floppy-disk mr-2 text-xs"></i> Save Changes
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

      {/* Tabs Layout */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        
        {/* Navigation Tabs Sidebar */}
        <div className="w-full lg:w-72 space-y-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-semibold transition-all text-left ${
              activeTab === 'general'
                ? 'bg-sky-50 text-[#042954] border border-sky-200 shadow-sm'
                : 'text-slate-600 hover:bg-white hover:text-[#042954]'
            }`}
          >
            <i className="fa-solid fa-school text-sm w-4 text-center text-[#0ea5e9]"></i>
            <span>School Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-semibold transition-all text-left ${
              activeTab === 'notifications'
                ? 'bg-sky-50 text-[#042954] border border-sky-200 shadow-sm'
                : 'text-slate-600 hover:bg-white hover:text-[#042954]'
            }`}
          >
            <i className="fa-solid fa-bell text-sm w-4 text-center text-[#0ea5e9]"></i>
            <span>Notifications & Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-semibold transition-all text-left ${
              activeTab === 'security'
                ? 'bg-sky-50 text-[#042954] border border-sky-200 shadow-sm'
                : 'text-slate-600 hover:bg-white hover:text-[#042954]'
            }`}
          >
            <i className="fa-solid fa-shield-halved text-sm w-4 text-center text-[#0ea5e9]"></i>
            <span>Security & Access</span>
          </button>

          <button
            onClick={() => setActiveTab('localization')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-semibold transition-all text-left ${
              activeTab === 'localization'
                ? 'bg-sky-50 text-[#042954] border border-sky-200 shadow-sm'
                : 'text-slate-600 hover:bg-white hover:text-[#042954]'
            }`}
          >
            <i className="fa-solid fa-globe text-sm w-4 text-center text-[#0ea5e9]"></i>
            <span>Localization & Currency</span>
          </button>
        </div>

        {/* Tab Content Cards */}
        <div className="flex-1 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSaveSettings}>
            
            {/* General Settings Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[16px] font-bold text-[#042954]">School & Institution Profile</h2>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Basic information used across fee statements, portal banners, and transport receipts.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                      School Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.schoolName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, schoolName: e.target.value })}
                      className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                      School Identifier Code
                    </label>
                    <input
                      type="text"
                      value={generalSettings.schoolCode}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, schoolCode: e.target.value })}
                      className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20 font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                      Official Contact Email
                    </label>
                    <input
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                      className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                      Helpline Phone Number
                    </label>
                    <input
                      type="text"
                      value={generalSettings.contactPhone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                      className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20 font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                      Active Academic Year
                    </label>
                    <select
                      value={generalSettings.academicYear}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, academicYear: e.target.value })}
                      className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20 font-medium cursor-pointer"
                    >
                      <option value="2025/2026">2025/2026</option>
                      <option value="2026/2027">2026/2027</option>
                      <option value="2027/2028">2027/2028</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Physical Address & Postal Code
                  </label>
                  <textarea
                    rows={3}
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                    className="w-full rounded-xl border border-[#cbd5e1] p-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20 font-medium"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[16px] font-bold text-[#042954]">Notifications & Alerts</h2>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Control automated SMS, email broadcasts, and mobile push notifications for parents and staff.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-2xl bg-slate-50/50">
                    <div>
                      <div className="font-bold text-[13px] text-[#042954]">Email System Alerts</div>
                      <div className="text-[11px] text-[#64748b]">Send automated email updates for transport and fee receipts.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emailAlerts: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-2xl bg-slate-50/50">
                    <div>
                      <div className="font-bold text-[13px] text-[#042954]">SMS Notifications</div>
                      <div className="text-[11px] text-[#64748b]">Send urgent broadcast SMS for bus delay warnings or emergency alerts.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, smsAlerts: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-2xl bg-slate-50/50">
                    <div>
                      <div className="font-bold text-[13px] text-[#042954]">Transport Live Tracking Delay Alerts</div>
                      <div className="text-[11px] text-[#64748b]">Notify parents automatically when bus route exceeds 15 min delay.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.transportDelayAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, transportDelayAlerts: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                      Fee Balance Reminder Frequency
                    </label>
                    <select
                      value={notificationSettings.feeReminderFrequency}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, feeReminderFrequency: e.target.value })}
                      className="w-full md:w-1/2 h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] font-medium cursor-pointer"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-Weekly">Bi-Weekly</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[16px] font-bold text-[#042954]">Security & Access Policy</h2>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Configure staff authentication rules, session management, and two-factor authentication.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-2xl bg-slate-50/50">
                    <div>
                      <div className="font-bold text-[13px] text-[#042954]">Enforce Two-Factor Authentication (2FA)</div>
                      <div className="text-[11px] text-[#64748b]">Require 2FA verification for all administrator and teacher accounts.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.enforce2FA}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, enforce2FA: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                        Inactivity Session Timeout (Minutes)
                      </label>
                      <select
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                        className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] font-medium cursor-pointer"
                      >
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="60">60 Minutes</option>
                        <option value="120">2 Hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                        Password Expiry Policy
                      </label>
                      <select
                        value={securitySettings.passwordExpiryDays}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiryDays: e.target.value })}
                        className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] font-medium cursor-pointer"
                      >
                        <option value="30">Every 30 Days</option>
                        <option value="60">Every 60 Days</option>
                        <option value="90">Every 90 Days</option>
                        <option value="Never">Never Expire</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Localization Tab */}
            {activeTab === 'localization' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[16px] font-bold text-[#042954]">Localization & Regional Defaults</h2>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Set primary timezone, financial display currency, and default system language.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                      System Timezone
                    </label>
                    <select
                      value={localizationSettings.timezone}
                      onChange={(e) => setLocalizationSettings({ ...localizationSettings, timezone: e.target.value })}
                      className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] font-medium cursor-pointer"
                    >
                      <option value="Africa/Nairobi (EAT +03:00)">Africa/Nairobi (EAT +03:00)</option>
                      <option value="UTC (GMT +00:00)">UTC (GMT +00:00)</option>
                      <option value="America/New_York (EST -05:00)">America/New_York (EST -05:00)</option>
                      <option value="Europe/London (BST +01:00)">Europe/London (BST +01:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                      Billing Currency
                    </label>
                    <select
                      value={localizationSettings.currency}
                      onChange={(e) => setLocalizationSettings({ ...localizationSettings, currency: e.target.value })}
                      className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] font-medium cursor-pointer"
                    >
                      <option value="KES (KSh)">KES (KSh) - Kenyan Shilling</option>
                      <option value="USD ($)">USD ($) - US Dollar</option>
                      <option value="EUR (€)">EUR (€) - Euro</option>
                      <option value="GBP (£)">GBP (£) - British Pound</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                      Date Display Format
                    </label>
                    <select
                      value={localizationSettings.dateFormat}
                      onChange={(e) => setLocalizationSettings({ ...localizationSettings, dateFormat: e.target.value })}
                      className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] font-medium cursor-pointer"
                    >
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-14)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (14/10/2026)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (10/14/2026)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                      Portal Language
                    </label>
                    <select
                      value={localizationSettings.language}
                      onChange={(e) => setLocalizationSettings({ ...localizationSettings, language: e.target.value })}
                      className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] font-medium cursor-pointer"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="Swahili">Swahili (Kiswahili)</option>
                      <option value="French">French (Français)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-8 pt-5 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
              <button
                type="button"
                className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm"
              >
                Reset Defaults
              </button>
              <button
                type="submit"
                className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}