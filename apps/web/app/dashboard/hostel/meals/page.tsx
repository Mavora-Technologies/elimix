// apps/web/app/dashboard/hostel/meals/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Meals Served Today',
    value: '1,185',
    subtext: 'Breakfast: 405 | Lunch: 402 | Dinner: Expected 378',
    icon: 'fa-utensils',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Special Diet Residents',
    value: '24 Boarders',
    subtext: 'Allergies, Vegetarian, Halal & Medical Diets',
    icon: 'fa-wheat-awn-circle-exclamation',
    color: 'from-amber-500 to-amber-600',
  },
  {
    title: 'Current Service Status',
    value: 'Lunch Service',
    subtext: '12:30 PM - 2:00 PM (Active)',
    icon: 'fa-bowl-rice',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Meal Attendance Rate',
    value: '97.3%',
    subtext: '+1.2% compared to yesterday',
    icon: 'fa-chart-pie',
    color: 'from-[#012E54] to-[#006FBF]',
  },
];

const TODAY_MENU = [
  {
    meal: 'Breakfast',
    time: '06:30 AM - 07:45 AM',
    status: 'Completed',
    mainDish: 'Tea / Coffee / Hot Chocolate & Boiled Eggs',
    sideDish: 'Mandazi / Sweet Potatoes & Porridge',
    specialDietNote: 'Gluten-Free Oats for 3 students',
    servedCount: '405 / 412',
  },
  {
    meal: 'Lunch',
    time: '12:30 PM - 02:00 PM',
    status: 'In Progress',
    mainDish: 'Rice & Beef Stew / Lentil Stew (Veg)',
    sideDish: 'Steamed Cabbage & Fruit (Banana)',
    specialDietNote: 'Halal beef prepared separately in Kitchen B',
    servedCount: '378 / 412',
  },
  {
    meal: 'Dinner',
    time: '06:30 PM - 08:00 PM',
    status: 'Upcoming',
    mainDish: 'Ugali & Fried Fish / Sukuma Wiki (Kale)',
    sideDish: 'Melon Slices & Milk',
    specialDietNote: 'Fish alternative: Beans Stew',
    servedCount: '0 / 412',
  },
];

