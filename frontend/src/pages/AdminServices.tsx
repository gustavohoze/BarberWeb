import { useMemo, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { AdminStatusBadge } from '../components/AdminStatusBadge';
import { adminServices, formatCurrency } from '../lib/adminData';

export const AdminServices = () => {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(adminServices.map((service) => service.category)))],
    [],
  );
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const visibleServices = activeCategory === 'All'
    ? adminServices
    : adminServices.filter((service) => service.category === activeCategory);

  const averagePrice = Math.round(
    adminServices.reduce((sum, service) => sum + service.price, 0) / adminServices.length,
  );

  return (
    <AdminLayout>
      <div className="space-y-section-gap">
        <section className="flex flex-col justify-between gap-stack-md border-b border-surface-container-high pb-stack-lg md:flex-row md:items-end">
          <div>
            <p className="mb-stack-sm font-label-caps text-label-caps uppercase text-primary-container">
              Services
            </p>
            <h1 className="font-h2 text-h2 text-on-surface">Service Management</h1>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
              Create, edit, and manage services, durations, and pricing.
            </p>
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-primary-container px-5 py-3 font-button text-button uppercase text-on-primary-container transition-colors hover:bg-primary"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Service
          </button>
        </section>

        <section className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Active Menu</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">
              {adminServices.filter((service) => service.status !== 'paused').length}
            </p>
          </article>
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Average Price</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">{formatCurrency(averagePrice)}</p>
          </article>
          <article className="border border-surface-container-highest bg-surface-container-low p-6">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Weekly Bookings</span>
            <p className="mt-3 font-h1 text-h1 text-on-surface">
              {adminServices.reduce((sum, service) => sum + service.bookingCount, 0)}
            </p>
          </article>
        </section>

        <section className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={[
                'border px-4 py-2 font-label-caps text-label-caps uppercase transition-colors',
                activeCategory === category
                  ? 'border-primary-container bg-primary-container text-on-primary-container'
                  : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary',
              ].join(' ')}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
          {visibleServices.map((service) => (
            <article
              key={service.id}
              className="group border border-outline-variant bg-surface-container-low p-6 transition-colors hover:border-primary-container/70"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-outline-variant bg-surface-container-high text-primary-container transition-colors group-hover:border-primary-container">
                    <span className="material-symbols-outlined">{service.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-h3 text-h3 text-on-surface">{service.name}</h2>
                    <p className="mt-2 font-body-md text-sm text-on-surface-variant">{service.description}</p>
                  </div>
                </div>
                <AdminStatusBadge status={service.status} />
              </div>

              <div className="my-stack-lg flex items-center gap-4">
                <span className="font-label-caps text-label-caps uppercase text-outline">{service.category}</span>
                <span className="h-px flex-1 border-b border-dotted border-surface-variant" />
                <span className="font-h3 text-h3 text-primary-container">{formatCurrency(service.price)}</span>
              </div>

              <div className="grid grid-cols-2 gap-stack-sm border-y border-outline-variant py-stack-md">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-outline">Duration</span>
                  <p className="mt-1 font-body-md text-on-surface">{service.durationMinutes} minutes</p>
                </div>
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-outline">Bookings</span>
                  <p className="mt-1 font-body-md text-on-surface">{service.bookingCount} this week</p>
                </div>
              </div>

              <div className="mt-stack-md flex flex-wrap gap-stack-sm">
                <button
                  className="flex flex-1 items-center justify-center gap-2 border border-outline px-4 py-3 font-button text-button uppercase text-on-surface transition-colors hover:border-primary-container hover:text-primary-container"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                  Edit
                </button>
                <button
                  className="flex flex-1 items-center justify-center gap-2 border border-transparent bg-surface-container px-4 py-3 font-button text-button uppercase text-on-surface transition-colors hover:bg-surface-container-high"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">bar_chart</span>
                  Report
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
