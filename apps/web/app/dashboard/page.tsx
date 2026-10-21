// apps/web/app/dashboard/page.tsx
'use client';

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isSuperAdmin: boolean;
  tenantId?: string;
  institutionName?: string;
}

interface WeeklyPoint {
  day: string;
  date?: string;
  primaryValue: number;
  secondaryValue: number;
}

interface MonthlyBar {
  label: string;
  value: number;
}

interface ClassOption {
  id: string;
  name: string;
}

interface StreamOption {
  id: string;
  name: string;
  classId: string;
}

interface DashboardMetrics {
  totalStudents: number;
  filteredStudents: number;
  maleStudents: number;
  femaleStudents: number;
  totalTeachers: number;
  totalDepartments: number;
  totalParents: number;
  totalFamilies: number;
  totalExams: number;
  totalSubjects: number;
  totalLessonPlans: number;
  totalExamReports: number;
  totalEarnings: number;
  weeklyTrend: WeeklyPoint[];
  monthlyBreakdown: MonthlyBar[];
  classes: ClassOption[];
  streams: StreamOption[];
  tenant?: {
    id: string;
    name: string;
    type: string;
    status: string;
  } | null;
}

export default function DashboardOverviewPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // --- Filter States (Default set to 'this_month' -> Monthly view showing Weeks) ---
  const [timeFilter, setTimeFilter] = useState<string>('this_month');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // --- Interactive Chart States ---
  const [activeTrendDay, setActiveTrendDay] = useState<number | null>(null);
  const [activeMonthBar, setActiveMonthBar] = useState<number | null>(null);
  const [activeDonutSlice, setActiveDonutSlice] = useState<'female' | 'male' | null>(null);

  const fetchLiveDashboardData = useCallback(async (currentUser: UserData) => {
    setIsLoadingMetrics(true);
    setApiError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const token = localStorage.getItem("elimix_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(currentUser.tenantId ? { "x-tenant-id": currentUser.tenantId } : {}),
    };

    try {
      const queryParams = new URLSearchParams({
        timeFilter,
        grade: selectedGrade,
        stream: selectedStream,
        ...(searchQuery ? { search: searchQuery } : {}),
        ...(timeFilter === 'custom' && startDate && endDate ? { startDate, endDate } : {}),
      });

      const metricsRes = await fetch(`${apiUrl}/dashboard/metrics?${queryParams.toString()}`, {
        method: "GET",
        headers,
      });

      if (metricsRes.ok) {
        const json = await metricsRes.json();
        if (json.success && json.data) {
          setMetrics(json.data);
          setIsLoadingMetrics(false);
          return;
        }
      }

      setApiError("Failed to synchronize with database metrics.");
    } catch (error: any) {
      console.error("Error fetching live dashboard metrics:", error);
      setApiError("Unable to reach the backend server.");
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [timeFilter, selectedGrade, selectedStream, startDate, endDate, searchQuery]);

  useEffect(() => {
    const storedUser = localStorage.getItem("elimix_user");
    if (storedUser) {
      try {
        const parsedUser: UserData = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchLiveDashboardData(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        setIsLoadingMetrics(false);
      }
    } else {
      setIsLoadingMetrics(false);
    }
  }, [fetchLiveDashboardData]);

  // --- Cascading Streams based on Selected Class ---
  const availableStreams = useMemo(() => {
    if (!metrics?.streams) return [];
    if (selectedGrade === 'all') return metrics.streams;
    return metrics.streams.filter((s) => s.classId === selectedGrade);
  }, [metrics?.streams, selectedGrade]);

  useEffect(() => {
    if (selectedGrade !== 'all' && selectedStream !== 'all') {
      const exists = availableStreams.some((s) => s.id === selectedStream);
      if (!exists) setSelectedStream('all');
    }
  }, [selectedGrade, availableStreams, selectedStream]);

  // --- Dynamic X-Axis Granularity Subtitle ---
  const xAxisGranularityLabel = useMemo(() => {
    switch (timeFilter) {
      case 'this_month':
      case 'last_month':
        return 'Weekly Breakdown (Weeks of the Month)';
      case 'this_week':
      case 'last_week':
        return 'Daily Breakdown (Mon – Sun)';
      case 'this_year':
      case 'last_year':
      case 'all_time':
        return 'Monthly Breakdown (Jan – Dec)';
      case 'this_term':
      case 'last_term':
        return 'Termly Breakdown (Months in Term)';
      case 'today':
      case 'yesterday':
        return 'Hourly Breakdown (4-Hour Intervals)';
      default:
        return 'Custom Period Breakdown';
    }
  }, [timeFilter]);

  // --- Dynamic Donut Chart Calculations ---
  const donutStats = useMemo(() => {
    const male = metrics?.maleStudents || 0;
    const female = metrics?.femaleStudents || 0;
    const total = metrics?.filteredStudents || metrics?.totalStudents || 0;
    const circumference = 2 * Math.PI * 34;

    if (total === 0) {
      return {
        male,
        female,
        total: 0,
        maleDash: `0 ${circumference}`,
        femaleDash: `0 ${circumference}`,
        maleOffset: 0,
      };
    }

    const femaleRatio = female / total;
    const maleRatio = male / total;
    const femaleLength = femaleRatio * circumference;
    const maleLength = maleRatio * circumference;

    return {
      male,
      female,
      total,
      femaleDash: `${femaleLength.toFixed(2)} ${(circumference - femaleLength).toFixed(2)}`,
      maleDash: `${maleLength.toFixed(2)} ${(circumference - maleLength).toFixed(2)}`,
      maleOffset: -femaleLength,
    };
  }, [metrics]);

  // --- DUAL-AXIS ELIMIX BRAND CHART SCALING ENGINE ---
  const trendChart = useMemo(() => {
    const series = metrics?.weeklyTrend || [];
    
    const maxPrimary = Math.max(...series.map((d) => d.primaryValue), 10) * 1.25;

    const secValues = series.map((d) => d.secondaryValue);
    const minSec = secValues.length > 0 ? Math.min(...secValues) : 0;
    const maxSec = secValues.length > 0 ? Math.max(...secValues) : 100;
    
    const secRange = maxSec === minSec ? Math.max(maxSec * 0.2, 100) : (maxSec - minSec) * 1.5;
    const secBaseline = Math.max(0, minSec - secRange * 0.2);

    const buildPrimaryPath = () => {
      if (series.length === 0) return "M0,180 L500,180 Z";
      const points = series.map((item, idx) => {
        const x = (idx / Math.max(series.length - 1, 1)) * 500;
        const y = 180 - (item.primaryValue / maxPrimary) * 150;
        return { x, y };
      });

      let path = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cpX = (p0.x + p1.x) / 2;
        path += ` C ${cpX.toFixed(1)},${p0.y.toFixed(1)} ${cpX.toFixed(1)},${p1.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
      }
      return `${path} L 500,190 L 0,190 Z`;
    };

    const buildSecondaryLine = () => {
      if (series.length === 0) {
        return { linePath: "M0,100 L500,100", areaPath: "M0,100 L500,100 L500,190 L0,190 Z" };
      }
      const points = series.map((item, idx) => {
        const x = (idx / Math.max(series.length - 1, 1)) * 500;
        const normalizedVal = (item.secondaryValue - secBaseline) / secRange;
        const y = 170 - Math.min(Math.max(normalizedVal, 0.05), 0.95) * 130;
        return { x, y };
      });

      let path = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cpX = (p0.x + p1.x) / 2;
        path += ` C ${cpX.toFixed(1)},${p0.y.toFixed(1)} ${cpX.toFixed(1)},${p1.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
      }
      return { linePath: path, areaPath: `${path} L 500,190 L 0,190 Z` };
    };

    const yAxisLabels = [
      Math.round(maxPrimary * 0.8),
      Math.round(maxPrimary * 0.6),
      Math.round(maxPrimary * 0.4),
      Math.round(maxPrimary * 0.2),
      0,
    ];

    const secPaths = buildSecondaryLine();

    return {
      series,
      primaryPath: buildPrimaryPath(),
      secondaryLinePath: secPaths.linePath,
      secondaryAreaPath: secPaths.areaPath,
      yAxisLabels,
    };
  }, [metrics]);

  const barChart = useMemo(() => {
    const bars = metrics?.monthlyBreakdown || [];
    const maxBarVal = Math.max(...bars.map((b) => b.value), 10);
    return { bars, maxBarVal };
  }, [metrics]);

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* 1. Header Section */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            {metrics?.tenant?.name ? `${metrics.tenant.name} — Executive Dashboard` : 'Elimix Admin Dashboard'}
          </h2>
          <div className="flex items-center text-[12px] text-[#64748b]">
            <span className="hover:text-[#0ea5e9] cursor-pointer transition-colors font-medium">Home</span>
            <i className="fa-solid fa-chevron-right text-[9px] mx-2 text-[#cbd5e1]"></i>
            <span className="text-[#0ea5e9] font-semibold">Executive Overview</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => user && fetchLiveDashboardData(user)}
            className="h-[38px] px-4 rounded-xl bg-white border border-[#cbd5e1] text-[#042954] text-[12px] font-semibold hover:bg-slate-50 transition-all shadow-sm flex items-center"
          >
            <i className={`fa-solid fa-rotate mr-2 ${isLoadingMetrics ? 'animate-spin text-[#0ea5e9]' : 'text-[#64748b]'}`}></i>
            Refresh Data
          </button>
          <Link href="/dashboard/students/admissions" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center">
              <i className="fa-solid fa-user-plus mr-2"></i> Register Student
            </button>
          </Link>
        </div>
      </div>

      {apiError && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex items-center justify-between shadow-sm">
          <span className="flex items-center"><i className="fa-solid fa-circle-info mr-2 text-amber-600 text-sm"></i>{apiError}</span>
          <button onClick={() => user && fetchLiveDashboardData(user)} className="font-bold underline hover:text-amber-950">Retry</button>
        </div>
      )}

      {/* 2. Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(4,41,84,0.06)] border border-[#e2e8f0] mb-6 w-full flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full 2xl:w-auto">
          <div className="relative w-full sm:w-[220px]">
            <i className="fa-regular fa-calendar-days absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0ea5e9] text-[13px]"></i>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full h-[40px] pl-10 pr-8 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer transition-all"
            >
              <optgroup label="Recent Periods">
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_week">This Week</option>
                <option value="last_week">Last Week</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
              </optgroup>
              <optgroup label="Academic Terms & Years">
                <option value="this_term">This Term</option>
                <option value="last_term">Last Term</option>
                <option value="this_year">This Year</option>
                <option value="last_year">Last Year</option>
              </optgroup>
              <optgroup label="General & Custom">
                <option value="all_time">All Time</option>
                <option value="custom">Custom Date Range...</option>
              </optgroup>
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[10px] pointer-events-none"></i>
          </div>

          {timeFilter === 'custom' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-[40px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-white focus:outline-none focus:border-[#0ea5e9]"
              />
              <span className="text-[#64748b] text-[12px] font-bold">To</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-[40px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-white focus:outline-none focus:border-[#0ea5e9]"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full 2xl:w-auto">
          <div className="relative w-full sm:w-[200px]">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
            <input
              type="text"
              placeholder="Search student/ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-white focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
            <i className="fa-solid fa-graduation-cap absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
            <select 
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full sm:w-[170px] h-[40px] pl-9 pr-8 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] focus:outline-none focus:border-[#0ea5e9] bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Classes ({metrics?.classes?.length || 0})</option>
              {metrics?.classes?.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[10px] pointer-events-none"></i>
          </div>

          <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
            <i className="fa-solid fa-layer-group absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
            <select 
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full sm:w-[160px] h-[40px] pl-9 pr-8 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] focus:outline-none focus:border-[#0ea5e9] bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Streams ({availableStreams.length})</option>
              {availableStreams.map((stream) => (
                <option key={stream.id} value={stream.id}>{stream.name}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[10px] pointer-events-none"></i>
          </div>
        </div>
      </div>

      {/* 3. Live KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 w-full">
          <div className="h-[56px] w-[56px] rounded-2xl bg-sky-50 flex items-center justify-center text-[#0ea5e9] shrink-0">
            <i className="fa-solid fa-user-group text-[22px]"></i>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-semibold text-[#64748b] mb-1">Students</p>
            {isLoadingMetrics ? (
              <div className="h-7 w-24 bg-[#f1f5f9] rounded animate-pulse ml-auto"></div>
            ) : (
              <h3 className="text-[24px] font-extrabold text-[#042954]">{(metrics?.filteredStudents ?? 0).toLocaleString()}</h3>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 w-full">
          <div className="h-[56px] w-[56px] rounded-2xl bg-sky-50 flex items-center justify-center text-[#042954] shrink-0">
            <i className="fa-solid fa-users text-[22px]"></i>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-semibold text-[#64748b] mb-1">Teachers</p>
            {isLoadingMetrics ? (
              <div className="h-7 w-20 bg-[#f1f5f9] rounded animate-pulse ml-auto"></div>
            ) : (
              <h3 className="text-[24px] font-extrabold text-[#042954]">{(metrics?.totalTeachers ?? 0).toLocaleString()}</h3>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 w-full">
          <div className="h-[56px] w-[56px] rounded-2xl bg-teal-50 flex items-center justify-center text-[#06b6d4] shrink-0">
            <i className="fa-regular fa-user text-[22px]"></i>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-semibold text-[#64748b] mb-1">Parents / Families</p>
            {isLoadingMetrics ? (
              <div className="h-7 w-20 bg-[#f1f5f9] rounded animate-pulse ml-auto"></div>
            ) : (
              <h3 className="text-[24px] font-extrabold text-[#042954]">{(metrics?.totalParents ?? 0).toLocaleString()}</h3>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 w-full">
          <div className="h-[56px] w-[56px] rounded-2xl bg-indigo-50 flex items-center justify-center text-[#042954] shrink-0">
            <i className="fa-solid fa-pen-to-square text-[22px]"></i>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-semibold text-[#64748b] mb-1">Active Exams</p>
            {isLoadingMetrics ? (
              <div className="h-7 w-20 bg-[#f1f5f9] rounded animate-pulse ml-auto"></div>
            ) : (
              <h3 className="text-[24px] font-extrabold text-[#042954]">{(metrics?.totalExams ?? 0).toLocaleString()}</h3>
            )}
          </div>
        </div>
      </div>

      {/* 4. Dynamic Executive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mb-6">
        
        {/* DUAL-AXIS AREA CHART */}
        <div className="bg-white rounded-2xl lg:col-span-6 p-6 shadow-sm border border-[#e2e8f0] flex flex-col h-[440px] w-full">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[16px] font-bold text-[#042954]">Enrollment & Workspace Activity</h3>
              <p className="text-[11px] text-[#64748b] mt-0.5">{xAxisGranularityLabel}</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-[#0ea5e9] px-3 py-1 rounded-full border border-sky-100">
              {timeFilter.replace('_', ' ')}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pt-3 border-t border-[#f1f5f9]">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64748b] mb-0.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#042954]"></div> Cumulative Active
                </div>
                <span className="text-[18px] font-extrabold text-[#042954]">
                  {(metrics?.totalStudents ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64748b] mb-0.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#0ea5e9]"></div> Period Admissions
                </div>
                <span className="text-[18px] font-extrabold text-[#042954]">
                  {(metrics?.filteredStudents ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="relative w-full flex-1 ml-6 sm:ml-[34px] mb-5 border-b border-l border-[#e2e8f0]">
            <div className="absolute left-[-36px] top-0 h-full flex flex-col justify-between text-[10px] font-medium text-[#94a3b8] py-1 z-20 pointer-events-none">
              {trendChart.yAxisLabels.map((val, i) => (
                <span key={i}>{val.toLocaleString()}</span>
              ))}
            </div>

            <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full absolute bottom-0 left-0 z-10 pointer-events-none">
              <defs>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#042954" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#042954" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="admissionsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.40" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={trendChart.secondaryAreaPath} fill="url(#activeGrad)" className="transition-all duration-500" />
              <path d={trendChart.secondaryLinePath} fill="none" stroke="#042954" strokeWidth="2" strokeDasharray="4 4" className="transition-all duration-500" />
              <path d={trendChart.primaryPath} fill="url(#admissionsGrad)" className="transition-all duration-500" />
            </svg>

            <div className="absolute inset-0 z-30 flex" onMouseLeave={() => setActiveTrendDay(null)}>
              {trendChart.series.map((data, index) => (
                <div 
                  key={index}
                  className="flex-1 h-full relative cursor-pointer group"
                  onMouseEnter={() => setActiveTrendDay(index)}
                >
                  {activeTrendDay === index && (
                    <>
                      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#0ea5e9]/50 border-dashed border-l border-[#0ea5e9] z-30 pointer-events-none"></div>
                      <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 bg-[#042954] text-white p-3 rounded-xl shadow-2xl z-50 w-[165px] pointer-events-none border border-slate-700 backdrop-blur-md">
                        <p className="text-[10px] text-slate-300 font-bold uppercase mb-1.5 border-b border-slate-700 pb-1 flex justify-between gap-2">
                          <span>{data.day}</span>
                          <span className="text-[#0ea5e9] truncate">{data.date}</span>
                        </p>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] text-slate-300 font-medium">Total Active:</span>
                          <span className="text-[11px] font-bold">{data.secondaryValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-[#06b6d4] font-medium">Admissions:</span>
                          <span className="text-[11px] font-bold">{data.primaryValue.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  )}
                  <div
                    className={`absolute -bottom-6 w-full text-center transition-all truncate px-0.5 ${
                      trendChart.series.length > 8 ? 'text-[9px] sm:text-[10px]' : 'text-[11px]'
                    } ${activeTrendDay === index ? 'text-[#042954] font-bold scale-105' : 'text-[#64748b]'}`}
                  >
                    {data.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BAR CHART: Monthly Admissions */}
        <div className="bg-white rounded-2xl lg:col-span-3 p-6 shadow-sm border border-[#e2e8f0] flex flex-col h-[440px] w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#042954]">Monthly Admissions</h3>
          </div>
          
          <div className="flex justify-between gap-2 mb-6 relative z-30 w-full">
            {barChart.bars.map((bar, idx) => {
              const borderColors = ['border-[#06b6d4]', 'border-[#0ea5e9]', 'border-[#042954]'];
              return (
                <div key={idx} className="flex flex-col flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-[#64748b] mb-1 truncate">{bar.label}</span>
                  <span className={`text-[12px] font-extrabold text-[#042954] border-b-[3px] ${borderColors[idx % 3]} pb-1`}>
                    {bar.value}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-end justify-around px-2 mt-auto flex-1 border-b border-l border-[#e2e8f0] relative w-full" onMouseLeave={() => setActiveMonthBar(null)}>
            {barChart.bars.map((bar, idx) => {
              const bgGradients = ['bg-gradient-to-t from-[#06b6d4] to-[#22d3ee]', 'bg-gradient-to-t from-[#0ea5e9] to-[#38bdf8]', 'bg-gradient-to-t from-[#042954] to-[#1e3a8a]'];
              const heightPct = Math.max((bar.value / barChart.maxBarVal) * 85, 8);
              return (
                <div
                  key={idx}
                  style={{ height: `${heightPct}%` }}
                  className={`relative w-10 ${bgGradients[idx % 3]} z-30 transition-all duration-300 cursor-pointer rounded-t-lg shadow-sm ${
                    activeMonthBar !== null && activeMonthBar !== idx ? 'opacity-30 scale-95' : 'opacity-100 hover:scale-105'
                  }`}
                  onMouseEnter={() => setActiveMonthBar(idx)}
                >
                  {activeMonthBar === idx && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#042954] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50 border border-slate-700">
                      {bar.label}: {bar.value}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* DONUT CHART: Gender Distribution */}
        <div className="bg-white rounded-2xl lg:col-span-3 p-6 shadow-sm border border-[#e2e8f0] flex flex-col h-[440px] items-center w-full">
          <div className="flex items-center justify-between w-full mb-4">
            <h3 className="text-[16px] font-bold text-[#042954]">Students by Gender</h3>
          </div>
          
          <div className="flex-1 flex items-center justify-center w-full my-2 relative">
            <svg width="190" height="190" viewBox="0 0 100 100" className="rotate-[-90deg] overflow-visible shrink-0" onMouseLeave={() => setActiveDonutSlice(null)}>
              <circle cx="50" cy="50" r="34" fill="none" stroke="#f1f5f9" strokeWidth="22" />

              {donutStats.total > 0 && (
                <>
                  <circle 
                    cx="50" cy="50" r="34" 
                    fill="none" 
                    stroke="#06b6d4" 
                    strokeWidth={activeDonutSlice === 'male' ? "26" : "22"}
                    strokeDasharray={donutStats.maleDash}
                    strokeDashoffset={donutStats.maleOffset}
                    strokeLinecap="round"
                    className={`transition-all duration-300 cursor-pointer ${activeDonutSlice === 'female' ? 'opacity-30' : 'opacity-100'}`}
                    onMouseEnter={() => setActiveDonutSlice('male')}
                  />
                  <circle 
                    cx="50" cy="50" r="34" 
                    fill="none" 
                    stroke="#042954" 
                    strokeWidth={activeDonutSlice === 'female' ? "26" : "22"}
                    strokeDasharray={donutStats.femaleDash}
                    strokeLinecap="round"
                    className={`transition-all duration-300 cursor-pointer ${activeDonutSlice === 'male' ? 'opacity-30' : 'opacity-100'}`}
                    onMouseEnter={() => setActiveDonutSlice('female')}
                  />
                </>
              )}
            </svg>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-full h-[110px] w-[110px] flex flex-col items-center justify-center shadow-inner shrink-0 border border-slate-100">
                {activeDonutSlice === 'female' ? (
                  <div className="text-center animate-in fade-in duration-200">
                    <span className="block text-[20px] font-black text-[#042954]">{donutStats.female.toLocaleString()}</span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Female</span>
                  </div>
                ) : activeDonutSlice === 'male' ? (
                  <div className="text-center animate-in fade-in duration-200">
                    <span className="block text-[20px] font-black text-[#06b6d4]">{donutStats.male.toLocaleString()}</span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Male</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="block text-[18px] font-black text-[#042954]">{donutStats.total.toLocaleString()}</span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-full flex justify-between mt-auto pt-4 border-t border-[#f1f5f9]">
            <div 
              className="flex flex-col cursor-pointer group"
              onMouseEnter={() => setActiveDonutSlice('female')}
              onMouseLeave={() => setActiveDonutSlice(null)}
            >
              <span className="w-8 border-b-[3px] border-[#042954] mb-1.5 transition-all group-hover:w-12"></span>
              <span className="text-[11px] font-medium text-[#64748b]">Female Students</span>
              <span className="text-[14px] font-extrabold text-[#042954]">{donutStats.female.toLocaleString()}</span>
            </div>
            <div 
              className="flex flex-col text-right items-end cursor-pointer group"
              onMouseEnter={() => setActiveDonutSlice('male')}
              onMouseLeave={() => setActiveDonutSlice(null)}
            >
              <span className="w-8 border-b-[3px] border-[#06b6d4] mb-1.5 transition-all group-hover:w-12"></span>
              <span className="text-[11px] font-medium text-[#64748b]">Male Students</span>
              <span className="text-[14px] font-extrabold text-[#042954]">{donutStats.male.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Comprehensive Sidebar-Driven Quick Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-6">
        
        {/* People & Students Hub */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e8f0] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-bold text-[#042954] flex items-center">
                <i className="fa-solid fa-user-graduate mr-2 text-[#0ea5e9]"></i>People & Students
              </h4>
            </div>
            <ul className="space-y-2 text-[12px]">
              <li><Link href="/dashboard/students/admissions" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Admissions & Enrollment <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/students/attendance" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Daily Attendance <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/parents" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1">Parent Portal <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
            </ul>
          </div>
        </div>

        {/* Academics Hub */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e8f0] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-bold text-[#042954] flex items-center">
                <i className="fa-solid fa-chalkboard-user mr-2 text-[#042954]"></i>Academics & Exams
              </h4>
            </div>
            <ul className="space-y-2 text-[12px]">
              <li><Link href="/dashboard/academics/timetables" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Timetables & Lessons <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/exams/results" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Marks Entry & Results <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/e-learning/courses" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1">E-Learning Courses <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
            </ul>
          </div>
        </div>

        {/* Finance & Fees Hub */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e8f0] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-bold text-[#042954] flex items-center">
                <i className="fa-solid fa-wallet mr-2 text-[#06b6d4]"></i>Finance & Fees
              </h4>
            </div>
            <ul className="space-y-2 text-[12px]">
              <li><Link href="/dashboard/finance/invoices" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Invoices & Billing <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/finance/payments" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Payments & Receipts <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/finance/reconciliation" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1">Bank Reconciliation <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
            </ul>
          </div>
        </div>

        {/* Operations Hub */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e8f0] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-bold text-[#042954] flex items-center">
                <i className="fa-solid fa-building-user mr-2 text-[#0ea5e9]"></i>Operations Hub
              </h4>
            </div>
            <ul className="space-y-2 text-[12px]">
              <li><Link href="/dashboard/hr" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Human Resources (HR) <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/hostel" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Hostel & Boarding <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/transport/routes" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1">Transport & Vehicles <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
            </ul>
          </div>
        </div>

        {/* Reports & Analytics Hub */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e8f0] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-bold text-[#042954] flex items-center">
                <i className="fa-solid fa-chart-line mr-2 text-[#042954]"></i>Reports & Analytics
              </h4>
            </div>
            <ul className="space-y-2 text-[12px]">
              <li><Link href="/dashboard/reports/academics/exams" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Exam Performance <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/reports/finance/collections" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Fee Collections <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/reports/custom/builder" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1">Custom Report Builder <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
            </ul>
          </div>
        </div>

        {/* Security & Access Hub */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e8f0] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-bold text-[#042954] flex items-center">
                <i className="fa-solid fa-user-shield mr-2 text-[#06b6d4]"></i>Security & Access
              </h4>
            </div>
            <ul className="space-y-2 text-[12px]">
              <li><Link href="/dashboard/users/roles" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Roles & Permissions <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/users/security" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Authentication & Security <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/users/audit-logs" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1">Audit Logs & Activity <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
            </ul>
          </div>
        </div>

        {/* System & Support Hub */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e8f0] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-bold text-[#042954] flex items-center">
                <i className="fa-solid fa-life-ring mr-2 text-[#0ea5e9]"></i>System & Support
              </h4>
            </div>
            <ul className="space-y-2 text-[12px]">
              <li><Link href="/dashboard/support" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Knowledge Base <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/support/tickets" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Support Tickets <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/settings" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1">System Settings <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
            </ul>
          </div>
        </div>

        {/* Library & Stock Hub */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e8f0] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-bold text-[#042954] flex items-center">
                <i className="fa-solid fa-book-open mr-2 text-[#042954]"></i>Library & Procurement
              </h4>
            </div>
            <ul className="space-y-2 text-[12px]">
              <li><Link href="/dashboard/library/books" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Book Catalog <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/procurement/inventory" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1 border-b border-slate-100">Inventory & Stock <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
              <li><Link href="/dashboard/procurement/orders" className="text-slate-600 hover:text-[#0ea5e9] flex items-center justify-between py-1">Purchase Orders <i className="fa-solid fa-chevron-right text-[9px] text-slate-300"></i></Link></li>
            </ul>
          </div>
        </div>

      </div>

      {/* 6. Bottom Session Governance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        <div className="bg-white rounded-2xl lg:col-span-12 p-6 shadow-sm border border-[#e2e8f0] w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-[#0ea5e9]">
              <i className="fa-solid fa-shield-halved text-lg"></i>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#042954]">Session Governance & User State</p>
              <p className="text-[11px] text-[#64748b]">Connected as <span className="font-semibold text-[#042954]">{user?.email || "Administrator"}</span> ({user?.isSuperAdmin ? "Platform Super Admin" : "Institution Admin"}) • Tenant: <span className="font-mono">{user?.tenantId || "Unassigned"}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/users/audit-logs">
              <button className="h-[36px] px-4 rounded-xl bg-slate-100 text-[#042954] text-[12px] font-semibold hover:bg-slate-200 transition-colors">
                View Audit Logs
              </button>
            </Link>
            <Link href="/dashboard/settings">
              <button className="h-[36px] px-4 rounded-xl bg-[#042954] text-white text-[12px] font-semibold hover:bg-[#0a386e] transition-colors shadow-sm">
                System Settings
              </button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}