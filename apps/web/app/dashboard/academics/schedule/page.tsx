// apps/web/app/dashboard/academics/schedule/page.tsx
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

// TypeScript interface for a Scheduled Class
interface ScheduleItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  room: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  department: string;
}

// Initial mock schedule data
const initialSchedule: ScheduleItem[] = [
  {
    id: 'SCH-001',
    courseCode: 'MTH-401',
    courseTitle: 'Advanced Calculus & Linear Algebra',
    instructor: 'Dr. Robert Langdon',
    room: 'Hall 302',
    dayOfWeek: 'Monday',
    startTime: '08:00 AM',
    endTime: '09:30 AM',
    department: 'Mathematics',
  },
  {
    id: 'SCH-002',
    courseCode: 'SCI-302',
    courseTitle: 'Organic Chemistry & Laboratory',
    instructor: 'Dr. Marie Curie',
    room: 'Lab B-12',
    dayOfWeek: 'Monday',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    department: 'Science',
  },
  {
    id: 'SCH-003',
    courseCode: 'CSC-105',
    courseTitle: 'Introduction to Python & Data Structures',
    instructor: 'Dr. Alan Turing',
    room: 'Computer Lab 04',
    dayOfWeek: 'Tuesday',
    startTime: '01:00 PM',
    endTime: '03:00 PM',
    department: 'Computer Science',
  },
  {
    id: 'SCH-004',
    courseCode: 'HUM-201',
    courseTitle: 'World Literature & Critical Theory',
    instructor: 'Prof. Margaret Atwood',
    room: 'Room 108',
    dayOfWeek: 'Wednesday',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    department: 'Humanities',
  },
  {
    id: 'SCH-005',
    courseCode: 'ART-101',
    courseTitle: 'Studio Arts & Classical Drawing',
    instructor: 'Prof. Leonardo da Vinci',
    room: 'Studio 2',
    dayOfWeek: 'Thursday',
    startTime: '02:00 PM',
    endTime: '04:30 PM',
    department: 'Arts',
  },
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export default function MasterSchedulePage() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(initialSchedule);
  const [selectedDay, setSelectedDay] = useState<'All' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Form state for new schedule entry
  const [formData, setFormData] = useState({
    courseCode: 'MTH-101',
    courseTitle: 'General Mathematics',
    instructor: 'Dr. Robert Langdon',
    room: 'Hall 101',
    dayOfWeek: 'Monday' as const,
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    department: 'Mathematics',
  });

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ScheduleItem = {
      id: `SCH-00${scheduleItems.length + 1}`,
      ...formData,
    };
    setScheduleItems([newItem, ...scheduleItems]);
    setIsModalOpen(false);
    setSuccessBanner('New class slot successfully scheduled and published to the master timetable.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const filteredSchedule = scheduleItems.filter((item) => {
    const matchesSearch =
      item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.room.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDay = selectedDay === 'All' || item.dayOfWeek === selectedDay;
    const matchesDept = departmentFilter === 'All' || item.department === departmentFilter;

    return matchesSearch && matchesDay && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* ==================================================================
         BREADCRUMBS & HEADER
         ================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
            <Link href="/dashboard" className="hover:text-[#006FBF] transition-colors">
              Dashboard
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/academics" className="hover:text-[#006FBF] transition-colors">
              Academics & Courses
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900">Master Schedule</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Master Academic Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Coordinate weekly lecture timetables, room reservations, faculty allocations, and building occupancy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/academics"
            className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span>Back to Courses</span>
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-9 items-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus text-[10px]"></i>
            <span>Schedule Class</span>
          </button>
        </div>
      </div>

      {/* ==================================================================
         NOTIFICATIONS
         ================================================================== */}
      {successBanner && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-600">
            <i className="fa-solid fa-check text-[10px]" />
          </span>
          <p className="flex-1">{successBanner}</p>
        </div>
      )}

      {/* ==================================================================
         KPI METRICS OVERVIEW
         ================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Slots</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#006FBF]/10 text-[#006FBF]">
              <i className="fa-solid fa-calendar-check text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{scheduleItems.length}</p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">Active weekly sessions</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rooms Utilized</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <i className="fa-solid fa-door-open text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {new Set(scheduleItems.map((s) => s.room)).size}
          </p>
          <p className="mt-1 text-[11px] font-medium text-emerald-600">Lecture halls & labs</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peak Day</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <i className="fa-solid fa-fire text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Monday</p>
          <p className="mt-1 text-[11px] font-medium text-purple-600">Highest session volume</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Term Cycle</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <i className="fa-solid fa-clock text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Fall 2026</p>
          <p className="mt-1 text-[11px] font-medium text-amber-600">Semesters in session</p>
        </div>
      </div>

      {/* ==================================================================
         TOOLBAR & FILTER CONTROLS
         ================================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
            <input
              type="text"
              placeholder="Search by title, code, instructor, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
            />
          </div>

          {/* Filters & View Mode */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Day:</span>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
              >
                <option value="All">All Days</option>
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Dept:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
              >
                <option value="All">All Departments</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Humanities">Humanities</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Arts">Arts</option>
              </select>
            </div>

            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <i className="fa-solid fa-list mr-1.5"></i> List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <i className="fa-solid fa-calendar-week mr-1.5"></i> Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================
         SCHEDULE DISPLAY: LIST VIEW VS GRID VIEW
         ================================================================== */}
      {viewMode === 'list' ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Day & Time</th>
                  <th className="py-3.5 px-6">Course Details</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Instructor</th>
                  <th className="py-3.5 px-6">Location / Room</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchedule.length > 0 ? (
                  filteredSchedule.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center rounded-md bg-[#006FBF]/10 px-2 py-0.5 text-[10px] font-bold text-[#006FBF] mb-1">
                          {item.dayOfWeek}
                        </span>
                        <div className="text-xs font-mono font-medium text-slate-700">
                          {item.startTime} - {item.endTime}
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="font-semibold text-slate-900 font-mono text-xs">{item.courseCode}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.courseTitle}</div>
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 text-[11px] font-medium">{item.department}</td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2 text-slate-700 text-[11px] font-medium">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200">
                            {item.instructor.charAt(0)}
                          </div>
                          {item.instructor}
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200/80">
                          <i className="fa-solid fa-location-dot text-rose-500 text-[10px]"></i>
                          {item.room}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button className="text-[#006FBF] hover:text-[#012E54] font-semibold text-[11px] px-2.5 py-1 rounded-lg hover:bg-[#006FBF]/5 transition-colors">
                          Modify
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 mb-3">
                        <i className="fa-solid fa-calendar-xmark text-lg"></i>
                      </div>
                      <p className="text-xs font-semibold text-slate-600">No scheduled sessions found</p>
                      <p className="text-[11px] text-slate-400 mt-1">Try resetting filters or adding a new schedule slot.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View organized by Days of the Week */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {DAYS_OF_WEEK.map((day) => {
            const dayClasses = scheduleItems.filter((item) => item.dayOfWeek === day);
            return (
              <div key={day} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">{day}</h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {dayClasses.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {dayClasses.length > 0 ? (
                    dayClasses.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 hover:bg-white hover:border-[#006FBF]/40 transition-all shadow-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-[#006FBF]">{item.courseCode}</span>
                          <span className="text-[9px] font-mono text-slate-500">{item.startTime}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 line-clamp-1">{item.courseTitle}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                          <span><i className="fa-solid fa-user text-[9px] mr-1"></i>{item.instructor.split(' ').pop()}</span>
                          <span className="font-semibold text-slate-700"><i className="fa-solid fa-location-dot text-rose-500 text-[9px] mr-1"></i>{item.room}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-[11px] italic">
                      No classes scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================================================================
         SCHEDULE CLASS MODAL
         ================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Schedule New Class Session</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Assign time slots, faculty, and room locations.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <form onSubmit={handleCreateSchedule}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Course Code <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.courseCode}
                      onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                      placeholder="e.g. MTH-401"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-mono uppercase text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Department <span className="text-rose-500">*</span></label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="Humanities">Humanities</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Arts">Arts</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Course Title <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.courseTitle}
                    onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                    placeholder="e.g. Advanced Calculus"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Day of Week <span className="text-rose-500">*</span></label>
                    <select
                      value={formData.dayOfWeek}
                      onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Room / Location <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      placeholder="e.g. Hall 302"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Start Time <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      placeholder="e.g. 08:00 AM"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-mono text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">End Time <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      placeholder="e.g. 09:30 AM"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-mono text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Assigned Instructor <span className="text-rose-500">*</span></label>
                  <select
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                  >
                    <option value="Dr. Robert Langdon">Dr. Robert Langdon</option>
                    <option value="Dr. Marie Curie">Dr. Marie Curie</option>
                    <option value="Prof. Margaret Atwood">Prof. Margaret Atwood</option>
                    <option value="Dr. Alan Turing">Dr. Alan Turing</option>
                    <option value="Prof. Leonardo da Vinci">Prof. Leonardo da Vinci</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                  }}
                >
                  <i className="fa-solid fa-check text-[10px]"></i>
                  <span>Publish Schedule Slot</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}