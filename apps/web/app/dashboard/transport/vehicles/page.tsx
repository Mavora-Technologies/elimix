'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Transport Vehicle record
interface VehicleItem {
  id: string;
  registrationNumber: string;
  type: 'Bus' | 'Minibus' | 'Van';
  capacity: number;
  makeModel: string;
  nextServiceDate: string;
  status: 'Active' | 'Maintenance' | 'Out of Service';
  assignedDriver: string;
}

// Initial mock data for the fleet
const initialVehicles: VehicleItem[] = [
  {
    id: 'BUS-402',
    registrationNumber: 'KCX 112L',
    type: 'Bus',
    capacity: 65,
    makeModel: 'Isuzu F330',
    nextServiceDate: '2026-11-15',
    status: 'Active',
    assignedDriver: 'James Omondi',
  },
  {
    id: 'BUS-415',
    registrationNumber: 'KDA 890M',
    type: 'Bus',
    capacity: 50,
    makeModel: 'Mitsubishi Fuso',
    nextServiceDate: '2026-10-22',
    status: 'Active',
    assignedDriver: 'Peter Kamau',
  },
  {
    id: 'BUS-308',
    registrationNumber: 'KCY 445J',
    type: 'Minibus',
    capacity: 33,
    makeModel: 'Toyota Coaster',
    nextServiceDate: '2026-12-05',
    status: 'Active',
    assignedDriver: 'David Mutua',
  },
  {
    id: 'BUS-211',
    registrationNumber: 'KBZ 776K',
    type: 'Minibus',
    capacity: 29,
    makeModel: 'Nissan Civilian',
    nextServiceDate: '2026-10-01',
    status: 'Maintenance',
    assignedDriver: 'Samuel Njoroge',
  },
  {
    id: 'VAN-105',
    registrationNumber: 'KDE 201P',
    type: 'Van',
    capacity: 14,
    makeModel: 'Toyota Hiace',
    nextServiceDate: '2027-01-10',
    status: 'Out of Service',
    assignedDriver: 'Unassigned',
  },
  {
    id: 'BUS-501',
    registrationNumber: 'KDG 554R',
    type: 'Bus',
    capacity: 65,
    makeModel: 'Isuzu F330',
    nextServiceDate: '2026-11-28',
    status: 'Active',
    assignedDriver: 'William Ochieng',
  },
];

export default function TransportVehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleItem[]>(initialVehicles);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, status, and vehicle type
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.makeModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.assignedDriver.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'All' || vehicle.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: VehicleItem['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Maintenance':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Out of Service':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New vehicle has been successfully added to the school fleet.');
    setVehicleModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Fleet & Vehicles
          </h1>
          <p className="text-sm text-slate-500">
            Manage the school's transport fleet, monitor vehicle maintenance, and view capacities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/transport/routes"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-route mr-2 text-xs text-blue-600"></i> Manage Routes
          </Link>
          <button
            onClick={() => setVehicleModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Add New Vehicle
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Fleet</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-bus text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">24</p>
          <span className="text-xs text-blue-600 font-medium">12 Buses • 8 Minibuses • 4 Vans</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Vehicles</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-check-circle text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">21</p>
          <span className="text-xs text-emerald-600 font-medium">Currently operational</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Maintenance</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-wrench text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">2</p>
          <span className="text-xs text-amber-600 font-medium">Expected back this week</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Capacity</p>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <i className="fa-solid fa-users text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">1,040</p>
          <span className="text-xs text-indigo-600 font-medium">Available passenger seats</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search by ID, plate, make, or driver..."
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
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4">Make & Type</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Assigned Driver</th>
                <th className="py-3 px-4">Service & Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-sm">{vehicle.id}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 border border-slate-200 bg-slate-100 rounded px-1.5 py-0.5 inline-block">
                        {vehicle.registrationNumber}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 text-xs">{vehicle.makeModel}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{vehicle.type}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-sm font-semibold text-slate-700">{vehicle.capacity}</span>
                      <span className="text-[11px] text-slate-500 ml-1">seats</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <i className="fa-solid fa-id-card text-slate-400"></i> {vehicle.assignedDriver}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <i className="fa-solid fa-wrench text-[10px]"></i> Next: {vehicle.nextServiceDate}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Edit
                      </button>
                      <button className="text-slate-600 hover:text-slate-800 font-medium text-xs px-2 py-1 rounded hover:bg-slate-100 transition-colors">
                        Log Service
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No vehicles found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Vehicle Modal */}
      {vehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Add New Vehicle to Fleet</h3>
              <button
                onClick={() => setVehicleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleSaveVehicle} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Fleet ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BUS-505"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Registration Plate
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KDH 123A"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Vehicle Type
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Bus">Bus</option>
                    <option value="Minibus">Minibus</option>
                    <option value="Van">Van</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Passenger Capacity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 65"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Make & Model
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Isuzu F330"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Next Maintenance Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Initial Status
                </label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                  <option value="Active">Active</option>
                  <option value="Maintenance">In Maintenance</option>
                  <option value="Out of Service">Out of Service</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVehicleModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}