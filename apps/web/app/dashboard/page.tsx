'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isSuperAdmin: boolean;
  tenantId?: string;
}

interface DashboardMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalEarnings: number;
}

export default function DashboardOverviewPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(true);

  // --- Advanced Filter States ---
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('monthly');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // --- Interactive Chart States ---
  const [activeEarningsDay, setActiveEarningsDay] = useState<number | null>(null);
  const [activeExpenseBar, setActiveExpenseBar] = useState<number | null>(null);
  const [activeDonutSlice, setActiveDonutSlice] = useState<'female' | 'male' | null>(null);

  // Mock data for the interactive Area Chart tooltips
  const weeklyEarnings = [
    { day: 'Mon', total: 45000, fees: 12000 },
    { day: 'Tue', total: 20000, fees: 5000 },
    { day: 'Wed', total: 60000, fees: 40000 },
    { day: 'Thu', total: 70000, fees: 15000 },
    { day: 'Fri', total: 50000, fees: 65000 },
    { day: 'Sat', total: 85000, fees: 75000 },
    { day: 'Sun', total: 55000, fees: 50000 },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("elimix_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }

    const fetchDashboardMetrics = async () => {
      setIsLoadingMetrics(true);
      try {
        // Simulating backend fetch that would ideally pass the filter states as query params
        await new Promise(resolve => setTimeout(resolve, 800)); 
        setMetrics({
          totalStudents: 150000, 
          totalTeachers: 2250,
          totalParents: 5690,
          totalEarnings: 193000
        });
      } catch (error) {
        console.error("Error fetching live dashboard metrics:", error);
      } finally {
        setIsLoadingMetrics(false);
      }
    };

    // Re-fetch data whenever a filter changes
    fetchDashboardMetrics();
  }, [timeFilter, selectedGrade, selectedStream, startDate, endDate]);

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f0f1f3] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#111]">
      
      {/* 1. Header Section */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-semibold text-[#111] mb-1.5 tracking-wide">Admin Dashboard</h2>
          <div className="flex items-center text-[12px] text-[#a0aab8]">
            <span className="hover:text-[#ff9d01] cursor-pointer transition-colors">Home</span>
            <i className="fa-solid fa-chevron-right text-[9px] mx-3"></i>
            <span className="text-[#ff9d01]">Admin</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/reports" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto h-[36px] px-4 rounded-[4px] bg-white border border-[#e0e0e0] text-[#a0aab8] text-[12px] font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <i className="fa-solid fa-file-arrow-down mr-2"></i> Export
            </button>
          </Link>
          <Link href="/dashboard/students" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto h-[36px] px-4 rounded-[4px] bg-[#042954] text-white text-[12px] font-medium hover:bg-[#0a386e] transition-colors shadow-sm">
              <i className="fa-solid fa-user-plus mr-2"></i> Register Student
            </button>
          </Link>
        </div>
      </div>

      {/* 2. Advanced Filters Bar */}
      <div className="bg-white rounded-[4px] p-4 sm:p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] mb-6 w-full flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 transition-all duration-300">
        
        {/* Timeframe Toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full 2xl:w-auto">
          {['daily', 'weekly', 'monthly', 'yearly', 'custom'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter as any)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-[4px] text-[12px] font-bold uppercase tracking-wider transition-all duration-200 ${
                timeFilter === filter 
                  ? 'bg-[#3282ff] text-white shadow-md shadow-blue-500/20' 
                  : 'bg-[#f0f1f3] text-[#a0aab8] hover:bg-[#e4f1ff] hover:text-[#3282ff]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Dynamic Context Filters (Class, Stream, Custom Dates) */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full 2xl:w-auto">
          
          {/* Custom Date Range Picker (Only visible when 'custom' is selected) */}
          {timeFilter === 'custom' && (
            <div className="flex items-center gap-2 w-full sm:w-auto animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="relative flex-1 sm:flex-none">
                <i className="fa-regular fa-calendar absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[12px]"></i>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full sm:w-auto h-[36px] pl-8 pr-3 rounded-[4px] border border-[#e0e0e0] text-[12px] font-medium text-[#111] focus:outline-none focus:border-[#3282ff] bg-white transition-colors"
                />
              </div>
              <span className="text-[#a0aab8] text-[12px] font-bold">To</span>
              <div className="relative flex-1 sm:flex-none">
                <i className="fa-regular fa-calendar absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[12px]"></i>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full sm:w-auto h-[36px] pl-8 pr-3 rounded-[4px] border border-[#e0e0e0] text-[12px] font-medium text-[#111] focus:outline-none focus:border-[#3282ff] bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {/* Comprehensive Kenyan Grade/Class Selector */}
          <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
            <i className="fa-solid fa-graduation-cap absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[12px]"></i>
            <select 
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full sm:w-[160px] h-[36px] pl-8 pr-8 rounded-[4px] border border-[#e0e0e0] text-[12px] font-medium text-[#111] focus:outline-none focus:border-[#3282ff] bg-white appearance-none cursor-pointer transition-colors"
            >
              <option value="all">All Grades</option>
              
              <optgroup label="Early Years (CBC)">
                <option value="playgroup">Playgroup</option>
                <option value="pp1">PP1</option>
                <option value="pp2">PP2</option>
              </optgroup>
              
              <optgroup label="Primary (CBC)">
                <option value="grade_1">Grade 1</option>
                <option value="grade_2">Grade 2</option>
                <option value="grade_3">Grade 3</option>
                <option value="grade_4">Grade 4</option>
                <option value="grade_5">Grade 5</option>
                <option value="grade_6">Grade 6</option>
              </optgroup>

              <optgroup label="Junior School (CBC)">
                <option value="grade_7">Grade 7 (JSS)</option>
                <option value="grade_8">Grade 8 (JSS)</option>
                <option value="grade_9">Grade 9 (JSS)</option>
              </optgroup>

              <optgroup label="Senior School (CBC)">
                <option value="grade_10">Grade 10</option>
                <option value="grade_11">Grade 11</option>
                <option value="grade_12">Grade 12</option>
              </optgroup>

              <optgroup label="8-4-4 System">
                <option value="class_8">Class 8</option>
                <option value="form_1">Form 1</option>
                <option value="form_2">Form 2</option>
                <option value="form_3">Form 3</option>
                <option value="form_4">Form 4</option>
              </optgroup>
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[10px] pointer-events-none"></i>
          </div>

          {/* Stream Selector */}
          <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
            <i className="fa-solid fa-layer-group absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[12px]"></i>
            <select 
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full sm:w-[140px] h-[36px] pl-8 pr-8 rounded-[4px] border border-[#e0e0e0] text-[12px] font-medium text-[#111] focus:outline-none focus:border-[#3282ff] bg-white appearance-none cursor-pointer transition-colors"
            >
              <option value="all">All Streams</option>
              
              <optgroup label="Alphabetic">
                <option value="a">Stream A</option>
                <option value="b">Stream B</option>
                <option value="c">Stream C</option>
                <option value="d">Stream D</option>
              </optgroup>
              
              <optgroup label="Colors">
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
              </optgroup>

              <optgroup label="Directions">
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </optgroup>
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[10px] pointer-events-none"></i>
          </div>

        </div>
      </div>

      {/* 3. KPI Metric Cards */}
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
              <h3 className="text-[22px] font-bold text-[#111]">{metrics?.totalStudents.toLocaleString()}</h3>
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
              <h3 className="text-[22px] font-bold text-[#111]">{metrics?.totalTeachers.toLocaleString()}</h3>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[4px] p-5 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-transform duration-300 w-full">
          <div className="h-[65px] w-[65px] rounded-full bg-[#fff2e0] flex items-center justify-center text-[#ffa305] shrink-0">
            <i className="fa-regular fa-user text-[26px]"></i>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-medium text-[#a0aab8] mb-1">Parents</p>
            {isLoadingMetrics ? (
              <div className="h-6 w-20 bg-[#f0f1f3] rounded animate-pulse ml-auto"></div>
            ) : (
              <h3 className="text-[22px] font-bold text-[#111]">{metrics?.totalParents.toLocaleString()}</h3>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[4px] p-5 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-transform duration-300 w-full">
          <div className="h-[65px] w-[65px] rounded-full bg-[#ffeaea] flex items-center justify-center text-[#ff0000] shrink-0">
            <i className="fa-solid fa-money-bill-1 text-[26px]"></i>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-medium text-[#a0aab8] mb-1">Earnings</p>
            {isLoadingMetrics ? (
              <div className="h-6 w-20 bg-[#f0f1f3] rounded animate-pulse ml-auto"></div>
            ) : (
              <h3 className="text-[22px] font-bold text-[#111]">KSh {metrics?.totalEarnings.toLocaleString()}</h3>
            )}
          </div>
        </div>
      </div>

      {/* 4. Executive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 w-full mb-6">
        
        {/* INTERACTIVE: Earnings Area Chart */}
        <div className="bg-white rounded-[4px] lg:col-span-6 2xl:col-span-6 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col h-[400px] w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-[#111]">Earnings</h3>
            <i className="fa-solid fa-ellipsis text-[#a0aab8] cursor-pointer hover:text-[#111] text-[14px]"></i>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-40">
            <div className="flex flex-wrap gap-4 sm:gap-8">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[12px] text-[#a0aab8] mb-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#3282ff]"></div> Total Collections
                </div>
                <span className="text-[16px] font-bold text-[#111]">KSh 75,000</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[12px] text-[#a0aab8] mb-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff0000]"></div> Fees Collection
                </div>
                <span className="text-[16px] font-bold text-[#111]">KSh 15,000</span>
              </div>
            </div>
            <div className="text-[11px] text-[#a0aab8] cursor-pointer">
              {timeFilter === 'custom' && startDate && endDate ? `${startDate} to ${endDate}` : `Current ${timeFilter}`} <i className="fa-solid fa-chevron-down text-[9px] ml-1"></i>
            </div>
          </div>

          <div className="relative w-full flex-1 ml-8 sm:ml-[35px] border-b border-l border-[#f0f1f3]">
            {/* Background Grid */}
            <svg width="100%" height="100%" className="absolute inset-0 z-0 pointer-events-none">
              <defs>
                <pattern id="grid" width="100%" height="40" patternUnits="userSpaceOnUse">
                  <rect width="100%" height="40" fill="none" />
                  <path d="M 1000 0 L 0 0 0 40" fill="none" stroke="#f0f1f3" strokeWidth="1.5" strokeDasharray="4 4"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            
            {/* Y-Axis */}
            <div className="absolute left-[-35px] sm:left-[-40px] top-0 h-full flex flex-col justify-between text-[10px] sm:text-[11px] text-[#a0aab8] py-1 z-20 pointer-events-none">
              <span>100k</span><span>75k</span><span>50k</span><span>25k</span><span>0</span>
            </div>

            {/* Base SVG waves (100% width) */}
            <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full absolute bottom-0 left-0 z-10 pointer-events-none">
              <path d="M0,200 L0,150 C50,150 80,60 150,60 C220,60 250,150 320,150 C390,150 430,30 500,40 L500,200 Z" fill="#3282ff" opacity="0.95" />
              <path d="M0,200 L0,180 C40,90 80,40 120,130 C150,200 180,60 220,40 C260,20 280,120 320,90 C360,60 400,20 500,80 L500,200 Z" fill="#ff0000" opacity="0.95" />
            </svg>

            {/* INTERACTIVE LAYER: 7 Columns for Days */}
            <div className="absolute inset-0 z-30 flex" onMouseLeave={() => setActiveEarningsDay(null)}>
              {weeklyEarnings.map((data, index) => (
                <div 
                  key={index}
                  className="flex-1 h-full relative cursor-crosshair group"
                  onMouseEnter={() => setActiveEarningsDay(index)}
                >
                  {/* Hover Tooltip & Crosshair */}
                  {activeEarningsDay === index && (
                    <>
                      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-400 border-dashed border-l border-slate-400 opacity-50 z-30 pointer-events-none"></div>
                      
                      <div className="absolute bottom-[60%] left-1/2 -translate-x-1/2 bg-[#111] text-white p-3 rounded-md shadow-xl z-50 w-[130px] pointer-events-none animate-in fade-in zoom-in duration-200">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-2 border-b border-gray-700 pb-1">{data.day}</p>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#3282ff]"></span>
                            <span className="text-[10px]">Total</span>
                          </div>
                          <span className="text-[11px] font-bold">{(data.total / 1000)}k</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#ff0000]"></span>
                            <span className="text-[10px]">Fees</span>
                          </div>
                          <span className="text-[11px] font-bold">{(data.fees / 1000)}k</span>
                        </div>
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111] rotate-45"></div>
                      </div>
                    </>
                  )}
                  {/* X-Axis Label */}
                  <div className={`absolute -bottom-7 w-full text-center text-[10px] sm:text-[11px] transition-colors duration-200 ${activeEarningsDay === index ? 'text-[#111] font-bold' : 'text-[#a0aab8]'}`}>
                    {data.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INTERACTIVE: Expenses Bar Chart */}
        <div className="bg-white rounded-[4px] lg:col-span-3 2xl:col-span-3 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col h-[400px] w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-[#111]">Expenses</h3>
            <i className="fa-solid fa-ellipsis text-[#a0aab8] cursor-pointer hover:text-[#111] text-[14px]"></i>
          </div>
          
          <div className="flex justify-between gap-2 mb-8 relative z-30 w-full">
            <div className="flex flex-col flex-1">
              <span className="text-[10px] sm:text-[11px] text-[#a0aab8] mb-2 whitespace-nowrap">Jan 2026</span>
              <span className="text-[11px] sm:text-[13px] font-bold text-[#111] border-b-[2px] border-[#33d47a] pb-1 whitespace-nowrap">KSh 15k</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[10px] sm:text-[11px] text-[#a0aab8] mb-2 whitespace-nowrap">Feb 2026</span>
              <span className="text-[11px] sm:text-[13px] font-bold text-[#111] border-b-[2px] border-[#3282ff] pb-1 whitespace-nowrap">KSh 10k</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[10px] sm:text-[11px] text-[#a0aab8] mb-2 whitespace-nowrap">Mar 2026</span>
              <span className="text-[11px] sm:text-[13px] font-bold text-[#111] border-b-[2px] border-[#ffa305] pb-1 whitespace-nowrap">KSh 8k</span>
            </div>
          </div>

          <div className="flex items-end justify-between px-2 sm:px-8 mt-auto flex-1 border-b border-l border-[#f0f1f3] relative w-full" onMouseLeave={() => setActiveExpenseBar(null)}>
             <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none w-full">
               <div className="w-full border-t border-[#f0f1f3] h-[1px]"></div>
               <div className="w-full border-t border-[#f0f1f3] h-[1px]"></div>
               <div className="w-full border-t border-[#f0f1f3] h-[1px]"></div>
               <div className="w-full border-t border-[#f0f1f3] h-[1px]"></div>
               <div className="w-full border-t border-[#f0f1f3] h-[1px]"></div>
             </div>
             
             <div className="absolute left-[-30px] top-0 h-full flex flex-col justify-between text-[9px] sm:text-[10px] text-[#a0aab8] py-1 bg-white pr-1 sm:pr-2 z-20 pointer-events-none">
              <span>150k</span><span>125k</span><span>100k</span><span>75k</span><span>50k</span><span>25k</span><span>0</span>
            </div>

            {/* Bars */}
            <div 
              className={`relative w-8 sm:w-10 bg-[#33d47a] h-[80%] z-30 transition-all duration-300 cursor-pointer mx-auto ${activeExpenseBar !== null && activeExpenseBar !== 1 ? 'opacity-30' : 'opacity-100 hover:scale-x-110'}`}
              onMouseEnter={() => setActiveExpenseBar(1)}
            >
              {activeExpenseBar === 1 && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111] text-white text-[10px] sm:text-[11px] font-bold px-2 py-1.5 rounded shadow-lg animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap z-50">
                  KSh 15,000
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111] rotate-45"></div>
                </div>
              )}
            </div>

            <div 
              className={`relative w-8 sm:w-10 bg-[#3282ff] h-[60%] z-30 transition-all duration-300 cursor-pointer mx-auto ${activeExpenseBar !== null && activeExpenseBar !== 2 ? 'opacity-30' : 'opacity-100 hover:scale-x-110'}`}
              onMouseEnter={() => setActiveExpenseBar(2)}
            >
              {activeExpenseBar === 2 && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111] text-white text-[10px] sm:text-[11px] font-bold px-2 py-1.5 rounded shadow-lg animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap z-50">
                  KSh 10,000
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111] rotate-45"></div>
                </div>
              )}
            </div>

            <div 
              className={`relative w-8 sm:w-10 bg-[#ffa305] h-[45%] z-30 transition-all duration-300 cursor-pointer mx-auto ${activeExpenseBar !== null && activeExpenseBar !== 3 ? 'opacity-30' : 'opacity-100 hover:scale-x-110'}`}
              onMouseEnter={() => setActiveExpenseBar(3)}
            >
              {activeExpenseBar === 3 && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111] text-white text-[10px] sm:text-[11px] font-bold px-2 py-1.5 rounded shadow-lg animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap z-50">
                  KSh 8,000
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111] rotate-45"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INTERACTIVE: Students Donut Chart */}
        <div className="bg-white rounded-[4px] lg:col-span-3 2xl:col-span-3 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col h-[400px] items-center w-full">
          <div className="flex items-center justify-between w-full mb-6">
            <h3 className="text-[16px] font-semibold text-[#111]">Students</h3>
            <i className="fa-solid fa-ellipsis text-[#a0aab8] cursor-pointer hover:text-[#111] text-[14px]"></i>
          </div>
          
          <div className="flex-1 flex items-center justify-center w-full my-4 relative">
            <svg width="190" height="190" viewBox="0 0 100 100" className="rotate-[-90deg] overflow-visible shrink-0" onMouseLeave={() => setActiveDonutSlice(null)}>
              {/* Male (Yellow) - 70% */}
              <circle 
                cx="50" cy="50" r="30" 
                fill="none" 
                stroke="#ffa305" 
                strokeWidth={activeDonutSlice === 'male' ? "35" : "30"}
                strokeDasharray="131.95 56.55" 
                strokeDashoffset="-56.55"
                className={`transition-all duration-300 cursor-pointer ${activeDonutSlice === 'female' ? 'opacity-30' : 'opacity-100'}`}
                onMouseEnter={() => setActiveDonutSlice('male')}
              />
              {/* Female (Blue) - 30% */}
              <circle 
                cx="50" cy="50" r="30" 
                fill="none" 
                stroke="#3282ff" 
                strokeWidth={activeDonutSlice === 'female' ? "35" : "30"}
                strokeDasharray="56.55 131.95"
                className={`transition-all duration-300 cursor-pointer ${activeDonutSlice === 'male' ? 'opacity-30' : 'opacity-100'}`}
                onMouseEnter={() => setActiveDonutSlice('female')}
              />
            </svg>

            {/* Dynamic Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-full h-[120px] w-[120px] flex flex-col items-center justify-center shadow-inner shrink-0">
                {activeDonutSlice === 'female' ? (
                  <div className="animate-in zoom-in duration-200 text-center">
                    <span className="block text-[22px] font-black text-[#3282ff]">45k</span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Female</span>
                  </div>
                ) : activeDonutSlice === 'male' ? (
                  <div className="animate-in zoom-in duration-200 text-center">
                    <span className="block text-[22px] font-black text-[#ffa305]">105k</span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Male</span>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-500 text-center">
                    <span className="block text-[20px] font-black text-[#111]">150k</span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-full flex justify-between mt-auto">
            <div 
              className={`flex flex-col cursor-pointer transition-opacity duration-300 ${activeDonutSlice === 'male' ? 'opacity-30' : 'opacity-100'}`}
              onMouseEnter={() => setActiveDonutSlice('female')}
              onMouseLeave={() => setActiveDonutSlice(null)}
            >
              <span className="w-6 border-b-[3px] border-[#3282ff] mb-2"></span>
              <span className="text-[11px] text-[#a0aab8] mb-1">Female Students</span>
              <span className="text-[13px] sm:text-[14px] font-bold text-[#111]">45,000</span>
            </div>
            <div 
              className={`flex flex-col text-right items-end cursor-pointer transition-opacity duration-300 ${activeDonutSlice === 'female' ? 'opacity-30' : 'opacity-100'}`}
              onMouseEnter={() => setActiveDonutSlice('male')}
              onMouseLeave={() => setActiveDonutSlice(null)}
            >
              <span className="w-6 border-b-[3px] border-[#ffa305] mb-2"></span>
              <span className="text-[11px] text-[#a0aab8] mb-1">Male Students</span>
              <span className="text-[13px] sm:text-[14px] font-bold text-[#111]">1,05,000</span>
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
            <i className="fa-solid fa-ellipsis text-[#a0aab8] cursor-pointer hover:text-[#111] text-[14px]"></i>
          </div>
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#f0f1f3] pb-3 gap-1">
              <span className="text-[13px] font-medium text-[#a0aab8]">Account</span>
              <span className="text-[13px] font-bold text-[#111] break-all">{user?.email || "superadmin@elimix.com"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#f0f1f3] pb-3 gap-1">
              <span className="text-[13px] font-medium text-[#a0aab8]">Role</span>
              <span className="text-[12px] font-bold text-[#3282ff]">
                {user?.isSuperAdmin ? "Super Admin" : "Institutional Admin"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#f0f1f3] pb-3 gap-1">
              <span className="text-[13px] font-medium text-[#a0aab8]">Tenant ID</span>
              <span className="font-mono text-[11px] text-[#111] bg-[#f0f1f3] px-2 py-1 rounded w-max">{user?.tenantId || "global_tenant_01"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[13px] font-medium text-[#a0aab8]">Status</span>
              <span className="text-[12px] font-bold text-[#33d47a] flex items-center gap-2 w-max">
                <span className="h-2 w-2 rounded-full bg-[#33d47a] animate-pulse"></span> Operational
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Quick Actions Hub */}
        <div className="bg-white rounded-[4px] lg:col-span-8 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] h-full w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-[#111]">Quick Modules</h3>
            <i className="fa-solid fa-ellipsis text-[#a0aab8] cursor-pointer hover:text-[#111] text-[14px]"></i>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
            
            <Link href="/dashboard/students" className="group flex items-center gap-4 w-full">
              <div className="h-[44px] w-[44px] rounded-full bg-[#f0f1f3] group-hover:bg-[#3282ff] text-[#a0aab8] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <i className="fa-solid fa-user-graduate text-[16px]"></i>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111] group-hover:text-[#3282ff] transition-colors">Students</h4>
                <p className="text-[11px] text-[#a0aab8]">Admissions</p>
              </div>
            </Link>

            <Link href="/dashboard/finance" className="group flex items-center gap-4 w-full">
              <div className="h-[44px] w-[44px] rounded-full bg-[#f0f1f3] group-hover:bg-[#3282ff] text-[#a0aab8] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <i className="fa-solid fa-file-invoice-dollar text-[16px]"></i>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111] group-hover:text-[#3282ff] transition-colors">Finance</h4>
                <p className="text-[11px] text-[#a0aab8]">Fees & M-Pesa</p>
              </div>
            </Link>

            <Link href="/dashboard/exams" className="group flex items-center gap-4 w-full">
              <div className="h-[44px] w-[44px] rounded-full bg-[#f0f1f3] group-hover:bg-[#3282ff] text-[#a0aab8] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <i className="fa-solid fa-pen-to-square text-[16px]"></i>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111] group-hover:text-[#3282ff] transition-colors">Exams</h4>
                <p className="text-[11px] text-[#a0aab8]">Grading</p>
              </div>
            </Link>

            <Link href="/dashboard/users" className="group flex items-center gap-4 w-full">
              <div className="h-[44px] w-[44px] rounded-full bg-[#f0f1f3] group-hover:bg-[#3282ff] text-[#a0aab8] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <i className="fa-solid fa-users-gear text-[16px]"></i>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111] group-hover:text-[#3282ff] transition-colors">Users</h4>
                <p className="text-[11px] text-[#a0aab8]">Staff Roles</p>
              </div>
            </Link>

            <Link href="/dashboard/users/security" className="group flex items-center gap-4 w-full">
              <div className="h-[44px] w-[44px] rounded-full bg-[#f0f1f3] group-hover:bg-[#3282ff] text-[#a0aab8] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <i className="fa-solid fa-shield-halved text-[16px]"></i>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111] group-hover:text-[#3282ff] transition-colors">Security</h4>
                <p className="text-[11px] text-[#a0aab8]">2FA Policies</p>
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