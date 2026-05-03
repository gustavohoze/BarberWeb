import { formatCurrency, getServiceMeta, type AdminBooking, type AdminCustomer } from './adminData';
import { apiUrl } from './api';

const tokenHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  'Content-Type': 'application/json',
});

export const fetchAdminBookings = async (): Promise<AdminBooking[]> => {
  const response = await fetch(apiUrl('/api/bookings'), {
    headers: tokenHeaders(),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = typeof body?.error === 'string' ? body.error : 'Failed to fetch bookings';
    const error = new Error(message);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  return (await response.json()) as AdminBooking[];
};

const parseDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parseTimeToMinutes = (value: string) => {
  const normalized = value.trim().toUpperCase();
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) {
    return 0;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3];

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

const priceForService = (serviceName: string) => getServiceMeta(serviceName).price;

const formatServiceName = (serviceName: string) => getServiceMeta(serviceName).name;

export const deriveCustomersFromBookings = (bookings: AdminBooking[]): AdminCustomer[] => {
  const customers = new Map<string, AdminCustomer & { serviceCounts: Record<string, number> }>();

  for (const booking of bookings) {
    const key = booking.customerEmail || booking.customerName;
    const existing = customers.get(key);
    const currentDate = parseDate(booking.date)?.getTime() ?? 0;
    const serviceName = formatServiceName(booking.service);

    if (!existing) {
      customers.set(key, {
        id: key,
        name: booking.customerName,
        email: booking.customerEmail,
        phone: booking.customerPhone,
        visits: 1,
        totalSpend: priceForService(serviceName),
        lastVisit: booking.date,
        tier: 'New',
        favoriteService: serviceName,
        serviceCounts: { [serviceName]: 1 },
      });
      continue;
    }

    const nextServiceCounts = {
      ...existing.serviceCounts,
      [serviceName]: (existing.serviceCounts[serviceName] || 0) + 1,
    };
    const favoriteService = Object.entries(nextServiceCounts).sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }
      return left[0].localeCompare(right[0]);
    })[0]?.[0] ?? serviceName;

    customers.set(key, {
      ...existing,
      name: booking.customerName,
      phone: booking.customerPhone || existing.phone,
      visits: existing.visits + 1,
      totalSpend: existing.totalSpend + priceForService(serviceName),
      lastVisit: currentDate > (parseDate(existing.lastVisit)?.getTime() ?? 0) ? booking.date : existing.lastVisit,
      tier: existing.visits + 1 >= 8 ? 'VIP' : existing.visits + 1 >= 3 ? 'Regular' : 'New',
      favoriteService,
      serviceCounts: nextServiceCounts,
    });
  }

  return [...customers.values()]
    .map((c) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { serviceCounts, ...customer } = c;
      return customer;
    })
    .sort((left, right) => right.totalSpend - left.totalSpend || right.visits - left.visits);
};

export const deriveAnalyticsFromBookings = (bookings: AdminBooking[]) => {
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    const dateKey = date.toISOString().slice(0, 10);
    return {
      dateKey,
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: 0,
    };
  });

  const hours = ['10A', '12P', '2P', '4P', '6P', '8P'].map((label) => ({ label, value: 0 }));
  const serviceCounts = new Map<string, number>();
  const staffCounts = new Map<string, number>();

  for (const booking of bookings) {
    const bookingDate = parseDate(booking.date);
    const serviceName = formatServiceName(booking.service);
    const servicePrice = priceForService(serviceName);

    if (bookingDate) {
      const dayEntry = days.find((day) => day.dateKey === booking.date);
      if (dayEntry) {
        dayEntry.value += servicePrice;
      }
    }

    if (booking.status !== 'cancelled') {
      const hour = parseTimeToMinutes(booking.time);
      const bucketIndex = hour < 12 * 60 ? 0 : hour < 14 * 60 ? 1 : hour < 16 * 60 ? 2 : hour < 18 * 60 ? 3 : hour < 20 * 60 ? 4 : 5;
      hours[bucketIndex].value += 1;
    }

    serviceCounts.set(serviceName, (serviceCounts.get(serviceName) || 0) + 1);
    if (booking.barber && booking.barber !== 'Unassigned' && booking.status !== 'cancelled') {
      staffCounts.set(booking.barber, (staffCounts.get(booking.barber) || 0) + 1);
    }
  }

  const revenueByDay = days.map((day) => ({ label: day.label, value: day.value }));
  const weeklyRevenue = revenueByDay.reduce((sum, item) => sum + item.value, 0);
  const bookingVolume = bookings.length;
  const customers = deriveCustomersFromBookings(bookings);
  const totalClientValue = customers.reduce((sum, customer) => sum + customer.totalSpend, 0);
  const averageClientValue = customers.length === 0 ? 0 : Math.round(totalClientValue / customers.length);
  const activeBookings = bookings.filter((booking) => booking.status !== 'cancelled');
  const assignedBookings = activeBookings.filter((booking) => booking.barber && booking.barber !== 'Unassigned').length;
  const staffUtilization = activeBookings.length === 0 ? 0 : Math.round((assignedBookings / activeBookings.length) * 100);

  const serviceMix = [...serviceCounts.entries()]
    .map(([name, count]) => ({ name, bookingCount: count }))
    .sort((left, right) => right.bookingCount - left.bookingCount);

  const staffPerformance = [...staffCounts.entries()]
    .map(([name, bookingsToday]) => ({ name, bookingsToday }))
    .sort((left, right) => right.bookingsToday - left.bookingsToday);

  const peakHours = hours.map((hour) => ({
    ...hour,
    value: Math.max(10, Math.round((hour.value / Math.max(1, Math.max(...hours.map((item) => item.value)))) * 100)),
  }));

  return {
    weeklyRevenue,
    bookingVolume,
    averageClientValue,
    staffUtilization,
    revenueByDay,
    peakHours,
    serviceMix,
    staffPerformance,
  };
};

export const formatLiveCurrency = formatCurrency;