const MEAL_LOGS = [
  {
    id: 'STU-2024-045',
    studentName: 'Brian Kiprop',
    grade: 'Form 3 Blue',
    hostelBlock: 'Elgon House',
    roomNumber: 'Room B-102',
    dietType: 'Standard',
    allergy: 'None',
    breakfast: 'Served (07:12 AM)',
    lunch: 'Served (01:05 PM)',
    dinner: 'Pending',
    status: 'Present',
  },
  {
    id: 'STU-2024-112',
    studentName: 'Faith Wanjiku',
    grade: 'Form 4 West',
    hostelBlock: 'Kilimanjaro House',
    roomNumber: 'Room A-204',
    dietType: 'Vegetarian',
    allergy: 'Dairy / Lactose Intolerant',
    breakfast: 'Served (07:05 AM)',
    lunch: 'Served (12:45 PM)',
    dinner: 'Pending',
    status: 'Present',
  },
  {
    id: 'STU-2025-089',
    studentName: 'Samuel Ochieng',
    grade: 'Form 2 East',
    hostelBlock: 'Kenya House',
    roomNumber: 'Room K-108',
    dietType: 'Medical (Diabetic)',
    allergy: 'Peanuts',
    breakfast: 'Exeat Leave',
    lunch: 'Exeat Leave',
    dinner: 'Exeat Leave',
    status: 'On Leave',
  },
  {
    id: 'STU-2024-201',
    studentName: 'Amina Mohamed',
    grade: 'Form 4 North',
    hostelBlock: 'Aberdare House',
    roomNumber: 'Room C-301',
    dietType: 'Halal',
    allergy: 'None',
    breakfast: 'Served (07:30 AM)',
    lunch: 'Served (01:15 PM)',
    dinner: 'Pending',
    status: 'Present',
  },
  {
    id: 'STU-2026-014',
    studentName: 'Kevin Mutua',
    grade: 'Form 1 South',
    hostelBlock: 'Elgon House',
    roomNumber: 'Room B-205',
    dietType: 'Standard',
    allergy: 'Shellfish',
    breakfast: 'Missed',
    lunch: 'Missed',
    dinner: 'Pending',
    status: 'Absent',
  },
  {
    id: 'STU-2025-156',
    studentName: 'Joy Chebet',
    grade: 'Form 2 Central',
    hostelBlock: 'Ruwenzori House',
    roomNumber: 'Room R-104',
    dietType: 'Sick Bay Diet',
    allergy: 'None',
    breakfast: 'Served at Sanatorium',
    lunch: 'Served at Sanatorium',
    dinner: 'Pending',
    status: 'Sick Bay',
  },
  {
    id: 'STU-2026-042',
    studentName: 'Ian Kamau',
    grade: 'Form 1 East',
    hostelBlock: 'Tsavo House',
    roomNumber: 'Room T-101',
    dietType: 'Standard',
    allergy: 'Eggs',
    breakfast: 'Served (07:22 AM)',
    lunch: 'Served (01:10 PM)',
    dinner: 'Pending',
    status: 'Present',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HostelMealsPage() {
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
          <span className="text-slate-900">Meals & Dining</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hostel Dining & Meal Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track dining hall attendance, manage weekly menus, and monitor special dietary restrictions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-calendar-days mr-2 text-slate-400" />
              Weekly Menu Plan
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-qrcode mr-2" />
              Scan Meal Pass
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
                  <span className="text-2xl font-bold tracking-tight text-slate-900">
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
          TODAY'S MENU SCHEDULE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Today's Dining Menu & Service Tracking
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Tuesday, Oct 06, 2026
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {TODAY_MENU.map((item) => (
            <div
              key={item.meal}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">{item.meal}</span>
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                      item.status === 'Completed'
                        ? 'bg-slate-100 text-slate-700'
                        : item.status === 'In Progress'
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                        : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                    }`}
                  >
                    {item.status === 'In Progress' && (
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                    {item.status}
                  </span>
                </div>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  <i className="fa-regular fa-clock mr-1 text-slate-400" />
                  {item.time}
                </p>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">Main Course</p>
                    <p className="text-sm font-medium text-slate-800">{item.mainDish}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">Side & Beverage</p>
                    <p className="text-sm text-slate-600">{item.sideDish}</p>
                  </div>
                  {item.specialDietNote && (
                    <div className="rounded-lg bg-amber-50/70 p-2.5 text-xs text-amber-800 ring-1 ring-inset ring-amber-200/50">
                      <i className="fa-solid fa-circle-info mr-1 text-amber-600" />
                      {item.specialDietNote}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Served Count:</span>
                  <span className="font-bold text-slate-900">{item.servedCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          FILTERS & SEARCH
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fa-solid fa-magnifying-glass text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            placeholder="Search boarder name, ID, or allergy..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Dietary Category</option>
            <option value="all">All Diets</option>
            <option value="standard">Standard Diet</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="halal">Halal</option>
            <option value="medical">Medical / Diabetic</option>
            <option value="sickbay">Sick Bay Special</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Hostel Block</option>
            <option value="all">All Blocks</option>
            <option value="elgon">Elgon House</option>
            <option value="kilimanjaro">Kilimanjaro House</option>
            <option value="kenya">Kenya House</option>
            <option value="aberdare">Aberdare House</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Lunch Service Status</option>
            <option value="all">All Statuses</option>
            <option value="served">Served</option>
            <option value="missed">Missed</option>
            <option value="exeat">On Exeat</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          BOARDER MEAL ATTENDANCE TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Boarder Details
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Diet & Allergies
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Breakfast
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Lunch (Active)
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Dinner
                </th>
                <th scope="col" className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {MEAL_LOGS.map((student) => (
                <tr key={student.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        {student.studentName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <Link
                          href={`/dashboard/students/${student.id}`}
                          className="text-sm font-semibold text-slate-900 hover:text-[#006FBF]"
                        >
                          {student.studentName}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {student.hostelBlock} &bull; {student.roomNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center self-start rounded-md px-2 py-0.5 text-xs font-medium ${
                          student.dietType === 'Standard'
                            ? 'bg-slate-100 text-slate-700'
                            : student.dietType === 'Vegetarian' || student.dietType === 'Halal'
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                            : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                        }`}
                      >
                        {student.dietType}
                      </span>
                      {student.allergy !== 'None' && (
                        <p className="text-[11px] font-semibold text-rose-600">
                          <i className="fa-solid fa-triangle-exclamation mr-1" />
                          {student.allergy}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center text-xs font-medium ${
                        student.breakfast.includes('Served')
                          ? 'text-emerald-600'
                          : student.breakfast.includes('Exeat')
                          ? 'text-slate-400'
                          : 'text-rose-600'
                      }`}
                    >
                      {student.breakfast.includes('Served') && (
                        <i className="fa-solid fa-circle-check mr-1.5" />
                      )}
                      {student.breakfast}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        student.lunch.includes('Served')
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : student.lunch.includes('Exeat')
                          ? 'bg-slate-100 text-slate-600 ring-slate-500/20'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20'
                      }`}
                    >
                      {student.lunch}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-400">
                    {student.dinner}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors"
                        title="Manual Meal Entry"
                      >
                        <i className="fa-solid fa-check mr-1.5" />
                        Log Meal
                      </button>
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Edit Dietary Preferences">
                        <i className="fa-solid fa-pen-to-square" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">7</span> of <span className="font-semibold">412</span> boarder meal logs
          </p>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
              Previous
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}