import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { AdminStatusBadge } from '../components/AdminStatusBadge';
import {
  adminStaff,
  formatCurrency,
  formatDate,
  getInitials,
  getServiceMeta,
  toISODate,
  type AdminBooking,
} from '../lib/adminData';
import { apiUrl } from '../lib/api';

const tokenHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  'Content-Type': 'application/json',
});

const sortByTime = (bookings: AdminBooking[]) =>
  [...bookings].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

export const AdminDashboard = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState('');
  const [notice, setNotice] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchBookings = async () => {
      try {
        const response = await fetch(apiUrl('/api/bookings'), {
          headers: tokenHeaders(),
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch bookings');
        }

        const data = (await response.json()) as AdminBooking[];
        if (isMounted) {
          setBookings(data || []);
        }
      } catch {
        if (isMounted) {
          setNotice('Unable to load live bookings. Check that the backend is running.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const todayISO = toISODate(new Date());
  const rawSearchQuery = (searchParams.get('q') || '').trim();
  const searchQuery = rawSearchQuery.toLowerCase();
  const matchesSearch = (booking: AdminBooking) =>
    !searchQuery ||
    [booking.customerName, booking.customerEmail, booking.customerPhone, booking.service, booking.barber, booking.date, booking.time, booking.status]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery);

  const searchResults = sortByTime(bookings.filter((booking) => matchesSearch(booking)));
  const searchMode = rawSearchQuery.length > 0;

  const todayBookings = sortByTime(bookings.filter((booking) => booking.date === todayISO && matchesSearch(booking)));
  const activeToday = todayBookings.filter((booking) => booking.status !== 'cancelled');
  const upcomingBookings = sortByTime(
    bookings.filter((booking) => booking.date > todayISO && booking.status !== 'cancelled' && matchesSearch(booking)),
  );

  const projectedRevenue = activeToday.reduce((sum, booking) => sum + getServiceMeta(booking.service).price, 0);
  const unassigned = activeToday.filter((booking) => booking.barber === 'Unassigned').length;
  const nextBooking = activeToday[0]?.time ?? 'Clear';
  const dashboardMetrics = [
    { label: 'Today', value: String(activeToday.length), detail: `${confirmedCount(todayBookings)} confirmed` },
    { label: 'Upcoming', value: String(upcomingBookings.length), detail: 'Future bookings' },
    { label: 'Unassigned', value: String(unassigned), detail: 'Needs barber' },
    { label: 'Next Chair', value: nextBooking, detail: activeToday[0]?.customerName ?? 'No queue' },
    { label: 'Revenue', value: formatCurrency(projectedRevenue), detail: 'Projected today' },
  ];

  const updateBookingBarber = (bookingId: string, barber: string) => {
    setBookings((current) =>
      current.map((booking) => (booking.id === bookingId ? { ...booking, barber } : booking)),
    );
  };

  const handleAssignBarber = async (booking: AdminBooking, barber: string) => {
    if (barber === booking.barber) {
      return;
    }

    setAssigningId(booking.id);
    setNotice('');

    try {
      const response = await fetch(apiUrl('/api/bookings/assign-barber'), {
        method: 'PATCH',
        headers: tokenHeaders(),
        body: JSON.stringify({ id: booking.id, barber }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Could not assign barber.');
      }

      updateBookingBarber(booking.id, barber);
      setNotice(`${booking.customerName} assigned to ${barber}.`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not assign barber.');
    } finally {
      setAssigningId('');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 font-label-caps text-label-caps uppercase text-primary-container">Command Center</p>
            <h1 className="font-h2 text-3xl text-on-surface">{searchMode ? 'Search Results' : 'Admin Dashboard'}</h1>
            <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
              {searchMode
                ? `Showing matches for “${rawSearchQuery}”.`
                : 'A tighter overview focused on today’s booked chairs and staffing decisions.'}
            </p>
          </div>
          {!searchMode && (
            <Link
              className="inline-flex items-center justify-center gap-2 bg-primary-container px-4 py-3 font-button text-button uppercase text-on-primary-container transition-colors hover:bg-primary"
              to="/admin/appointments"
            >
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              Manage Schedule
            </Link>
          )}
        </section>

        {notice && (
          <div className="border border-outline-variant bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
            {notice}
          </div>
        )}

        {searchMode ? (
          <section className="border border-outline-variant bg-surface-container">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-high px-4 py-3">
              <div>
                <h2 className="font-h3 text-xl text-on-surface">Matching bookings</h2>
                <p className="text-xs text-on-surface-variant">Only the component you searched for is shown here.</p>
              </div>
              <span className="font-label-caps text-label-caps uppercase text-outline">
                {searchResults.length} found
              </span>
            </div>

            <div className="divide-y divide-outline-variant">
              {searchResults.length === 0 ? (
                <div className="px-4 py-8 text-center text-on-surface-variant">
                  No bookings matched “{rawSearchQuery}”.
                </div>
              ) : (
                searchResults.map((booking) => {
                  const service = getServiceMeta(booking.service);
                  const isUpcoming = booking.date > todayISO;
                  return (
                    <article
                      key={booking.id}
                      className="grid gap-3 px-4 py-3 transition-colors hover:bg-surface-container-high md:grid-cols-[92px_1fr_180px_120px] md:items-center"
                    >
                      <div>
                        <p className="font-button text-button text-on-surface">{formatDate(booking.date)}</p>
                        <p className="font-label-caps text-[10px] uppercase text-outline">{booking.time}</p>
                      </div>

                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-background font-button text-xs text-primary-container">
                          {getInitials(booking.customerName)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-body-md font-semibold text-on-surface">{booking.customerName}</p>
                          <p className="truncate text-xs text-on-surface-variant">
                            {booking.service} / {formatCurrency(service.price)}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-on-surface-variant md:text-right">
                        <p>{isUpcoming ? 'Upcoming booking' : 'Today booking'}</p>
                        <p className="font-label-caps text-[10px] uppercase text-outline">
                          {booking.barber === 'Unassigned' ? 'Awaiting barber' : booking.barber}
                        </p>
                      </div>

                      <div className="md:text-right">
                        <AdminStatusBadge status={booking.status} />
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {dashboardMetrics.map((metric) => (
                <article key={metric.label} className="border border-outline-variant bg-surface-container-low p-4">
                  <p className="font-label-caps text-[10px] uppercase text-outline">{metric.label}</p>
                  <p className="mt-2 truncate font-h3 text-2xl text-on-surface">{metric.value}</p>
                  <p className="mt-1 truncate text-xs text-on-surface-variant">{metric.detail}</p>
                </article>
              ))}
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
              <div className="border border-outline-variant bg-surface-container">
                <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-high px-4 py-3">
                  <div>
                    <h2 className="font-h3 text-xl text-on-surface">Today’s Booking Appointments</h2>
                    <p className="text-xs text-on-surface-variant">{formatDate(todayISO)}</p>
                  </div>
                  {loading && <span className="font-label-caps text-label-caps uppercase text-outline">Syncing</span>}
                </div>

                <div className="divide-y divide-outline-variant">
                  {todayBookings.length === 0 ? (
                    <div className="px-4 py-8 text-center text-on-surface-variant">
                      No booked appointments for today.
                    </div>
                  ) : (
                    todayBookings.slice(0, 6).map((booking) => {
                      const service = getServiceMeta(booking.service);
                      return (
                        <article
                          key={booking.id}
                          className="grid gap-3 px-4 py-3 transition-colors hover:bg-surface-container-high md:grid-cols-[84px_1fr_180px_120px] md:items-center"
                        >
                          <div>
                            <p className="font-button text-button text-on-surface">{booking.time}</p>
                            <p className="font-label-caps text-[10px] uppercase text-outline">{service.durationMinutes} min</p>
                          </div>

                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-background font-button text-xs text-primary-container">
                              {getInitials(booking.customerName)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-body-md font-semibold text-on-surface">{booking.customerName}</p>
                              <p className="truncate text-xs text-on-surface-variant">
                                {booking.service} / {formatCurrency(service.price)}
                              </p>
                            </div>
                          </div>

                          <select
                            aria-label={`Assign barber for ${booking.customerName}`}
                            className="w-full border border-outline-variant bg-background px-3 py-2 text-sm text-on-surface outline-none transition-colors focus:border-primary disabled:opacity-60"
                            disabled={assigningId === booking.id || booking.status === 'cancelled'}
                            onChange={(event) => handleAssignBarber(booking, event.target.value)}
                            value={booking.barber || 'Unassigned'}
                          >
                            <option value="Unassigned">Unassigned</option>
                            {adminStaff.map((member) => (
                              <option key={member.id} value={member.name}>
                                {member.name}
                              </option>
                            ))}
                          </select>

                          <div className="md:text-right">
                            <AdminStatusBadge status={booking.status} />
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>

              <aside className="border border-outline-variant bg-surface-container p-4">
                <h2 className="font-h3 text-xl text-on-surface">Operational Checks</h2>
                <p className="mb-4 text-sm text-on-surface-variant">What needs attention before the next chair.</p>
                <div className="space-y-3">
                  <CheckRow
                    label="Same-day public bookings"
                    status="Blocked"
                    tone="good"
                  />
                  <CheckRow
                    label="Confirmed slot conflicts"
                    status={hasConflicts(activeToday) ? 'Review' : 'Clear'}
                    tone={hasConflicts(activeToday) ? 'warn' : 'good'}
                  />
                  <CheckRow
                    label="Unassigned appointments"
                    status={`${activeToday.filter((booking) => booking.barber === 'Unassigned').length}`}
                    tone={activeToday.some((booking) => booking.barber === 'Unassigned') ? 'warn' : 'good'}
                  />
                  <CheckRow label="Live data sync" status={loading ? 'Syncing' : 'Live'} tone={loading ? 'warn' : 'good'} />
                </div>
              </aside>
            </section>

            <section className="border border-outline-variant bg-surface-container">
              <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-high px-4 py-3">
                <div>
                  <h2 className="font-h3 text-xl text-on-surface">Upcoming Bookings</h2>
                  <p className="text-xs text-on-surface-variant">Future appointments pulled from live booking data</p>
                </div>
                <span className="font-label-caps text-label-caps uppercase text-outline">
                  {upcomingBookings.length} scheduled
                </span>
              </div>

              <div className="divide-y divide-outline-variant">
                {upcomingBookings.length === 0 ? (
                  <div className="px-4 py-8 text-center text-on-surface-variant">
                    No upcoming appointments on the schedule.
                  </div>
                ) : (
                  upcomingBookings.slice(0, 6).map((booking) => {
                    const service = getServiceMeta(booking.service);
                    return (
                      <article
                        key={booking.id}
                        className="grid gap-3 px-4 py-3 transition-colors hover:bg-surface-container-high md:grid-cols-[92px_1fr_180px_120px] md:items-center"
                      >
                        <div>
                          <p className="font-button text-button text-on-surface">{formatDate(booking.date)}</p>
                          <p className="font-label-caps text-[10px] uppercase text-outline">{booking.time}</p>
                        </div>

                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-background font-button text-xs text-primary-container">
                            {getInitials(booking.customerName)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-body-md font-semibold text-on-surface">{booking.customerName}</p>
                            <p className="truncate text-xs text-on-surface-variant">
                              {booking.service} / {formatCurrency(service.price)}
                            </p>
                          </div>
                        </div>

                        <div className="text-sm text-on-surface-variant md:text-right">
                          <p>{booking.barber === 'Unassigned' ? 'Awaiting barber' : booking.barber}</p>
                          <p className="font-label-caps text-[10px] uppercase text-outline">
                            {service.durationMinutes} min
                          </p>
                        </div>

                        <div className="md:text-right">
                          <AdminStatusBadge status={booking.status} />
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

const confirmedCount = (bookings: AdminBooking[]) =>
  bookings.filter((booking) => booking.status === 'confirmed').length;

const hasConflicts = (bookings: AdminBooking[]) => {
  const keys = new Set<string>();
  for (const booking of bookings) {
    if (booking.barber === 'Unassigned' || booking.status === 'cancelled') {
      continue;
    }
    const key = `${booking.date}-${booking.time}-${booking.barber}`;
    if (keys.has(key)) {
      return true;
    }
    keys.add(key);
  }
  return false;
};

const CheckRow = ({ label, status, tone }: { label: string; status: string; tone: 'good' | 'warn' }) => (
  <div className="flex items-center justify-between border-b border-outline-variant pb-3 last:border-b-0 last:pb-0">
    <span className="text-sm text-on-surface-variant">{label}</span>
    <span className={['font-label-caps text-label-caps uppercase', tone === 'good' ? 'text-green-500' : 'text-primary-container'].join(' ')}>
      {status}
    </span>
  </div>
);
