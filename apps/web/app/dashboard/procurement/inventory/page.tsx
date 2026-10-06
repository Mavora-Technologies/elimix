'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for an Inventory Item
interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Lab Equipment' | 'IT Hardware' | 'Athletics Gear' | 'Office Supplies' | 'Maintenance';
  quantity: number;
  reorderPoint: number;
  unitCost: string;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

// Initial mock data for inventory items
const initialInventory: InventoryItem[] = [
  {
    id: 'INV-001',
    sku: 'SCI-MIC-001',
    name: 'Advanced Binocular Microscope',
    category: 'Lab Equipment',
    quantity: 14,
    reorderPoint: 5,
    unitCost: '$450.00',
    location: 'Building A, Science Storeroom 2',
    status: 'In Stock',
  },
  {
    id: 'INV-002',
    sku: 'IT-WIFI-700',
    name: 'Enterprise Wi-Fi 7 Access Point',
    category: 'IT Hardware',
    quantity: 3,
    reorderPoint: 5,
    unitCost: '$475.00',
    location: 'Server Room B, Rack 4',
    status: 'Low Stock',
  },
  {
    id: 'INV-003',
    sku: 'ATH-BASK-022',
    name: 'Varsity Basketball Uniform Kit',
    category: 'Athletics Gear',
    quantity: 28,
    reorderPoint: 10,
    unitCost: '$64.00',
    location: 'Gymnasium Equipment Cage',
    status: 'In Stock',
  },
  {
    id: 'INV-004',
    sku: 'OFF-CHAIR-90',
    name: 'Ergonomic Mesh Office Chair',
    category: 'Office Supplies',
    quantity: 0,
    reorderPoint: 4,
    unitCost: '$300.00',
    location: 'Main Warehouse, Bay 3',
    status: 'Out of Stock',
  },
  {
    id: 'INV-005',
    sku: 'FAC-FLT-20',
    name: 'HVAC Air Filter Replacement (20x25x1)',
    category: 'Maintenance',
    quantity: 45,
    reorderPoint: 15,
    unitCost: '$42.50',
    location: 'Facilities Workshop, Shelf C',
    status: 'In Stock',
  },
];

export default function ProcurementInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, category, and status
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Low Stock':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Out of Stock':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New inventory item successfully registered in warehouse catalog.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Warehouse Inventory & Stock Management
          </h1>
          <p className="text-sm text-slate-500">
            Monitor real-time stock levels, track SKU storage locations, and manage replenishment thresholds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/procurement/grn"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-clipboard-check mr-2 text-xs text-blue-600"></i> View GRNs
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Add Inventory Item
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active SKUs</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-boxes-stacked text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">1,248</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Catalog active</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Alerts</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">14</p>
          <span className="text-xs text-amber-600 font-medium">Requires reordering soon</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Out of Stock</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-ban text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
          <span className="text-xs text-rose-600 font-medium">Restock order pending</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Inventory Value</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-vault text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$348,900</p>
          <span className="text-xs text-purple-600 font-medium">Audited warehouse valuation</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search SKU, item name, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="IT Hardware">IT Hardware</option>
              <option value="Athletics Gear">Athletics Gear</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Maintenance">Maintenance</option>
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
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">SKU / Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Unit Cost</th>
                <th className="py-3 px-4">Warehouse Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 font-mono text-xs">{item.sku}</div>
                      <div className="text-xs text-slate-800 font-medium">{item.name}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">{item.category}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs font-bold text-slate-900">{item.quantity} units</div>
                      <div className="text-[11px] text-slate-500">Reorder at: {item.reorderPoint}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 font-mono text-xs font-bold">{item.unitCost}</td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs font-mono">{item.location}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Restock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No matching inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inventory Item Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Register New Inventory Item</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LAB-BEAK-500"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Lab Equipment">Lab Equipment</option>
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Athletics Gear">Athletics Gear</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Borosilicate Glass Beaker Set"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Initial Qty
                  </label>
                  <input
                    type="number"
                    required
                    defaultValue={10}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Reorder Point
                  </label>
                  <input
                    type="number"
                    required
                    defaultValue={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Unit Cost ($)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $45.00"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Warehouse Storage Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building A, Shelf 4B"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}