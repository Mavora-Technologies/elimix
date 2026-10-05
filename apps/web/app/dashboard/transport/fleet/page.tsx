'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Fleet Vehicle record
interface FleetVehicle {
  id: string;
  registrationNumber: string;
  type: 'Bus' | 'Minibus' | 'Van';
  makeModel: string;
  capacity: number;
  driverName: string;
  mileage: string;
  fuelLevel: number; // percentage (0 - 100)
  lastServiceDate: string;
  nextServiceDate: string;
  status: 'Operational' | 'Service Due' | 'In Maintenance' | 'Out of Service';
}

// Initial mock data for the transport fleet overview
const initialFleet: FleetVehicle[] = [
  {
    id: 'BUS-402',
    registrationNumber: 'KCX 112L',
    type: 'Bus',
    makeModel: 'Isuzu F330',
    capacity: 65,
    driverName: 'James Omondi',
    mileage: '84,200 km',
    fuelLevel: 85,
    lastServiceDate: '2026-08-10',
    nextServiceDate: '2026-11-15',
    status: 'Operational',
  },
  {
    id: 'BUS-415',
    registrationNumber: 'KDA 890M',
    type: 'Bus',
    makeModel: 'Mitsubishi Fuso',
    capacity: 50,
    driverName: 'Peter Kamau',
    mileage: '62,400 km',
    fuelLevel: 60,
    lastServiceDate: '2026-07-02',
    nextServiceDate: '2026-10-12',
    status: 'Service Due',
  },
  {
    id: 'BUS-308',
    registrationNumber: 'KCY 445J',
    type: 'Minibus',
    makeModel: 'Toyota Coaster',
    capacity: 33,
    driverName: 'David Mutua',
    mileage: '115,000 km',
    fuelLevel: 40,
    lastServiceDate: '2026-09-01',
    nextServiceDate: '2026-12-05',
    status: 'Operational',
  },
  {
    id: 'BUS-211',
    registrationNumber: 'KBZ 776K',
    type: 'Minibus',
    makeModel: 'Nissan Civilian',
    capacity: 29,
    driverName: 'Samuel Njoroge',
    mileage: '142,800 km',
    fuelLevel: 15,
    lastServiceDate: '2026-05-18',
    nextServiceDate: '2026-09-28',
    status: 'In Maintenance',
  },
  {
    id: 'VAN-105',
    registrationNumber: 'KDE 201P',
    type: 'Van',
    makeModel: 'Toyota Hiace',
    capacity: 14,
    driverName: 'Unassigned',
    mileage: '35,100 km',
    fuelLevel: 90,
    lastServiceDate: '2026-09-12',
    nextServiceDate: '2027-01-10',
    status: 'Operational',
  },
  {
    id: 'BUS-501',
    registrationNumber: 'KDG 554R',
    type: 'Bus',
    makeModel: 'Isuzu F330',
    capacity: 65,
    driverName: 'William Ochieng',
    mileage: '28,900 km',
    fuelLevel: 95,
    lastServiceDate: '2026-08-25',
    nextServiceDate: '2026-11-28',
    status: 'Operational',
  },
];

