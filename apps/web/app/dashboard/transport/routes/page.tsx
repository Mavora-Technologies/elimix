'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Transport Route record
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

// Initial mock data for transport routes
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

  // Filter logic based on search and status
  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || route.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: TransportRoute['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Maintenance':
        return 'bg-amber-50 text-amber-700 border-amber-200';
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Transport Routes
          </h1>
          <p className="text-sm text-slate-500">
            Manage school bus routes, vehicle assignments, driver details, and student manifests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/transport/fleet"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-van-shuttle mr-2 text-xs text-blue-600"></i> Fleet Directory
          </Link>
          <button
            onClick={() => setRouteModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-map-location-dot mr-2 text-xs"></i> Add New Route
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Routes</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-route text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">18</p>
          <span className="text-xs text-blue-600 font-medium">Out of 22 total configured routes</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Ridership</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-users text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">845</p>
          <span className="text-xs text-emerald-600 font-medium">Students enrolled in transport</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Buses in Maint.</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-screwdriver-wrench text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">2</p>
          <span className="text-xs text-amber-600 font-medium">Requires backup assignment</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Stops</p>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <i className="fa-solid fa-location-dot text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">142</p>
          <span className="text-xs text-indigo-600 font-medium">Across all active routes</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search route name, bus number, or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
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
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Route Info</th>
                <th className="py-3 px-4">Assigned Bus & Driver</th>
                <th className="py-3 px-4">Departure</th>
                <th className="py-3 px-4">Stops / Students</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-sm">{route.routeName}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{route.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 text-xs flex items-center gap-1.5">
                        <i className="fa-solid fa-bus text-slate-400"></i> {route.busNumber}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1.5">
                        <i className="fa-solid fa-user-tie text-slate-400"></i> {route.driverName} ({route.driverContact})
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 text-sm font-semibold font-mono">{route.departureTime}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-600"><span className="font-semibold text-slate-900">{route.stopsCount}</span> Waypoints</span>
                        <span className="text-[11px] text-slate-500"><span className="font-semibold text-slate-900">{route.studentCount}</span> Assigned Students</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(route.status)}`}>
                        {route.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Edit
                      </button>
                      <button className="text-slate-600 hover:text-slate-800 font-medium text-xs px-2 py-1 rounded hover:bg-slate-100 transition-colors">
                        Manifest
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Create New Transport Route</h3>
              <button
                onClick={() => setRouteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleSaveRoute} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Route Name / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lavington / Kilimani Morning Loop"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Assign Bus
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="">Select a Bus...</option>
                    <option value="BUS-402">BUS-402 (KCX 112L) - 50 Seater</option>
                    <option value="BUS-415">BUS-415 (KDA 890M) - 65 Seater</option>
                    <option value="BUS-211">BUS-211 (KBZ 776K) - 30 Seater</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Assign Driver
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="">Select a Driver...</option>
                    <option value="James Omondi">James Omondi</option>
                    <option value="Peter Kamau">Peter Kamau</option>
                    <option value="David Mutua">David Mutua</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Route Departure Time
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive (Draft)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Route Waypoints / Stops (One per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Valley Arcade&#10;Yaya Centre&#10;Prestige Plaza"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRouteModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
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