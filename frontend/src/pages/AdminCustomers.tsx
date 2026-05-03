import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { AdminStatusBadge } from '../components/AdminStatusBadge';
import { formatCurrency, formatDate, getInitials, type AdminBooking } from '../lib/adminData';
import { deriveCustomersFromBookings, fetchAdminBookings } from '../lib/adminLiveData';

export const AdminCustomers = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [tier, setTier] = useState('all');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
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
          setNotice('Unable to load live customers. Showing data from recent bookings only.');
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

  const customers = useMemo(() => deriveCustomersFromBookings(bookings), [bookings]);

  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) => {
        const queryMatches = [customer.name, customer.email, customer.phone, customer.favoriteService]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase());
        const tierMatches = tier === 'all' ? true : customer.tier === tier;
        return queryMatches && tierMatches;
      }),
    [customers, query, tier],
  );

  const totalSpend = customers.reduce((sum, customer) => sum + customer.totalSpend, 0);

  return (
    <AdminLayout>
      <div className="space-y-section-gap">
        <section className="flex flex-col justify-between gap-stack-md border-b border-surface-container-high pb-stack-lg md:flex-row md:items-end">
          <div>
            <p className="mb-stack-sm font-label-caps text-label-caps uppercase text-primary-container">
              Customers
            </p>
            <h1 className="font-h2 text-h2 text-on-surface">Customer Management</h1>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
              View profiles, booking history, loyalty status, and client preferences.
            </p>
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-primary-container px-5 py-3 font-button text-button uppercase text-on-primary-container transition-colors hover:bg-primary"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Add Customer
          </button>
        </section>

        {notice && (
          <div className="border border-outline-variant bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
            {notice}
          </div>
        )}

        <section className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Client Profiles</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">{customers.length}</p>
          </article>
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">VIP Clients</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">
              {customers.filter((customer) => customer.tier === 'VIP').length}
            </p>
          </article>
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Lifetime Value</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">{formatCurrency(totalSpend)}</p>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
          <label className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">
              search
            </span>
            <input
              className="w-full border border-outline-variant bg-surface py-3 pl-10 pr-4 font-body-md text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary"
              onChange={(event) => updateSearchQuery(event.target.value)}
              placeholder="Search customers..."
              type="search"
              value={query}
            />
          </label>

          <label className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">
              workspace_premium
            </span>
            <select
              className="w-full appearance-none border border-outline-variant bg-surface py-3 pl-10 pr-10 font-body-md text-on-surface outline-none transition-colors focus:border-primary"
              onChange={(event) => setTier(event.target.value)}
              value={tier}
            >
              <option value="all">All Tiers</option>
              <option value="VIP">VIP</option>
              <option value="Regular">Regular</option>
              <option value="New">New</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-sm text-outline">
              expand_more
            </span>
          </label>
        </section>

        <section className="overflow-hidden border border-outline-variant bg-surface-container">
          <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-high px-6 py-4">
            <h2 className="font-h3 text-h3 text-on-surface">Client List</h2>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              {filteredCustomers.length} records
            </span>
          </div>

          {loading && (
            <div className="border-b border-outline-variant px-6 py-3 text-sm text-on-surface-variant">
              Syncing live customer history...
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="px-6 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Client
                  </th>
                  <th className="px-6 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Tier
                  </th>
                  <th className="px-6 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Visits
                  </th>
                  <th className="px-6 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Spend
                  </th>
                  <th className="px-6 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Favorite
                  </th>
                  <th className="px-6 py-4 text-right font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="group transition-colors hover:bg-surface-container-high">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-dim font-button text-sm uppercase text-primary-container">
                          {getInitials(customer.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-body-md font-semibold text-on-surface">{customer.name}</p>
                          <p className="truncate text-sm text-on-surface-variant">{customer.email}</p>
                          <p className="text-xs text-outline">{customer.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <AdminStatusBadge status={customer.tier} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-body-md text-on-surface">{customer.visits}</span>
                      <p className="font-label-caps text-label-caps uppercase text-outline">
                        Last: {formatDate(customer.lastVisit)}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-body-md text-on-surface">
                      {formatCurrency(customer.totalSpend)}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{customer.favoriteService}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                        <button
                          aria-label="Open customer profile"
                          className="flex h-9 w-9 items-center justify-center border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">badge</span>
                        </button>
                        <button
                          aria-label="Message customer"
                          className="flex h-9 w-9 items-center justify-center border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">mail</span>
                        </button>
                        <button
                          aria-label="Edit customer"
                          className="flex h-9 w-9 items-center justify-center border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                      </div>
                    </td>
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

export default AdminCustomers;
