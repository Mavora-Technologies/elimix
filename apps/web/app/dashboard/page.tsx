'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isSuperAdmin: boolean;
  tenantId?: string;
}

export default function DashboardOverviewPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("elimix_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    setCurrentTime(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="space-y-6 font-sans pb-12">
      
      {/* Executive Header & Institutional Context Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <i className="fa-solid fa-shield-halved"></i> Enterprise Multi-Tenant Workspace
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-normal">{currentTime}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome, {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : "Administrator"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Academic Year 2026 — Term 2 Operations & Institutional Governance Console.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/reports">
            <Button variant="outline" className="text-xs font-semibold h-10 border-slate-300">
              <i className="fa-solid fa-file-arrow-down mr-2 text-slate-600"></i> Export Reports
            </Button>
          </Link>
          <Link href="/dashboard/students">
            <Button className="bg-[#0F2942] hover:bg-[#1a3d63] text-white text-xs font-semibold h-10 shadow-sm">
              <i className="fa-solid fa-user-plus mr-2"></i> Register Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Corporate KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Enrolled Students</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <i className="fa-solid fa-user-graduate text-sm"></i>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,248</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <i className="fa-solid fa-arrow-trend-up"></i>
              <span>+12.4% vs previous term</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Faculty & Staff</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <i className="fa-solid fa-chalkboard-user text-sm"></i>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">64</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
              <i className="fa-solid fa-circle-check text-emerald-500"></i>
              <span>100% attendance verified today</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Streams & Classes</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
              <i className="fa-solid fa-building-columns text-sm"></i>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">24</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
              <span>Primary & Secondary levels</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Term Fee Collection Rate</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <i className="fa-solid fa-wallet text-sm"></i>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">89.4%</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <i className="fa-solid fa-arrow-trend-up"></i>
              <span>+4.2% collected this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Operational & Navigation Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Column: Security & Tenant Context */}
        <Card className="border-slate-200 shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Session & Tenant Governance</CardTitle>
            <CardDescription className="text-xs">Active cryptographically secured session context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-medium text-slate-500">Account Email</span>
              <span className="font-semibold text-slate-800">{user?.email || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-medium text-slate-500">Assigned Privilege</span>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                {user?.isSuperAdmin ? "Platform Super Admin" : "Institutional Admin"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-medium text-slate-500">Tenant Schema ID</span>
              <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">{user?.tenantId || "global_tenant_01"}</span>
            </div>
            <div className="flex items-center justify-between pb-1">
              <span className="font-medium text-slate-500">System Status</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> Fully Operational
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Center/Right Column: Comprehensive Sidebar Quick Actions Hub */}
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Sidebar Quick Actions & Modules</CardTitle>
            <CardDescription className="text-xs">Direct access shortcuts mapped directly to institutional navigation</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Students & Admissions */}
            <Link href="/dashboard/students" className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-user-graduate text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">Students Directory</h4>
                  <p className="text-[11px] text-slate-500">Admissions & profiles</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-blue-600"></i>
            </Link>

            {/* Finance & Invoicing */}
            <Link href="/dashboard/finance" className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-file-invoice-dollar text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">Finance & M-Pesa</h4>
                  <p className="text-[11px] text-slate-500">Invoicing & fee collection</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-blue-600"></i>
            </Link>

            {/* Examinations */}
            <Link href="/dashboard/exams" className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-pen-to-square text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">Examinations & Grading</h4>
                  <p className="text-[11px] text-slate-500">Marks entry & report cards</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-blue-600"></i>
            </Link>

            {/* Users & RBAC */}
            <Link href="/dashboard/users" className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-users-gear text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">User Management</h4>
                  <p className="text-[11px] text-slate-500">Staff roles & permissions</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-blue-600"></i>
            </Link>

            {/* Security Policies */}
            <Link href="/dashboard/users/security" className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-shield-halved text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">Security & Passwords</h4>
                  <p className="text-[11px] text-slate-500">2FA & password rules</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-blue-600"></i>
            </Link>

            {/* Audit Logs */}
            <Link href="/dashboard/users/audit-logs" className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-file-shield text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">Audit Logs</h4>
                  <p className="text-[11px] text-slate-500">Compliance & activity trail</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-blue-600"></i>
            </Link>

            {/* API Tokens */}
            <Link href="/dashboard/users/api-keys" className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-key text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">API Tokens & Webhooks</h4>
                  <p className="text-[11px] text-slate-500">Integrations & gateway keys</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-blue-600"></i>
            </Link>

            {/* Hostel Management */}
            <Link href="/dashboard/hostel" className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-bed text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">Hostel & Accommodation</h4>
                  <p className="text-[11px] text-slate-500">Bed allocations & dorms</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-blue-600"></i>
            </Link>

            {/* Library System */}
            <Link href="/dashboard/library" className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-book-open text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">Library Management</h4>
                  <p className="text-[11px] text-slate-500">Book loans & cataloging</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-blue-600"></i>
            </Link>

            {/* Communication Hub */}
            <Link href="/dashboard/communication" className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-bullhorn text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">Communication & SMS</h4>
                  <p className="text-[11px] text-slate-500">Broadcasts & parent alerts</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-blue-600"></i>
            </Link>

            {/* Reports & Analytics */}
            <Link href="/dashboard/reports" className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-chart-pie text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">Reports & Analytics</h4>
                  <p className="text-[11px] text-slate-500">Statistical dashboards</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-blue-600"></i>
            </Link>

            {/* Institution Settings */}
            <Link href="/dashboard/settings" className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-sliders text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">Institution Settings</h4>
                  <p className="text-[11px] text-slate-500">Terms, branding & metadata</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-blue-600"></i>
            </Link>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}