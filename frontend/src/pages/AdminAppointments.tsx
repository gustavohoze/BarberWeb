import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

export const AdminAppointments = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [selectedBarber, setSelectedBarber] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
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
  const todayBookings = sortByTime(bookings.filter((booking) => booking.date === todayISO));
  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase();

  const filteredBookings = useMemo(
    () =>
      sortByTime(
        bookings.filter((booking) => {
          const searchMatches =
            !searchQuery ||
            [
              booking.customerName,
              booking.customerEmail,
              booking.customerPhone,
              booking.service,
              booking.barber,
              booking.date,
              booking.time,
              booking.status,
            ]
              .join(' ')
              .toLowerCase()
              .includes(searchQuery);
          const dateMatches = selectedDate ? booking.date === selectedDate : true;
          const barberMatches = selectedBarber === 'all' ? true : booking.barber === selectedBarber;
          const statusMatches = selectedStatus === 'all' ? true : booking.status === selectedStatus;
          return searchMatches && dateMatches && barberMatches && statusMatches;
        }),
      ),
    [bookings, selectedBarber, selectedDate, selectedStatus, searchQuery],
  );

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

  const activeToday = todayBookings.filter((booking) => booking.status !== 'cancelled');
  const confirmedToday = todayBookings.filter((booking) => booking.status === 'confirmed').length;
  const unassignedToday = todayBookings.filter((booking) => booking.barber === 'Unassigned').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 font-label-caps text-label-caps uppercase text-primary-container">
              Appointments
            </p>
            <h1 className="font-h2 text-3xl text-on-surface">Today’s Chair Board</h1>
            <p className="mt-2 max-w-2xl font-body-md text-sm text-on-surface-variant">
              Assign barbers, catch conflicts, and keep today’s queue moving.
            </p>
          </div>

          <div className="grid grid-cols-3 border border-outline-variant bg-surface-container">
            {[
              { label: 'Today', value: activeToday.length },
              { label: 'Confirmed', value: confirmedToday },
              { label: 'Unassigned', value: unassignedToday },
            ].map((item) => (
              <div key={item.label} className="min-w-24 border-r border-outline-variant px-4 py-3 last:border-r-0">
                <p className="font-label-caps text-[10px] uppercase text-outline">{item.label}</p>
                <p className="mt-1 font-h3 text-2xl text-on-surface">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {notice && (
          <div className="border border-outline-variant bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
            {notice}
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="border border-outline-variant bg-surface-container">
              <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-high px-4 py-3">
                <div>
                  <h2 className="font-h3 text-xl text-on-surface">Today’s Bookings</h2>
                  <p className="text-xs text-on-surface-variant">{formatDate(todayISO)}</p>
                </div>
                {loading && (
                  <span className="font-label-caps text-label-caps uppercase text-outline">Syncing</span>
                )}
              </div>

              <div className="divide-y divide-outline-variant">
                {todayBookings.length === 0 ? (
                  <div className="px-4 py-8 text-center text-on-surface-variant">
                    No appointments scheduled for today.
                  </div>
                ) : (
                  todayBookings.map((booking) => {
                    const service = getServiceMeta(booking.service);
                    return (
                      <article
                        key={booking.id}
                        className="grid gap-3 px-4 py-3 transition-colors hover:bg-surface-container-high md:grid-cols-[88px_1fr_190px_140px] md:items-center"
                      >
                        <div>
                          <p className="font-button text-button text-on-surface">{booking.time}</p>
                          <p className="font-label-caps text-[10px] uppercase text-outline">
                            {service.durationMinutes} min
                          </p>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-background font-button text-xs text-primary-container">
                              {getInitials(booking.customerName)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-body-md font-semibold text-on-surface">
                                {booking.customerName}
                              </p>
                              <p className="truncate text-xs text-on-surface-variant">
                                {booking.service} / {formatCurrency(service.price)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <label className="relative">
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
                        </label>

                        <div className="md:text-right">
                          <AdminStatusBadge status={booking.status} />
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <aside className="border border-outline-variant bg-surface-container p-4">
            <h2 className="font-h3 text-xl text-on-surface">Barber Load</h2>
            <p className="mb-4 text-sm text-on-surface-variant">Confirmed bookings assigned today.</p>
            <div className="space-y-3">
              {adminStaff.map((member) => {
                const count = todayBookings.filter(
                  (booking) => booking.barber === member.name && booking.status !== 'cancelled',
                ).length;
                const percent = Math.min(count * 25, 100);
                return (
                  <div key={member.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-on-surface">{member.name}</span>
                      <span className="font-label-caps text-label-caps uppercase text-outline">{count}</span>
                    </div>
                    <div className="h-2 bg-surface-container-highest">
                      <div className="h-full bg-primary-container" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </section>

        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <label className="flex flex-col gap-1">
              <span className="font-label-caps text-[10px] uppercase text-outline">Date</span>
              <input
                className="border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface outline-none transition-colors focus:border-primary"
                onChange={(event) => setSelectedDate(event.target.value)}
                type="date"
                value={selectedDate}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-label-caps text-[10px] uppercase text-outline">Barber</span>
              <select
                className="border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface outline-none transition-colors focus:border-primary"
                onChange={(event) => setSelectedBarber(event.target.value)}
                value={selectedBarber}
              >
                <option value="all">All Staff</option>
                <option value="Unassigned">Unassigned</option>
                {adminStaff.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-label-caps text-[10px] uppercase text-outline">Status</span>
              <select
                className="border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface outline-none transition-colors focus:border-primary"
                onChange={(event) => setSelectedStatus(event.target.value)}
                value={selectedStatus}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>

            <div className="flex items-end">
              <button
                className="w-full border border-outline-variant px-3 py-2 font-label-caps text-label-caps uppercase text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                onClick={() => {
                  setSelectedDate('');
                  setSelectedBarber('all');
                  setSelectedStatus('all');
                }}
                type="button"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="overflow-hidden border border-outline-variant bg-surface-container">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-high px-4 py-3">
              <h2 className="font-h3 text-xl text-on-surface">All Appointments</h2>
              <span className="font-label-caps text-label-caps uppercase text-outline">
                {filteredBookings.length} shown
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="px-4 py-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                      Time / Date
                    </th>
                    <th className="px-4 py-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                      Client
                    </th>
                    <th className="px-4 py-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                      Service
                    </th>
                    <th className="px-4 py-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                      Barber
                    </th>
                    <th className="px-4 py-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filteredBookings.map((booking) => {
                    const service = getServiceMeta(booking.service);
                    return (
                      <tr key={booking.id} className="transition-colors hover:bg-surface-container-high">
                        <td className="px-4 py-3">
                          <p className="font-button text-button text-on-surface">{booking.time}</p>
                          <p className="font-label-caps text-[10px] uppercase text-outline">
                            {formatDate(booking.date)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-body-md font-semibold text-on-surface">{booking.customerName}</p>
                          <p className="text-xs text-on-surface-variant">{booking.customerPhone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-on-surface">{booking.service}</p>
                          <p className="font-label-caps text-[10px] uppercase text-outline">
                            {service.durationMinutes} min / {formatCurrency(service.price)}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-on-surface-variant">{booking.barber}</td>
                        <td className="px-4 py-3">
                          <AdminStatusBadge status={booking.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminAppointments;
