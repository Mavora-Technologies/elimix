// apps/web/app/dashboard/transport/vehicle/page.tsx
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

  // Filter logic
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

  // Status badge styling
  const getStatusBadge = (status: VehicleItem['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Maintenance':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Out of Service':
        return 'bg-rose-50 text-rose-800 border-rose-200';
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
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#012E54]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#012E54] mb-1 tracking-tight">
            Fleet & Vehicles
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Manage the school's transport fleet, monitor vehicle maintenance, and view capacities.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/transport/routes"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-route mr-2 text-xs text-[#006FBF]"></i> Manage Routes
          </Link>
          <button
            onClick={() => setVehicleModalOpen(true)}
            className="h-[38px] px-4 rounded-xl text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Add New Vehicle
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Fleet</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">24</h3>
            <span className="text-[11px] text-[#006FBF] font-semibold mt-1 block">12 Buses • 8 Minibuses • 4 Vans</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#006FBF] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-bus text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Active Vehicles</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">21</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Currently operational</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-check-circle text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">In Maintenance</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">2</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Expected back this week</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-wrench text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Capacity</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">1,040</h3>
            <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">Available passenger seats</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-users text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search by ID, plate, make, or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Bus">Bus</option>
              <option value="Minibus">Minibus</option>
              <option value="Van">Van</option>
            </select>
          </div>

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
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Vehicle Details</th>
                <th className="py-3.5 px-5">Make & Type</th>
                <th className="py-3.5 px-5">Capacity</th>
                <th className="py-3.5 px-5">Assigned Driver</th>
                <th className="py-3.5 px-5">Service & Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#012E54] text-[13px]">{vehicle.id}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5 border border-[#cbd5e1] bg-slate-100 rounded px-1.5 py-0.5 inline-block">
                        {vehicle.registrationNumber}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-[#012E54] text-[12px]">{vehicle.makeModel}</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">{vehicle.type}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-mono text-[13px] font-bold text-[#012E54]">{vehicle.capacity}</span>
                      <span className="text-[11px] text-[#64748b] ml-1">seats</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#012E54] font-medium">
                        <i className="fa-solid fa-id-card text-slate-400"></i> {vehicle.assignedDriver}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                        <div className="text-[11px] text-[#64748b] flex items-center gap-1 mt-0.5 font-mono">
                          <i className="fa-solid fa-wrench text-[10px]"></i> Next: {vehicle.nextServiceDate}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#006FBF] hover:bg-sky-100 font-semibold text-[12px] transition-colors">
                        Edit
                      </button>
                      <button className="h-[32px] px-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[12px] transition-colors">
                        Log Service
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b] text-[13px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012E54]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#012E54] text-[15px]">Add New Vehicle to Fleet</h3>
              <button
                onClick={() => setVehicleModalOpen(false)}
                className="text-slate-400 hover:text-[#012E54] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleSaveVehicle} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Fleet ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BUS-505"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Registration Plate
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KDH 123A"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Vehicle Type
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]">
                    <option value="Bus">Bus</option>
                    <option value="Minibus">Minibus</option>
                    <option value="Van">Van</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Passenger Capacity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 65"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Make & Model
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Isuzu F330"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Next Maintenance Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                  Initial Status
                </label>
                <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]">
                  <option value="Active">Active</option>
                  <option value="Maintenance">In Maintenance</option>
                  <option value="Out of Service">Out of Service</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setVehicleModalOpen(false)}
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