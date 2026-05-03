import { AdminLayout } from '../components/AdminLayout';
import { AdminStatusBadge } from '../components/AdminStatusBadge';
import { adminStaff } from '../lib/adminData';

const statusDotClasses: Record<string, string> = {
  available: 'bg-green-500',
  'in-service': 'bg-primary-container',
  'off-duty': 'bg-surface-variant',
};

const scheduleRows = [
  { day: 'Mon', marcus: '9A-5P', elias: '10A-6P', julian: 'Off', arthur: '9A-6P' },
  { day: 'Tue', marcus: '9A-5P', elias: '10A-6P', julian: '11A-7P', arthur: 'Off' },
  { day: 'Wed', marcus: 'Off', elias: '9A-5P', julian: '11A-7P', arthur: '9A-6P' },
];

export const AdminStaff = () => {
  const activeStaff = adminStaff.filter((member) => member.status !== 'off-duty').length;
  const totalBookings = adminStaff.reduce((sum, member) => sum + member.bookingsToday, 0);

  return (
    <AdminLayout>
      <div className="space-y-section-gap">
        <section className="flex flex-col justify-between gap-stack-md border-b border-surface-container-high pb-stack-lg md:flex-row md:items-end">
          <div>
            <p className="mb-stack-sm font-label-caps text-label-caps uppercase text-primary-container">Staff</p>
            <h1 className="font-h2 text-h2 text-on-surface">Staff Management</h1>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
              Oversee barber profiles, specialties, and schedules.
            </p>
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-primary-container px-5 py-3 font-button text-button uppercase text-on-primary-container transition-colors hover:bg-primary"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Add Staff
          </button>
        </section>

        <section className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">On Floor</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">{activeStaff}</p>
          </article>
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Today Bookings</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">{totalBookings}</p>
          </article>
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Average Rating</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">
              {(adminStaff.reduce((sum, member) => sum + member.rating, 0) / adminStaff.length).toFixed(1)}
            </p>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-4">
          {adminStaff.map((member) => (
            <article
              key={member.id}
              className="group flex flex-col items-center border border-outline-variant bg-surface-container-low p-stack-lg text-center transition-colors hover:border-primary-container/70"
            >
              <div className="relative mb-stack-md">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-surface-container-high bg-background font-h3 text-h3 text-primary-container transition-colors group-hover:border-primary-container">
                  {member.initials}
                </div>
                <span
                  className={[
                    'absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-surface-container-low',
                    statusDotClasses[member.status],
                  ].join(' ')}
                />
              </div>

              <h2 className="font-h3 text-h3 text-on-surface">{member.name}</h2>
              <p className="mb-stack-sm mt-1 font-body-md text-body-md text-on-surface-variant">
                {member.role} / {member.specialty}
              </p>
              <AdminStatusBadge status={member.status} />

              <div className="my-stack-lg grid w-full grid-cols-2 gap-stack-sm border-y border-outline-variant py-stack-md text-left">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-outline">Next Slot</span>
                  <p className="mt-1 font-body-md text-on-surface">{member.nextSlot}</p>
                </div>
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-outline">Rating</span>
                  <p className="mt-1 font-body-md text-on-surface">{member.rating.toFixed(1)}</p>
                </div>
              </div>

              <div className="mt-auto flex w-full gap-stack-sm">
                <button
                  className="flex flex-1 items-center justify-center gap-2 border border-outline px-3 py-3 font-button text-button uppercase text-on-surface transition-colors hover:border-primary-container hover:text-primary-container"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">event</span>
                  Schedule
                </button>
                <button
                  className="flex flex-1 items-center justify-center gap-2 border border-transparent bg-surface-container px-3 py-3 font-button text-button uppercase text-on-surface transition-colors hover:bg-surface-container-high"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">manage_accounts</span>
                  Manage
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="overflow-hidden border border-outline-variant bg-surface-container">
          <div className="border-b border-outline-variant bg-surface-container-high px-6 py-5">
            <h2 className="font-h3 text-h3 text-on-surface">Weekly Roster</h2>
            <p className="font-body-md text-sm text-on-surface-variant">Core floor coverage by barber.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="px-6 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Day
                  </th>
                  <th className="px-6 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Marcus
                  </th>
                  <th className="px-6 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Elias
                  </th>
                  <th className="px-6 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Julian
                  </th>
                  <th className="px-6 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Arthur
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {scheduleRows.map((row) => (
                  <tr key={row.day} className="transition-colors hover:bg-surface-container-high">
                    <td className="px-6 py-4 font-button text-button text-on-surface">{row.day}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{row.marcus}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{row.elias}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{row.julian}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{row.arthur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminStaff;
