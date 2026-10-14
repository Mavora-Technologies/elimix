// apps/web/app/dashboard/transport/routes/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ==========================================================================
   ELIMIX BRAND PALETTE
   ========================================================================== */
const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

interface TransportRoute {
  id: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverContact: string;
  studentCount: number;
  stopsCount: number;
  departureTime: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

const initialRoutes: TransportRoute[] = [
  {
    id: 'RTE-01',
    routeName: 'Northside Morning Express',
    busNumber: 'BUS-402 (KCX 112L)',
    driverName: 'James Omondi',
    driverContact: '+254 712 345678',
    studentCount: 45,
    stopsCount: 8,
    departureTime: '06:15 AM',
    status: 'Active',
  },
  {
    id: 'RTE-02',
    routeName: 'Westlands / Kileleshwa Route',
    busNumber: 'BUS-415 (KDA 890M)',
    driverName: 'Peter Kamau',
    driverContact: '+254 722 987654',
    studentCount: 52,
    stopsCount: 12,
    departureTime: '06:00 AM',
    status: 'Active',
  },
  {
    id: 'RTE-03',
    routeName: 'South C / Langata Loop',
    busNumber: 'BUS-308 (KCY 445J)',
    driverName: 'David Mutua',
    driverContact: '+254 733 112233',
    studentCount: 38,
    stopsCount: 6,
    departureTime: '06:30 AM',
    status: 'Active',
  },
  {
    id: 'RTE-04',
    routeName: 'Eastlands Connector',
    busNumber: 'BUS-211 (KBZ 776K)',
    driverName: 'Samuel Njoroge',
    driverContact: '+254 711 556677',
    studentCount: 0,
    stopsCount: 10,
    departureTime: '06:10 AM',
    status: 'Maintenance',
  },
  {
    id: 'RTE-05',
    routeName: 'Karen / Hardy Special',
    busNumber: 'BUS-501 (KDE 201P)',
    driverName: 'William Ochieng',
    driverContact: '+254 799 887766',
    studentCount: 28,
    stopsCount: 5,
    departureTime: '06:45 AM',
    status: 'Inactive',
  },
];

export default function TransportRoutesPage() {
  const [routes, setRoutes] = useState<TransportRoute[]>(initialRoutes);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic
  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || route.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Status badge styling
  const getStatusBadge = (status: TransportRoute['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Maintenance':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Inactive':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New transport route has been successfully created and assigned.');
    setRouteModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#012E54]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#012E54] mb-1 tracking-tight">
            Transport Routes
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Manage school bus routes, vehicle assignments, driver details, and student manifests.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/transport/fleet"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-van-shuttle mr-2 text-xs text-[#006FBF]"></i> Fleet Directory
          </Link>
          <button
            onClick={() => setRouteModalOpen(true)}
            className="h-[38px] px-4 rounded-xl text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-map-location-dot mr-2 text-xs"></i> Add New Route
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Active Routes</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">18</h3>
            <span className="text-[11px] text-[#006FBF] font-semibold mt-1 block">Out of 22 total configured routes</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#006FBF] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-route text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Ridership</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">845</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Students enrolled in transport</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-users text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Buses in Maint.</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">2</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Requires backup assignment</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-screwdriver-wrench text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Stops</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">142</h3>
            <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">Across all active routes</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-location-dot text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search route name, bus number, or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Routes Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Route Info</th>
                <th className="py-3.5 px-5">Assigned Bus & Driver</th>
                <th className="py-3.5 px-5">Departure</th>
                <th className="py-3.5 px-5">Stops / Students</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#012E54] text-[13px]">{route.routeName}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{route.id}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-[#012E54] text-[12px] flex items-center gap-1.5">
                        <i className="fa-solid fa-bus text-[#006FBF]"></i> {route.busNumber}
                      </div>
                      <div className="text-[11px] text-[#64748b] mt-1 flex items-center gap-1.5">
                        <i className="fa-solid fa-user-tie text-slate-400"></i> {route.driverName} ({route.driverContact})
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-[#012E54] text-[13px] font-bold font-mono">{route.departureTime}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[12px] text-[#64748b]"><span className="font-bold text-[#012E54]">{route.stopsCount}</span> Waypoints</span>
                        <span className="text-[11px] text-[#64748b]"><span className="font-bold text-[#012E54]">{route.studentCount}</span> Assigned Students</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(route.status)}`}>
                        {route.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#006FBF] hover:bg-sky-100 font-semibold text-[12px] transition-colors">
                        Edit
                      </button>
                      <button className="h-[32px] px-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[12px] transition-colors">
                        Manifest
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b] text-[13px]">
                    No routes found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Route Modal */}
      {routeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012E54]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#012E54] text-[15px]">Create New Transport Route</h3>
              <button
                onClick={() => setRouteModalOpen(false)}
                className="text-slate-400 hover:text-[#012E54] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleSaveRoute} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Route Name / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lavington / Kilimani Morning Loop"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Assign Bus
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]">
                    <option value="">Select a Bus...</option>
                    <option value="BUS-402">BUS-402 (KCX 112L) - 50 Seater</option>
                    <option value="BUS-415">BUS-415 (KDA 890M) - 65 Seater</option>
                    <option value="BUS-211">BUS-211 (KBZ 776K) - 30 Seater</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Assign Driver
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]">
                    <option value="">Select a Driver...</option>
                    <option value="James Omondi">James Omondi</option>
                    <option value="Peter Kamau">Peter Kamau</option>
                    <option value="David Mutua">David Mutua</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Route Departure Time
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Initial Status
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive (Draft)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                  Route Waypoints / Stops (One per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Valley Arcade&#10;Yaya Centre&#10;Prestige Plaza"
                  className="w-full rounded-xl border border-[#cbd5e1] p-3 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setRouteModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                  }}
                >
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}