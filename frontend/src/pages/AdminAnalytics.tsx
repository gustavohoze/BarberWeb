import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { adminStaff, formatCurrency, type AdminBooking } from '../lib/adminData';
import { deriveAnalyticsFromBookings, fetchAdminBookings } from '../lib/adminLiveData';

export const AdminAnalytics = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        const data = await fetchAdminBookings();
        if (isMounted) {
          setBookings(data || []);
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof Error && (err as Error & { status?: number }).status === 401) {
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }
          setNotice('Unable to load live analytics. Showing derived metrics from recent bookings only.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const analytics = useMemo(() => deriveAnalyticsFromBookings(bookings), [bookings]);

  const topServiceCount = Math.max(...analytics.serviceMix.map((service) => service.bookingCount), 1);

  return (
    <AdminLayout>
      <div className="space-y-section-gap">
        <section className="flex flex-col justify-between gap-stack-md border-b border-surface-container-high pb-stack-lg md:flex-row md:items-end">
          <div>
            <p className="mb-stack-sm font-label-caps text-label-caps uppercase text-primary-container">
              Analytics
            </p>
            <h1 className="font-h2 text-h2 text-on-surface">Performance Analytics</h1>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
              Overview of bookings, revenue, staff utilization, and peak hours.
            </p>
          </div>
          <button
            className="flex items-center justify-center gap-2 border border-outline px-5 py-3 font-button text-button uppercase text-on-surface transition-colors hover:border-primary-container hover:text-primary-container"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export
          </button>
        </section>

        {notice && (
          <div className="border border-outline-variant bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
            {notice}
          </div>
        )}

        <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-4">
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Weekly Revenue</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">{formatCurrency(analytics.weeklyRevenue)}</p>
            <p className="mt-2 text-sm text-green-500">+8.5% vs last week</p>
          </article>
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Booking Volume</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">
              {analytics.bookingVolume}
            </p>
            <p className="mt-2 text-sm text-green-500">+12% vs last week</p>
          </article>
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Client Value</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">
              {formatCurrency(analytics.averageClientValue)}
            </p>
            <p className="mt-2 text-sm text-on-surface-variant">Average lifetime spend</p>
          </article>
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Staff Utilization</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">{analytics.staffUtilization}%</p>
            <p className="mt-2 text-sm text-green-500">Prime floor coverage</p>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-gutter xl:grid-cols-3">
          <article className="border border-surface-container-highest bg-surface-container-low p-6 xl:col-span-2">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="font-h3 text-h3 text-on-surface">Revenue Trend</h2>
              <span className="font-label-caps text-label-caps uppercase text-outline">Last 7 days</span>
            </div>
            {loading && <p className="mb-4 text-sm text-on-surface-variant">Syncing live booking revenue...</p>}
            <div className="flex h-72 items-end gap-3 border-b border-l border-surface-container-highest pb-2 pl-3">
              {analytics.revenueByDay.map((item) => (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                  <div
                    className="w-full border-t-2 border-primary-container bg-primary-container/25 transition-colors hover:bg-primary-container/50"
                    style={{ height: `${(item.value / Math.max(...analytics.revenueByDay.map((entry) => entry.value), 1)) * 100}%` }}
                  />
                  <span className="font-label-caps text-xs uppercase text-on-surface-variant">{item.label}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="font-h3 text-h3 text-on-surface">Peak Hours</h2>
              <span className="font-label-caps text-label-caps uppercase text-outline">Today</span>
            </div>
            <div className="space-y-stack-md">
              {analytics.peakHours.map((hour) => (
                <div key={hour.label}>
                  <div className="mb-2 flex justify-between font-label-caps text-label-caps uppercase">
                    <span className="text-on-surface">{hour.label}</span>
                    <span className="text-outline">{hour.value}%</span>
                  </div>
                  <div className="h-2 bg-surface-container-highest">
                    <div className="h-full bg-primary-container" style={{ width: `${hour.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-gutter xl:grid-cols-2">
          <article className="border border-outline-variant bg-surface-container p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-h3 text-h3 text-on-surface">Service Mix</h2>
              <span className="font-label-caps text-label-caps uppercase text-outline">Bookings</span>
            </div>
            <div className="space-y-stack-md">
              {analytics.serviceMix.slice(0, 5).map((service) => (
                <div key={service.name}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="font-body-md text-on-surface">{service.name}</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">
                      {service.bookingCount}
                    </span>
                  </div>
                  <div className="h-2 bg-surface-container-highest">
                    <div
                      className="h-full bg-primary-container"
                      style={{ width: `${(service.bookingCount / topServiceCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="border border-outline-variant bg-surface-container p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-h3 text-h3 text-on-surface">Staff Performance</h2>
              <span className="font-label-caps text-label-caps uppercase text-outline">Today</span>
            </div>
            <div className="space-y-stack-md">
              {adminStaff.map((member) => {
                const liveCount = analytics.staffPerformance.find((entry) => entry.name === member.name)?.bookingsToday ?? 0;
                return (
                  <div
                    key={member.id}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-outline-variant pb-stack-md last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-body-md font-semibold text-on-surface">{member.name}</p>
                      <p className="text-sm text-on-surface-variant">{member.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-button text-button text-primary-container">{liveCount}</p>
                      <p className="font-label-caps text-label-caps uppercase text-outline">Bookings</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
