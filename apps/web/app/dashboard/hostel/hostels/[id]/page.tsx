// apps/web/app/dashboard/hostel/hostels/[id]/page.tsx
export const runtime = 'edge';
import Link from 'next/link';

/* ==========================================================================
   MOCK DATA FOR HST-BLK-02 (Kilimanjaro House)
   ========================================================================== */

const HOSTEL_DETAILS = {
  id: 'HST-BLK-02',
  name: 'Kilimanjaro House',
  gender: 'Girls Wing',
  capacity: 96,
  occupied: 92,
  vacant: 4,
  roomsCount: 24,
  floors: 3,
  matron: 'Mrs. Grace Mutuku',
  assistantMatron: 'Ms. Beatrice Chebet',
  houseCaptain: 'Faith Wanjiku (Form 4 West)',
  status: 'Active',
  description: 'Kilimanjaro House is a three-story girls dormitory housing Form 3 and Form 4 boarders. Equipped with modern study lounges and solar hot water systems.',
  amenities: [
    'Study Hall & Library',
    'Solar Hot Water Showers',
    'High-Speed Wi-Fi',
    'In-house Laundry Room',
    '24/7 Security & CCTV',
    'Indoor Games Room',
  ],
};

const STATS = [
  {
    title: 'Occupancy Rate',
    value: '95.8%',
    subtext: '92 / 96 Beds Allocated',
    icon: 'fa-bed',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Total Rooms',
    value: '24 Rooms',
    subtext: '8 Rooms per Floor (4 Beds/Room)',
    icon: 'fa-door-open',
    color: 'from-[#012E54] to-[#006FBF]',
  },
  {
    title: 'Vacant Spaces',
    value: '4 Beds',
    subtext: 'Ready for Immediate Check-in',
    icon: 'fa-user-plus',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Maintenance Issues',
    value: '1 Active',
    subtext: 'Plumbing repair in Room A-204',
    icon: 'fa-wrench',
    color: 'from-amber-500 to-amber-600',
  },
];

const ROOMS_LIST = [
  {
    roomNumber: 'Room A-101',
    floor: 'Ground Floor',
    capacity: 4,
    occupied: 4,
    status: 'Full',
    occupants: ['Faith Wanjiku', 'Mercy Njeri', 'Esther Akinyi', 'Sharon Jelagat'],
  },
  {
    roomNumber: 'Room A-102',
    floor: 'Ground Floor',
    capacity: 4,
    occupied: 3,
    status: 'Available',
    occupants: ['Jane Doe', 'Mary Kamau', 'Anita Mwangi'],
  },
  {
    roomNumber: 'Room A-201',
    floor: '1st Floor',
    capacity: 4,
    occupied: 4,
    status: 'Full',
    occupants: ['Amina Mohamed', 'Joy Chebet', 'Lilian Nduta', 'Patricia Otieno'],
  },
  {
    roomNumber: 'Room A-204',
    floor: '1st Floor',
    capacity: 4,
    occupied: 3,
    status: 'Maintenance',
    occupants: ['Faith Wanjiku', 'Catherine Korir', 'Ruth Macharia'],
  },
  {
    roomNumber: 'Room A-301',
    floor: '2nd Floor',
    capacity: 4,
    occupied: 4,
    status: 'Full',
    occupants: ['Brenda Cherono', 'Sera Mutua', 'Gladys Omwamba', 'Daisy Anyango'],
  },
  {
    roomNumber: 'Room A-305',
    floor: '2nd Floor',
    capacity: 4,
    occupied: 2,
    status: 'Available',
    occupants: ['Hellen Wangari', 'Vivian Koech'],
  },
];

