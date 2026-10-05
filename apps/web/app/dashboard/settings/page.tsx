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
    currency: 'USD ($)',
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System Settings
          </h1>
          <p className="text-sm text-slate-500">
            Configure system defaults, portal preferences, notification rules, and security controls.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveSettings}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-floppy-disk mr-2 text-xs"></i> Save Changes
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

      {/* Tabs Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Tabs Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors text-left ${
              activeTab === 'general'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-school text-sm w-4 text-center"></i>
            <span>School Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors text-left ${
              activeTab === 'notifications'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-bell text-sm w-4 text-center"></i>
            <span>Notifications & Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors text-left ${
              activeTab === 'security'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-shield-halved text-sm w-4 text-center"></i>
            <span>Security & Access</span>
          </button>

          <button
            onClick={() => setActiveTab('localization')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors text-left ${
              activeTab === 'localization'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-globe text-sm w-4 text-center"></i>
            <span>Localization & Currency</span>
          </button>
        </div>

        {/* Tab Content Cards */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSaveSettings}>
            {/* General Settings Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">School & Institution Profile</h2>
                  <p className="text-xs text-slate-500">
                    Basic information used across fee statements, portal banners, and transport receipts.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      School Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.schoolName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, schoolName: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      School Identifier Code
                    </label>
                    <input
                      type="text"
                      value={generalSettings.schoolCode}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, schoolCode: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Official Contact Email
                    </label>
                    <input
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Helpline Phone Number
                    </label>
                    <input
                      type="text"
                      value={generalSettings.contactPhone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Active Academic Year
                    </label>
                    <select
                      value={generalSettings.academicYear}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, academicYear: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    >
                      <option value="2025/2026">2025/2026</option>
                      <option value="2026/2027">2026/2027</option>
                      <option value="2027/2028">2027/2028</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Physical Address & Postal Code
                  </label>
                  <textarea
                    rows={3}
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Notifications & Alerts</h2>
                  <p className="text-xs text-slate-500">
                    Control automated SMS, email broadcasts, and mobile push notifications for parents and staff.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <div>
                      <div className="font-semibold text-sm text-slate-900">Email System Alerts</div>
                      <div className="text-xs text-slate-500">Send automated email updates for transport and fee receipts.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emailAlerts: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <div>
                      <div className="font-semibold text-sm text-slate-900">SMS Notifications</div>
                      <div className="text-xs text-slate-500">Send urgent broadcast SMS for bus delay warnings or emergency alerts.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, smsAlerts: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <div>
                      <div className="font-semibold text-sm text-slate-900">Transport Live Tracking Delay Alerts</div>
                      <div className="text-xs text-slate-500">Notify parents automatically when bus route exceeds 15 min delay.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.transportDelayAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, transportDelayAlerts: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Fee Balance Reminder Frequency
                    </label>
                    <select
                      value={notificationSettings.feeReminderFrequency}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, feeReminderFrequency: e.target.value })}
                      className="w-full md:w-1/2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
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
                  <h2 className="text-base font-bold text-slate-900">Security & Access Policy</h2>
                  <p className="text-xs text-slate-500">
                    Configure staff authentication rules, session management, and two-factor authentication.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <div>
                      <div className="font-semibold text-sm text-slate-900">Enforce Two-Factor Authentication (2FA)</div>
                      <div className="text-xs text-slate-500">Require 2FA verification for all administrator and teacher accounts.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.enforce2FA}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, enforce2FA: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Inactivity Session Timeout (Minutes)
                      </label>
                      <select
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                      >
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="60">60 Minutes</option>
                        <option value="120">2 Hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Password Expiry Policy
                      </label>
                      <select
                        value={securitySettings.passwordExpiryDays}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiryDays: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
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
                  <h2 className="text-base font-bold text-slate-900">Localization & Regional Defaults</h2>
                  <p className="text-xs text-slate-500">
                    Set primary timezone, financial display currency, and default system language.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      System Timezone
                    </label>
                    <select
                      value={localizationSettings.timezone}
                      onChange={(e) => setLocalizationSettings({ ...localizationSettings, timezone: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Africa/Nairobi (EAT +03:00)">Africa/Nairobi (EAT +03:00)</option>
                      <option value="UTC (GMT +00:00)">UTC (GMT +00:00)</option>
                      <option value="America/New_York (EST -05:00)">America/New_York (EST -05:00)</option>
                      <option value="Europe/London (BST +01:00)">Europe/London (BST +01:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Billing Currency
                    </label>
                    <select
                      value={localizationSettings.currency}
                      onChange={(e) => setLocalizationSettings({ ...localizationSettings, currency: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    >
                      <option value="USD ($)">USD ($) - US Dollar</option>
                      <option value="KES (KSh)">KES (KSh) - Kenyan Shilling</option>
                      <option value="EUR (€)">EUR (€) - Euro</option>
                      <option value="GBP (£)">GBP (£) - British Pound</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Date Display Format
                    </label>
                    <select
                      value={localizationSettings.dateFormat}
                      onChange={(e) => setLocalizationSettings({ ...localizationSettings, dateFormat: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    >
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-05)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (05/10/2026)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (10/05/2026)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Portal Language
                    </label>
                    <select
                      value={localizationSettings.language}
                      onChange={(e) => setLocalizationSettings({ ...localizationSettings, language: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
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
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Reset Defaults
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
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