import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { formatCurrency, formatDate, getServiceMeta, type AdminBooking } from '../lib/adminData';
import { fetchAdminBookings } from '../lib/adminLiveData';
import { Sidebar } from './Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [alerts, setAlerts] = useState<AdminBooking[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const latestCreatedAtRef = useRef(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const adminEmail = localStorage.getItem('adminEmail') || 'admin@masterbarber.com';
  const searchQuery = searchParams.get('q') || '';

  const updateSearchQuery = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    const trimmed = value.trim();
    if (trimmed) {
      nextParams.set('q', trimmed);
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    let isMounted = true;

    const syncNotifications = async (initialLoad = false) => {
      try {
        const bookings = await fetchAdminBookings();
        if (!isMounted) {
          return;
        }

        const sortedByLatest = [...bookings].sort((left, right) => {
          const leftCreated = left.createdAt ? new Date(left.createdAt).getTime() : 0;
          const rightCreated = right.createdAt ? new Date(right.createdAt).getTime() : 0;
          return rightCreated - leftCreated;
        });

        const latestCreatedAt = sortedByLatest[0]?.createdAt ? new Date(sortedByLatest[0].createdAt).getTime() : 0;

        if (initialLoad) {
          latestCreatedAtRef.current = latestCreatedAt;
          setAlerts(sortedByLatest.slice(0, 5));
          return;
        }

        const newBookings = sortedByLatest.filter((booking) => {
          if (!booking.createdAt) {
            return false;
          }

          return new Date(booking.createdAt).getTime() > latestCreatedAtRef.current;
        });

        if (newBookings.length > 0) {
          latestCreatedAtRef.current = Math.max(
            latestCreatedAtRef.current,
            ...newBookings.map((booking) => new Date(booking.createdAt || '').getTime()),
          );
          setAlerts((current) => [...newBookings, ...current].slice(0, 5));
          setUnreadCount((current) => current + newBookings.length);
        }
      } catch {
        // Keep the admin shell usable even if live alerts cannot sync.
      }
    };

    syncNotifications(true);
    const intervalId = window.setInterval(() => syncNotifications(false), 15000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminEmail');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />

      <div
        className={[
          'flex min-h-screen flex-col transition-[margin] duration-300',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64',
        ].join(' ')}
      >
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-surface-container-highest bg-surface-container-lowest px-4 py-3 md:px-5">
          <div className="flex items-center gap-4">
            <button
              aria-label="Open admin navigation"
              className="flex h-10 w-10 items-center justify-center border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary lg:hidden"
              onClick={() => setSidebarOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="font-h3 text-lg font-bold uppercase tracking-tight text-primary-container">
              Barber Admin
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <label className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">
                search
              </span>
              <input
                aria-label="Search admin"
                className="w-56 border border-outline-variant bg-surface-container py-2 pl-10 pr-4 font-body-md text-sm text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary"
                onChange={(event) => updateSearchQuery(event.target.value)}
                placeholder={searchQuery ? `Searching "${searchQuery}"` : 'Search admin records...'}
                type="search"
                value={searchQuery}
              />
            </label>

            <div className="relative">
              <button
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center text-on-surface-variant transition-colors hover:text-primary"
                onClick={() => {
                  setNotificationOpen((value) => !value);
                  setUnreadCount(0);
                }}
                type="button"
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-container px-1 text-[10px] font-semibold text-on-primary-container">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-12 z-40 w-80 border border-outline-variant bg-surface-container shadow-xl shadow-black/20">
                  <div className="border-b border-outline-variant px-4 py-3">
                    <p className="font-label-caps text-label-caps uppercase text-on-surface">Live bookings</p>
                    <p className="text-xs text-on-surface-variant">New appointments detected from the booking feed.</p>
                  </div>
                  <div className="max-h-72 divide-y divide-outline-variant overflow-y-auto">
                    {alerts.length === 0 ? (
                      <p className="px-4 py-5 text-sm text-on-surface-variant">No bookings yet.</p>
                    ) : (
                      alerts.map((booking) => {
                        const service = getServiceMeta(booking.service);
                        return (
                          <div key={booking.id} className="px-4 py-3 text-sm text-on-surface-variant">
                            <div className="flex items-center justify-between gap-4">
                              <p className="font-semibold text-on-surface">{booking.customerName}</p>
                              <span className="font-label-caps text-[10px] uppercase text-outline">{booking.date}</span>
                            </div>
                            <p className="mt-1 text-xs text-on-surface-variant">
                              {booking.service} / {formatCurrency(service.price)} / {booking.time}
                            </p>
                            <p className="mt-1 text-xs text-outline">
                              Placed {booking.createdAt ? formatDate(booking.createdAt) : 'recently'}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <Link
                    className="block border-t border-outline-variant px-4 py-3 text-center font-label-caps text-label-caps uppercase text-primary-container transition-colors hover:bg-background"
                    to="/admin/appointments"
                  >
                    Open schedule
                  </Link>
                </div>
              )}
            </div>

            <div className="hidden min-w-0 flex-col text-right sm:flex">
              <span className="font-label-caps text-label-caps uppercase text-on-surface">Admin</span>
              <span className="max-w-40 truncate text-xs text-on-surface-variant">{adminEmail}</span>
            </div>
            <button
              aria-label="Logout"
              className="flex h-10 w-10 items-center justify-center border border-outline-variant bg-surface-container text-on-surface-variant transition-colors hover:border-error hover:text-error"
              onClick={handleLogout}
              type="button"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-container-max">{children}</div>
        </main>
      </div>
    </div>
  );
};