const MAINTENANCE_LOGS = [
  {
    id: 'MNT-2026-088',
    room: 'Room A-204',
    issue: 'Leaking bathroom shower valve',
    priority: 'High',
    reportedDate: 'Oct 02, 2026',
    status: 'In Progress',
    assignedTo: 'John Maintenance',
  },
  {
    id: 'MNT-2026-072',
    room: 'Room A-102',
    issue: 'Window latch replacement',
    priority: 'Low',
    reportedDate: 'Sep 24, 2026',
    status: 'Completed',
    assignedTo: 'Samuel Carpentry',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HostelDetailPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          BREADCRUMBS & HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/dashboard/hostel" className="hover:text-[#006FBF]">
            Hostel
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
          <Link href="/dashboard/hostel/hostels" className="hover:text-[#006FBF]">
            Hostels Directory
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
          <span className="text-slate-900">{HOSTEL_DETAILS.name}</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#006FBF] to-[#04B1D6] text-white shadow-md">
              <i className="fa-solid fa-building-user text-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {HOSTEL_DETAILS.name}
                </h1>
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  {HOSTEL_DETAILS.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {HOSTEL_DETAILS.gender} &bull; Ref ID: {HOSTEL_DETAILS.id} &bull; {HOSTEL_DETAILS.floors} Floors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-pen-to-square mr-2 text-slate-400" />
              Edit Block Specs
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-plus mr-2" />
              Assign Student
            </button>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          STATS GRID
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.title}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {stat.title}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </span>
                </div>
              </div>
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-inner`}
              >
                <i className={`fa-solid ${stat.icon} text-lg`} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------------------------
          BLOCK OVERVIEW & STAFF INFO
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Description & Amenities */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">About {HOSTEL_DETAILS.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {HOSTEL_DETAILS.description}
          </p>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Amenities & Facilities
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {HOSTEL_DETAILS.amenities.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-200/60"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100/60 text-[#006FBF]">
                  <i className="fa-solid fa-check text-xs" />
                </div>
                <span className="text-sm font-medium text-slate-800">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Staff & Leadership Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hostel Leadership</h2>
            <p className="mt-1 text-xs text-slate-500">Assigned patrons and student leadership.</p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                  GM
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Matron in Charge</p>
                  <p className="text-sm font-bold text-slate-900">{HOSTEL_DETAILS.matron}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                  BC
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Assistant Matron</p>
                  <p className="text-sm font-bold text-slate-900">{HOSTEL_DETAILS.assistantMatron}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-[#006FBF]">
                  FW
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">House Captain (Prefect)</p>
                  <p className="text-sm font-bold text-slate-900">{HOSTEL_DETAILS.houseCaptain}</p>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100">
            Contact Dorm Supervisors
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          ROOM ALLOCATIONS GRID
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Rooms & Bed Breakdown</h2>
            <p className="text-xs text-slate-500">Overview of room status and assigned occupants.</p>
          </div>

          <div className="flex items-center gap-2">
            <select className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]">
              <option value="all">All Floors</option>
              <option value="ground">Ground Floor</option>
              <option value="1st">1st Floor</option>
              <option value="2nd">2nd Floor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ROOMS_LIST.map((room) => (
            <div
              key={room.roomNumber}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">{room.roomNumber}</span>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      room.status === 'Full'
                        ? 'bg-slate-100 text-slate-700 ring-slate-500/20'
                        : room.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                        : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                    }`}
                  >
                    {room.status}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {room.floor} &bull; Occupancy: {room.occupied}/{room.capacity}
                </p>

                <div className="mt-4 space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Occupants
                  </p>
                  {room.occupants.map((name, idx) => (
                    <div key={idx} className="flex items-center text-xs font-medium text-slate-700">
                      <i className="fa-solid fa-bed mr-2 text-[10px] text-slate-400" />
                      {name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3">
                <span className="text-[11px] text-slate-400">4 Bed Capacity</span>
                <button className="text-xs font-semibold text-[#006FBF] hover:underline">
                  Manage Beds &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          MAINTENANCE LOGS SECTION
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Block Maintenance Work Orders</h2>
            <p className="text-xs text-slate-500">Active and recent repair tickets for Kilimanjaro House.</p>
          </div>
          <button className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
            Log New Issue
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ticket ID & Room
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Issue Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Assigned Technician
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {MAINTENANCE_LOGS.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                    {ticket.room}
                    <p className="text-xs font-normal text-slate-500">{ticket.id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {ticket.issue}
                    <p className="text-xs text-slate-400">Reported: {ticket.reportedDate}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        ticket.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {ticket.assignedTo}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        ticket.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}