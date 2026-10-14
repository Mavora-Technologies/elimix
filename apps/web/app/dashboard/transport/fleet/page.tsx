// apps/web/app/dashboard/transport/fleet/page.tsx
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

  // Filter logic
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

  // Status badge styling
  const getStatusBadge = (status: FleetVehicle['status']) => {
    switch (status) {
      case 'Operational':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Service Due':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'In Maintenance':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Out of Service':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Fuel level bar color
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
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#012E54]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#012E54] mb-1 tracking-tight">
            Fleet Overview & Maintenance
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Monitor real-time vehicle status, track mileage, fuel levels, and schedule preventive maintenance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/transport/routes"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-route mr-2 text-xs text-[#006FBF]"></i> Route Directory
          </Link>
          <Link
            href="/dashboard/transport/vehicles"
            className="h-[38px] px-4 rounded-xl text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Vehicle Inventory
          </Link>
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

      {/* Fleet KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Fleet Readiness</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">87.5%</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">21 of 24 vehicles operational</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-shield-halved text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Service Due Soon</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">3</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Scheduled within 14 days</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">In Maintenance</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">2</h3>
            <span className="text-[11px] text-[#006FBF] font-semibold mt-1 block">Currently in garage workshop</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#006FBF] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-wrench text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Avg Fuel Economy</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">4.2 km/L</h3>
            <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">Optimal consumption rate</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-gas-pump text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search fleet ID, license plate, model, driver..."
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
            <span>Health Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] cursor-pointer"
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
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Vehicle Identifier</th>
                <th className="py-3.5 px-5">Driver & Mileage</th>
                <th className="py-3.5 px-5">Fuel Level</th>
                <th className="py-3.5 px-5">Service Schedule</th>
                <th className="py-3.5 px-5">Health Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredFleet.length > 0 ? (
                filteredFleet.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#012E54] text-[13px] flex items-center gap-2">
                        <i className="fa-solid fa-bus text-[#006FBF]"></i> {vehicle.id}
                      </div>
                      <div className="text-[11px] text-[#64748b] mt-1 flex items-center gap-2 flex-wrap">
                        <span className="font-mono bg-slate-100 border border-[#cbd5e1] rounded px-1.5 py-0.5 font-bold">
                          {vehicle.registrationNumber}
                        </span>
                        <span>{vehicle.makeModel} ({vehicle.capacity} seats)</span>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-semibold text-[#012E54] text-[12px] flex items-center gap-1.5">
                        <i className="fa-solid fa-user text-slate-400 text-[11px]"></i> {vehicle.driverName}
                      </div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">
                        Odometer: {vehicle.mileage}
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="w-32">
                        <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                          <span className="text-[#64748b]">Fuel</span>
                          <span className="font-bold text-[#012E54]">{vehicle.fuelLevel}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-[#cbd5e1]">
                          <div
                            className={`h-full rounded-full ${getFuelColor(vehicle.fuelLevel)}`}
                            style={{ width: `${vehicle.fuelLevel}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="text-[12px] text-[#012E54] font-semibold">
                        Next: <span className="font-mono">{vehicle.nextServiceDate}</span>
                      </div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">
                        Last: {vehicle.lastServiceDate}
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => openServiceModal(vehicle)}
                        className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#006FBF] hover:bg-sky-100 font-semibold text-[12px] transition-colors"
                      >
                        Schedule Service
                      </button>
                      <button className="h-[32px] px-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[12px] transition-colors">
                        Logs
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b] text-[13px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012E54]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#012E54] text-[15px]">Schedule Maintenance Service</h3>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="text-slate-400 hover:text-[#012E54] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#e2e8f0]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Selected Vehicle</span>
                <span className="text-[11px] font-mono font-bold text-[#006FBF]">{selectedVehicle.id}</span>
              </div>
              <div className="font-bold text-[#012E54] text-[13px]">{selectedVehicle.makeModel} — {selectedVehicle.registrationNumber}</div>
              <div className="text-[11px] text-[#64748b] mt-0.5">Current Mileage: {selectedVehicle.mileage}</div>
            </div>

            <form onSubmit={handleScheduleService} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Service Type
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]">
                    <option value="Routine Service">Routine Oil & Filter Change</option>
                    <option value="Brake Inspection">Brake & Suspension Inspection</option>
                    <option value="Tire Replacement">Tire Replacement & Alignment</option>
                    <option value="Major Overhaul">Engine Major Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    required
                    defaultValue={selectedVehicle.nextServiceDate}
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                  Service Provider / Workshop
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Isuzu Kenya Authorized Service Center"
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                  Estimated Cost (KES)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 58,000.00"
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                  Technician Instructions / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Specific maintenance tasks, known issues or driver observations..."
                  className="w-full rounded-xl border border-[#cbd5e1] p-3 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
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