export default function FleetOverviewPage() {
  const [fleet, setFleet] = useState<FleetVehicle[]>(initialFleet);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, status, and vehicle type
  const filteredFleet = fleet.filter((vehicle) => {
    const matchesSearch =
      vehicle.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.makeModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.driverName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'All' || vehicle.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: FleetVehicle['status']) => {
    switch (status) {
      case 'Operational':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Service Due':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Maintenance':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Out of Service':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Helper for fuel level bar color
  const getFuelColor = (level: number) => {
    if (level <= 20) return 'bg-rose-500';
    if (level <= 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const openServiceModal = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
    setServiceModalOpen(true);
  };

  const handleScheduleService = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner(`Maintenance inspection successfully scheduled for ${selectedVehicle?.id} (${selectedVehicle?.registrationNumber}).`);
    setServiceModalOpen(false);
    setSelectedVehicle(null);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Fleet Overview & Maintenance
          </h1>
          <p className="text-sm text-slate-500">
            Monitor real-time vehicle status, track mileage, fuel levels, and schedule preventive maintenance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/transport/routes"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-route mr-2 text-xs text-blue-600"></i> Route Directory
          </Link>
          <Link
            href="/dashboard/transport/vehicles"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Vehicle Inventory
          </Link>
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

      {/* Fleet KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fleet Readiness</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-shield-halved text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">87.5%</p>
          <span className="text-xs text-emerald-600 font-medium">21 of 24 vehicles operational</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Due Soon</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
          <span className="text-xs text-amber-600 font-medium">Scheduled within 14 days</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Maintenance</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-wrench text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">2</p>
          <span className="text-xs text-blue-600 font-medium">Currently in garage workshop</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Fuel Economy</p>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <i className="fa-solid fa-gas-pump text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">4.2 km/L</p>
          <span className="text-xs text-indigo-600 font-medium">Optimal consumption rate</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search fleet ID, license plate, model, driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Bus">Bus</option>
              <option value="Minibus">Minibus</option>
              <option value="Van">Van</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Health Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Operational">Operational</option>
              <option value="Service Due">Service Due</option>
              <option value="In Maintenance">In Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fleet Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Vehicle Identifier</th>
                <th className="py-3 px-4">Driver & Mileage</th>
                <th className="py-3 px-4">Fuel Level</th>
                <th className="py-3 px-4">Service Schedule</th>
                <th className="py-3 px-4">Health Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredFleet.length > 0 ? (
                filteredFleet.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <i className="fa-solid fa-bus text-slate-400"></i> {vehicle.id}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="font-mono bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2">
                          {vehicle.registrationNumber}
                        </span>
                        <span>• {vehicle.makeModel} ({vehicle.capacity} seats)</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                        <i className="fa-solid fa-user text-slate-400 text-[11px]"></i> {vehicle.driverName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Odometer: {vehicle.mileage}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-32">
                        <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                          <span className="text-slate-500">Fuel</span>
                          <span className="font-semibold text-slate-900">{vehicle.fuelLevel}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full ${getFuelColor(vehicle.fuelLevel)}`}
                            style={{ width: `${vehicle.fuelLevel}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs text-slate-900 font-medium">
                        Next: <span className="font-mono font-semibold">{vehicle.nextServiceDate}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Last: {vehicle.lastServiceDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openServiceModal(vehicle)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        Schedule Service
                      </button>
                      <button className="text-slate-600 hover:text-slate-800 font-medium text-xs px-2 py-1 rounded hover:bg-slate-100 transition-colors">
                        Logs
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No fleet vehicles found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Service Modal */}
      {serviceModalOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Schedule Maintenance Service</h3>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">Selected Vehicle</span>
                <span className="text-xs font-mono font-semibold text-blue-600">{selectedVehicle.id}</span>
              </div>
              <div className="font-bold text-slate-900">{selectedVehicle.makeModel} — {selectedVehicle.registrationNumber}</div>
              <div className="text-xs text-slate-500 mt-1">Current Mileage: {selectedVehicle.mileage}</div>
            </div>

            <form onSubmit={handleScheduleService} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Service Type
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Routine Service">Routine Oil & Filter Change</option>
                    <option value="Brake Inspection">Brake & Suspension Inspection</option>
                    <option value="Tire Replacement">Tire Replacement & Alignment</option>
                    <option value="Major Overhaul">Engine Major Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    required
                    defaultValue={selectedVehicle.nextServiceDate}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Service Provider / Workshop
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Isuzu Kenya Authorized Service Center"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Estimated Cost ($)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 450.00"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Technician Instructions / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Specific maintenance tasks, known issues or driver observations..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  Confirm Service Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}