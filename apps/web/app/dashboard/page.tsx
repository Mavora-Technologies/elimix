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

  // --- Filter States ---
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

  // Reset stream selection if selected stream doesn't belong to the new class
  useEffect(() => {
    if (selectedGrade !== 'all' && selectedStream !== 'all') {
      const exists = availableStreams.some((s) => s.id === selectedStream);
      if (!exists) setSelectedStream('all');
    }
  }, [selectedGrade, availableStreams, selectedStream]);

  // --- Dynamic Donut Chart Calculations ---
  const donutStats = useMemo(() => {
    const male = metrics?.maleStudents || 0;
    const female = metrics?.femaleStudents || 0;
    const total = metrics?.filteredStudents || metrics?.totalStudents || 0;
    const circumference = 2 * Math.PI * 30;

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

  // --- Dynamic SVG Area Path Generator ---
  const trendChart = useMemo(() => {
    const series = metrics?.weeklyTrend || [];
    const maxVal = Math.max(
      ...series.map((d) => Math.max(d.primaryValue, d.secondaryValue)),
      10
    );

    const buildAreaPath = (key: 'primaryValue' | 'secondaryValue') => {
      const points = series.map((item, idx) => {
        const x = (idx / Math.max(series.length - 1, 1)) * 500;
        const y = 200 - (item[key] / maxVal) * 170;
        return { x, y };
      });

      const lineCoords = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
      return `${lineCoords} L500,200 L0,200 Z`;
    };

    const yAxisLabels = [
      Math.round(maxVal),
      Math.round(maxVal * 0.75),
      Math.round(maxVal * 0.5),
      Math.round(maxVal * 0.25),
      0,
    ];

    return {
      series,
      primaryPath: buildAreaPath('primaryValue'),
      secondaryPath: buildAreaPath('secondaryValue'),
      yAxisLabels,
    };
  }, [metrics]);

  const barChart = useMemo(() => {
    const bars = metrics?.monthlyBreakdown || [];
    const maxBarVal = Math.max(...bars.map((b) => b.value), 10);
    return { bars, maxBarVal };
  }, [metrics]);

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f0f1f3] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#111]">
      
      {/* 1. Header Section */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-semibold text-[#111] mb-1.5 tracking-wide">
            {metrics?.tenant?.name ? `${metrics.tenant.name} — Dashboard` : 'Admin Dashboard'}
          </h2>
          <div className="flex items-center text-[12px] text-[#a0aab8]">
            <span className="hover:text-[#ff9d01] cursor-pointer transition-colors">Home</span>
            <i className="fa-solid fa-chevron-right text-[9px] mx-3"></i>
            <span className="text-[#ff9d01]">Executive Overview</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => user && fetchLiveDashboardData(user)}
            className="h-[36px] px-4 rounded-[4px] bg-white border border-[#e0e0e0] text-[#111] text-[12px] font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <i className={`fa-solid fa-rotate mr-2 ${isLoadingMetrics ? 'animate-spin text-[#3282ff]' : 'text-[#a0aab8]'}`}></i>
            Refresh Data
          </button>
          <Link href="/dashboard/students" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto h-[36px] px-4 rounded-[4px] bg-[#042954] text-white text-[12px] font-medium hover:bg-[#0a386e] transition-colors shadow-sm">
              <i className="fa-solid fa-user-plus mr-2"></i> Register Student
            </button>
          </Link>
        </div>
      </div>

      {apiError && (
        <div className="mb-6 rounded-[4px] border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-center justify-between">
          <span><i className="fa-solid fa-circle-info mr-2"></i>{apiError}</span>
          <button onClick={() => user && fetchLiveDashboardData(user)} className="font-bold underline">Retry</button>
        </div>
      )}

      {/* 2. Advanced Corporate Filter Bar */}
      <div className="bg-white rounded-[4px] p-4 sm:p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] mb-6 w-full flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 transition-all duration-300">
        
        {/* Professional Time Period Dropdown */}
        <div className="flex flex-wrap items-center gap-3 w-full 2xl:w-auto">
          <div className="relative w-full sm:w-[220px]">
            <i className="fa-regular fa-calendar-days absolute left-3 top-1/2 -translate-y-1/2 text-[#3282ff] text-[13px]"></i>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full h-[38px] pl-9 pr-8 rounded-[4px] border border-[#d1d5db] text-[12px] font-bold text-[#111] bg-[#f8fafc] focus:outline-none focus:border-[#3282ff] focus:bg-white appearance-none cursor-pointer transition-colors"
            >
              <optgroup label="Preset Periods">
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this_week">This Week</option>
                <option value="last_week">Last Week</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_term">This Term</option>
                <option value="last_term">Last Term</option>
                <option value="this_year">This Year</option>
                <option value="last_year">Last Year</option>
              </optgroup>
              <optgroup label="Advanced">
                <option value="custom">Custom Date Range...</option>
              </optgroup>
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[10px] pointer-events-none"></i>
          </div>

          {timeFilter === 'custom' && (
            <div className="flex items-center gap-2 w-full sm:w-auto animate-in fade-in slide-in-from-right-4 duration-300">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-[38px] px-3 rounded-[4px] border border-[#d1d5db] text-[12px] font-medium text-[#111] bg-white"
              />
              <span className="text-[#a0aab8] text-[12px] font-bold">To</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-[38px] px-3 rounded-[4px] border border-[#d1d5db] text-[12px] font-medium text-[#111] bg-white"
              />
            </div>
          )}
        </div>

        {/* Global Search & Cascading Class/Stream Selectors */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full 2xl:w-auto">
          <div className="relative w-full sm:w-[200px]">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[12px]"></i>
            <input
              type="text"
              placeholder="Search student/ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[38px] pl-8 pr-3 rounded-[4px] border border-[#d1d5db] text-[12px] font-medium text-[#111] bg-white focus:outline-none focus:border-[#3282ff]"
            />
          </div>

          {/* Dynamic Class Selector */}
          <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
            <i className="fa-solid fa-graduation-cap absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[12px]"></i>
            <select 
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full sm:w-[170px] h-[38px] pl-8 pr-8 rounded-[4px] border border-[#d1d5db] text-[12px] font-medium text-[#111] focus:outline-none focus:border-[#3282ff] bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Classes ({metrics?.classes?.length || 0})</option>
              {metrics?.classes?.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[10px] pointer-events-none"></i>
          </div>

          {/* Cascading Stream Selector */}
          <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
            <i className="fa-solid fa-layer-group absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[12px]"></i>
            <select 
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full sm:w-[160px] h-[38px] pl-8 pr-8 rounded-[4px] border border-[#d1d5db] text-[12px] font-medium text-[#111] focus:outline-none focus:border-[#3282ff] bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Streams ({availableStreams.length})</option>
              {availableStreams.map((stream) => (
                <option key={stream.id} value={stream.id}>{stream.name}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[10px] pointer-events-none"></i>
          </div>
        </div>
      </div>

      {/* 3. Live KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <div className="bg-white rounded-[4px] p-5 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-transform duration-300 w-full">
          <div className="h-[65px] w-[65px] rounded-full bg-[#e1f6eb] flex items-center justify-center text-[#33d47a] shrink-0">
            <i className="fa-solid fa-user-group text-[26px]"></i>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-medium text-[#a0aab8] mb-1">Students</p>
            {isLoadingMetrics ? (
              <div className="h-6 w-20 bg-[#f0f1f3] rounded animate-pulse ml-auto"></div>
            ) : (
              <h3 className="text-[22px] font-bold text-[#111]">{(metrics?.filteredStudents ?? 0).toLocaleString()}</h3>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[4px] p-5 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-transform duration-300 w-full">
          <div className="h-[65px] w-[65px] rounded-full bg-[#e4f1ff] flex items-center justify-center text-[#3282ff] shrink-0">
            <i className="fa-solid fa-users text-[26px]"></i>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-medium text-[#a0aab8] mb-1">Teachers</p>
            {isLoadingMetrics ? (
              <div className="h-6 w-20 bg-[#f0f1f3] rounded animate-pulse ml-auto"></div>
            ) : (
              <h3 className="text-[22px] font-bold text-[#111]">{(metrics?.totalTeachers ?? 0).toLocaleString()}</h3>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[4px] p-5 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-transform duration-300 w-full">
          <div className="h-[65px] w-[65px] rounded-full bg-[#fff2e0] flex items-center justify-center text-[#ffa305] shrink-0">
            <i className="fa-regular fa-user text-[26px]"></i>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-medium text-[#a0aab8] mb-1">Parents / Families</p>
            {isLoadingMetrics ? (
              <div className="h-6 w-20 bg-[#f0f1f3] rounded animate-pulse ml-auto"></div>
            ) : (
              <h3 className="text-[22px] font-bold text-[#111]">{(metrics?.totalParents ?? 0).toLocaleString()}</h3>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[4px] p-5 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-transform duration-300 w-full">
          <div className="h-[65px] w-[65px] rounded-full bg-[#ffeaea] flex items-center justify-center text-[#ff0000] shrink-0">
            <i className="fa-solid fa-pen-to-square text-[26px]"></i>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-medium text-[#a0aab8] mb-1">Active Exams</p>
            {isLoadingMetrics ? (
              <div className="h-6 w-20 bg-[#f0f1f3] rounded animate-pulse ml-auto"></div>
            ) : (
              <h3 className="text-[22px] font-bold text-[#111]">{(metrics?.totalExams ?? 0).toLocaleString()}</h3>
            )}
          </div>
        </div>
      </div>

      {/* 4. Dynamic Executive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 w-full mb-6">
        
        {/* LIVE AREA CHART: Enrollment & Activity Trend */}
        <div className="bg-white rounded-[4px] lg:col-span-6 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col h-[400px] w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-[#111]">Enrollment & Workspace Activity</h3>
            <span className="text-[11px] text-[#a0aab8] font-medium uppercase">{timeFilter.replace('_', ' ')}</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-40">
            <div className="flex flex-wrap gap-4 sm:gap-8">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[12px] text-[#a0aab8] mb-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#3282ff]"></div> Active Students
                </div>
                <span className="text-[16px] font-bold text-[#111]">
                  {(metrics?.totalStudents ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[12px] text-[#a0aab8] mb-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff0000]"></div> Period Admissions
                </div>
                <span className="text-[16px] font-bold text-[#111]">
                  {(metrics?.filteredStudents ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="relative w-full flex-1 ml-8 sm:ml-[35px] border-b border-l border-[#f0f1f3]">
            <div className="absolute left-[-35px] sm:left-[-40px] top-0 h-full flex flex-col justify-between text-[10px] sm:text-[11px] text-[#a0aab8] py-1 z-20 pointer-events-none">
              {trendChart.yAxisLabels.map((val, i) => (
                <span key={i}>{val}</span>
              ))}
            </div>

            <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full absolute bottom-0 left-0 z-10 pointer-events-none">
              <path d={trendChart.secondaryPath} fill="#3282ff" opacity="0.25" />
              <path d={trendChart.primaryPath} fill="#ff0000" opacity="0.75" />
            </svg>

            <div className="absolute inset-0 z-30 flex" onMouseLeave={() => setActiveTrendDay(null)}>
              {trendChart.series.map((data, index) => (
                <div 
                  key={index}
                  className="flex-1 h-full relative cursor-crosshair"
                  onMouseEnter={() => setActiveTrendDay(index)}
                >
                  {activeTrendDay === index && (
                    <>
                      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-400 border-dashed border-l border-slate-400 opacity-50 z-30 pointer-events-none"></div>
                      <div className="absolute bottom-[55%] left-1/2 -translate-x-1/2 bg-[#111] text-white p-3 rounded-md shadow-xl z-50 w-[140px] pointer-events-none">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-2 border-b border-gray-700 pb-1">
                          {data.day} {data.date ? `(${data.date.slice(5)})` : ''}
                        </p>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px]">Total Active</span>
                          <span className="text-[11px] font-bold">{data.secondaryValue}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px]">New Added</span>
                          <span className="text-[11px] font-bold">{data.primaryValue}</span>
                        </div>
                      </div>
                    </>
                  )}
                  <div className={`absolute -bottom-7 w-full text-center text-[10px] sm:text-[11px] ${activeTrendDay === index ? 'text-[#111] font-bold' : 'text-[#a0aab8]'}`}>
                    {data.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LIVE BAR CHART: Monthly Admissions Breakdown */}
        <div className="bg-white rounded-[4px] lg:col-span-3 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col h-[400px] w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-[#111]">Monthly Admissions</h3>
          </div>
          
          <div className="flex justify-between gap-2 mb-8 relative z-30 w-full">
            {barChart.bars.map((bar, idx) => {
              const borderColors = ['border-[#33d47a]', 'border-[#3282ff]', 'border-[#ffa305]'];
              return (
                <div key={idx} className="flex flex-col flex-1 min-w-0">
                  <span className="text-[10px] text-[#a0aab8] mb-1 truncate">{bar.label}</span>
                  <span className={`text-[12px] font-bold text-[#111] border-b-[2px] ${borderColors[idx % 3]} pb-1`}>
                    {bar.value}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-end justify-around px-4 mt-auto flex-1 border-b border-l border-[#f0f1f3] relative w-full" onMouseLeave={() => setActiveMonthBar(null)}>
            {barChart.bars.map((bar, idx) => {
              const bgColors = ['bg-[#33d47a]', 'bg-[#3282ff]', 'bg-[#ffa305]'];
              const heightPct = Math.max((bar.value / barChart.maxBarVal) * 85, 6);
              return (
                <div
                  key={idx}
                  style={{ height: `${heightPct}%` }}
                  className={`relative w-9 ${bgColors[idx % 3]} z-30 transition-all duration-300 cursor-pointer rounded-t ${
                    activeMonthBar !== null && activeMonthBar !== idx ? 'opacity-30' : 'opacity-100'
                  }`}
                  onMouseEnter={() => setActiveMonthBar(idx)}
                >
                  {activeMonthBar === idx && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#111] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                      {bar.label}: {bar.value}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* LIVE DONUT CHART: Student Gender Distribution */}
        <div className="bg-white rounded-[4px] lg:col-span-3 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col h-[400px] items-center w-full">
          <div className="flex items-center justify-between w-full mb-6">
            <h3 className="text-[16px] font-semibold text-[#111]">Students by Gender</h3>
          </div>
          
          <div className="flex-1 flex items-center justify-center w-full my-4 relative">
            <svg width="190" height="190" viewBox="0 0 100 100" className="rotate-[-90deg] overflow-visible shrink-0" onMouseLeave={() => setActiveDonutSlice(null)}>
              <circle cx="50" cy="50" r="30" fill="none" stroke="#f0f1f3" strokeWidth="30" />

              {donutStats.total > 0 && (
                <>
                  <circle 
                    cx="50" cy="50" r="30" 
                    fill="none" 
                    stroke="#ffa305" 
                    strokeWidth={activeDonutSlice === 'male' ? "35" : "30"}
                    strokeDasharray={donutStats.maleDash}
                    strokeDashoffset={donutStats.maleOffset}
                    className={`transition-all duration-300 cursor-pointer ${activeDonutSlice === 'female' ? 'opacity-30' : 'opacity-100'}`}
                    onMouseEnter={() => setActiveDonutSlice('male')}
                  />
                  <circle 
                    cx="50" cy="50" r="30" 
                    fill="none" 
                    stroke="#3282ff" 
                    strokeWidth={activeDonutSlice === 'female' ? "35" : "30"}
                    strokeDasharray={donutStats.femaleDash}
                    className={`transition-all duration-300 cursor-pointer ${activeDonutSlice === 'male' ? 'opacity-30' : 'opacity-100'}`}
                    onMouseEnter={() => setActiveDonutSlice('female')}
                  />
                </>
              )}
            </svg>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-full h-[120px] w-[120px] flex flex-col items-center justify-center shadow-inner shrink-0">
                {activeDonutSlice === 'female' ? (
                  <div className="text-center">
                    <span className="block text-[22px] font-black text-[#3282ff]">{donutStats.female.toLocaleString()}</span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Female</span>
                  </div>
                ) : activeDonutSlice === 'male' ? (
                  <div className="text-center">
                    <span className="block text-[22px] font-black text-[#ffa305]">{donutStats.male.toLocaleString()}</span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Male</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="block text-[20px] font-black text-[#111]">{donutStats.total.toLocaleString()}</span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-full flex justify-between mt-auto">
            <div 
              className="flex flex-col cursor-pointer"
              onMouseEnter={() => setActiveDonutSlice('female')}
              onMouseLeave={() => setActiveDonutSlice(null)}
            >
              <span className="w-6 border-b-[3px] border-[#3282ff] mb-2"></span>
              <span className="text-[11px] text-[#a0aab8] mb-1">Female Students</span>
              <span className="text-[14px] font-bold text-[#111]">{donutStats.female.toLocaleString()}</span>
            </div>
            <div 
              className="flex flex-col text-right items-end cursor-pointer"
              onMouseEnter={() => setActiveDonutSlice('male')}
              onMouseLeave={() => setActiveDonutSlice(null)}
            >
              <span className="w-6 border-b-[3px] border-[#ffa305] mb-2"></span>
              <span className="text-[11px] text-[#a0aab8] mb-1">Male Students</span>
              <span className="text-[14px] font-bold text-[#111]">{donutStats.male.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* Session Governance */}
        <div className="bg-white rounded-[4px] lg:col-span-4 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] h-full w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-[#111]">Session Governance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#f0f1f3] pb-3 gap-1">
              <span className="text-[13px] font-medium text-[#a0aab8]">Account</span>
              <span className="text-[13px] font-bold text-[#111] break-all">{user?.email || "Not signed in"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#f0f1f3] pb-3 gap-1">
              <span className="text-[13px] font-medium text-[#a0aab8]">Role</span>
              <span className="text-[12px] font-bold text-[#3282ff]">
                {user?.isSuperAdmin ? "Platform Super Admin" : "Institution Administrator"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#f0f1f3] pb-3 gap-1">
              <span className="text-[13px] font-medium text-[#a0aab8]">Tenant ID</span>
              <span className="font-mono text-[11px] text-[#111] bg-[#f0f1f3] px-2 py-1 rounded w-max">
                {user?.tenantId || "Unassigned"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[13px] font-medium text-[#a0aab8]">Departments & Reports</span>
              <span className="text-[12px] font-bold text-[#111]">
                {metrics?.totalDepartments ?? 0} Depts • {metrics?.totalExamReports ?? 0} Reports
              </span>
            </div>
          </div>
        </div>

        {/* Quick Modules Hub */}
        <div className="bg-white rounded-[4px] lg:col-span-8 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] h-full w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-[#111]">Quick Modules</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
            <Link href="/dashboard/students" className="group flex items-center gap-4 w-full">
              <div className="h-[44px] w-[44px] rounded-full bg-[#f0f1f3] group-hover:bg-[#3282ff] text-[#a0aab8] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <i className="fa-solid fa-user-graduate text-[16px]"></i>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111] group-hover:text-[#3282ff] transition-colors">
                  Students ({metrics?.totalStudents ?? 0})
                </h4>
                <p className="text-[11px] text-[#a0aab8]">Admissions & Directory</p>
              </div>
            </Link>

            <Link href="/dashboard/teachers" className="group flex items-center gap-4 w-full">
              <div className="h-[44px] w-[44px] rounded-full bg-[#f0f1f3] group-hover:bg-[#3282ff] text-[#a0aab8] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <i className="fa-solid fa-chalkboard-user text-[16px]"></i>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111] group-hover:text-[#3282ff] transition-colors">
                  Teachers ({metrics?.totalTeachers ?? 0})
                </h4>
                <p className="text-[11px] text-[#a0aab8]">Staff & Allocations</p>
              </div>
            </Link>

            <Link href="/dashboard/exams" className="group flex items-center gap-4 w-full">
              <div className="h-[44px] w-[44px] rounded-full bg-[#f0f1f3] group-hover:bg-[#3282ff] text-[#a0aab8] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <i className="fa-solid fa-pen-to-square text-[16px]"></i>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111] group-hover:text-[#3282ff] transition-colors">
                  Exams ({metrics?.totalExams ?? 0})
                </h4>
                <p className="text-[11px] text-[#a0aab8]">Assessments & Grading</p>
              </div>
            </Link>

            <Link href="/dashboard/academics/departments" className="group flex items-center gap-4 w-full">
              <div className="h-[44px] w-[44px] rounded-full bg-[#f0f1f3] group-hover:bg-[#3282ff] text-[#a0aab8] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <i className="fa-solid fa-building-user text-[16px]"></i>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111] group-hover:text-[#3282ff] transition-colors">
                  Departments ({metrics?.totalDepartments ?? 0})
                </h4>
                <p className="text-[11px] text-[#a0aab8]">Academic Structure</p>
              </div>
            </Link>

            <Link href="/dashboard/users/roles" className="group flex items-center gap-4 w-full">
              <div className="h-[44px] w-[44px] rounded-full bg-[#f0f1f3] group-hover:bg-[#3282ff] text-[#a0aab8] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <i className="fa-solid fa-shield-halved text-[16px]"></i>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111] group-hover:text-[#3282ff] transition-colors">Roles & RBAC</h4>
                <p className="text-[11px] text-[#a0aab8]">Access Permissions</p>
              </div>
            </Link>

            <Link href="/dashboard/users/audit-logs" className="group flex items-center gap-4 w-full">
              <div className="h-[44px] w-[44px] rounded-full bg-[#f0f1f3] group-hover:bg-[#3282ff] text-[#a0aab8] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <i className="fa-solid fa-file-shield text-[16px]"></i>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111] group-hover:text-[#3282ff] transition-colors">Audit Logs</h4>
                <p className="text-[11px] text-[#a0aab8]">System Trails</p>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}