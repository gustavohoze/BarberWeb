export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface AdminBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  status: BookingStatus | string;
  createdAt?: string;
}

export interface AdminService {
  id: string;
  name: string;
  description: string;
  category: string;
  durationMinutes: number;
  price: number;
  icon: string;
  status: 'active' | 'featured' | 'paused';
  bookingCount: number;
}

export interface AdminStaffMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  status: 'available' | 'in-service' | 'off-duty';
  nextSlot: string;
  rating: number;
  bookingsToday: number;
  initials: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  totalSpend: number;
  lastVisit: string;
  tier: 'VIP' | 'Regular' | 'New';
  favoriteService: string;
}

export const toISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISODate(date);
};

export const adminServices: AdminService[] = [
  {
    id: 'executive-cut',
    name: 'The Executive Cut',
    description: 'Precision haircut, neck shave, styling, and hot towel finish.',
    category: 'Haircut',
    durationMinutes: 45,
    price: 65,
    icon: 'content_cut',
    status: 'featured',
    bookingCount: 42,
  },
  {
    id: 'beard-sculpting',
    name: 'Beard Sculpting',
    description: 'Detailed beard trim, shaping, conditioning, and line-up work.',
    category: 'Beard',
    durationMinutes: 30,
    price: 40,
    icon: 'face',
    status: 'active',
    bookingCount: 31,
  },
  {
    id: 'full-service-razor',
    name: 'Full Service Razor',
    description: 'Executive cut paired with a traditional straight razor shave.',
    category: 'Signature',
    durationMinutes: 60,
    price: 85,
    icon: 'workspace_premium',
    status: 'featured',
    bookingCount: 28,
  },
  {
    id: 'standard-cut',
    name: 'Standard Cut',
    description: 'Clean consultation, classic cut, rinse, and finished style.',
    category: 'Haircut',
    durationMinutes: 45,
    price: 55,
    icon: 'cut',
    status: 'active',
    bookingCount: 24,
  },
  {
    id: 'hot-towel-shave',
    name: 'Hot Towel Shave',
    description: 'Warm towel prep, straight razor shave, and calming balm.',
    category: 'Shave',
    durationMinutes: 30,
    price: 35,
    icon: 'spa',
    status: 'active',
    bookingCount: 19,
  },
  {
    id: 'color-camouflage',
    name: 'Color Camouflage',
    description: 'Natural grey blending and tone correction for a sharper finish.',
    category: 'Treatment',
    durationMinutes: 35,
    price: 50,
    icon: 'palette',
    status: 'paused',
    bookingCount: 7,
  },
];

export const adminStaff: AdminStaffMember[] = [
  {
    id: 'marcus',
    name: 'Marcus Vance',
    role: 'Master Barber',
    specialty: 'Skin Fades',
    status: 'available',
    nextSlot: '2:30 PM',
    rating: 4.9,
    bookingsToday: 7,
    initials: 'MV',
  },
  {
    id: 'elias',
    name: 'Elias Thorne',
    role: 'Senior Stylist',
    specialty: 'Scissor Work',
    status: 'in-service',
    nextSlot: '4:00 PM',
    rating: 4.8,
    bookingsToday: 6,
    initials: 'ET',
  },
  {
    id: 'julian',
    name: 'Julian Reed',
    role: 'Barber',
    specialty: 'Beard Sculpting',
    status: 'off-duty',
    nextSlot: 'Tomorrow',
    rating: 4.7,
    bookingsToday: 0,
    initials: 'JR',
  },
  {
    id: 'arthur',
    name: 'Arthur Stone',
    role: 'Head Barber',
    specialty: 'Razor Shaves',
    status: 'available',
    nextSlot: '1:15 PM',
    rating: 5,
    bookingsToday: 8,
    initials: 'AS',
  },
];

export const sampleBookings: AdminBooking[] = [
  {
    id: 'BOOK-1042',
    customerName: 'James Davies',
    customerEmail: 'james.davies@example.com',
    customerPhone: '+1 202 555 0184',
    service: 'The Executive Cut',
    barber: 'Marcus Vance',
    date: toISODate(new Date()),
    time: '09:00 AM',
    status: 'confirmed',
  },
  {
    id: 'BOOK-1043',
    customerName: 'Alex Rivera',
    customerEmail: 'alex.rivera@example.com',
    customerPhone: '+1 202 555 0139',
    service: 'Beard Sculpting',
    barber: 'Unassigned',
    date: toISODate(new Date()),
    time: '10:15 AM',
    status: 'pending',
  },
  {
    id: 'BOOK-1044',
    customerName: 'Thomas Chen',
    customerEmail: 'thomas.chen@example.com',
    customerPhone: '+1 202 555 0162',
    service: 'Full Service Razor',
    barber: 'Marcus Vance',
    date: toISODate(new Date()),
    time: '11:00 AM',
    status: 'confirmed',
  },
  {
    id: 'BOOK-1045',
    customerName: 'Samuel Wright',
    customerEmail: 'samuel.wright@example.com',
    customerPhone: '+1 202 555 0128',
    service: 'Standard Cut',
    barber: 'Julian Reed',
    date: toISODate(new Date()),
    time: '01:30 PM',
    status: 'cancelled',
  },
  {
    id: 'BOOK-1046',
    customerName: 'Noah Miller',
    customerEmail: 'noah.miller@example.com',
    customerPhone: '+1 202 555 0157',
    service: 'Hot Towel Shave',
    barber: 'Arthur Stone',
    date: addDays(1),
    time: '03:00 PM',
    status: 'confirmed',
  },
  {
    id: 'BOOK-1047',
    customerName: 'Daniel Hart',
    customerEmail: 'daniel.hart@example.com',
    customerPhone: '+1 202 555 0196',
    service: 'The Executive Cut',
    barber: 'Elias Thorne',
    date: addDays(1),
    time: '05:30 PM',
    status: 'completed',
  },
];

export const adminCustomers: AdminCustomer[] = [
  {
    id: 'CUS-001',
    name: 'Thomas Chen',
    email: 'thomas.chen@example.com',
    phone: '+1 202 555 0162',
    visits: 18,
    totalSpend: 1420,
    lastVisit: '2026-05-03',
    tier: 'VIP',
    favoriteService: 'Full Service Razor',
  },
  {
    id: 'CUS-002',
    name: 'James Davies',
    email: 'james.davies@example.com',
    phone: '+1 202 555 0184',
    visits: 5,
    totalSpend: 365,
    lastVisit: '2026-05-03',
    tier: 'Regular',
    favoriteService: 'The Executive Cut',
  },
  {
    id: 'CUS-003',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 202 555 0139',
    visits: 1,
    totalSpend: 40,
    lastVisit: '2026-05-03',
    tier: 'New',
    favoriteService: 'Beard Sculpting',
  },
  {
    id: 'CUS-004',
    name: 'Daniel Hart',
    email: 'daniel.hart@example.com',
    phone: '+1 202 555 0196',
    visits: 9,
    totalSpend: 715,
    lastVisit: '2026-05-04',
    tier: 'Regular',
    favoriteService: 'The Executive Cut',
  },
  {
    id: 'CUS-005',
    name: 'Noah Miller',
    email: 'noah.miller@example.com',
    phone: '+1 202 555 0157',
    visits: 12,
    totalSpend: 930,
    lastVisit: '2026-05-04',
    tier: 'VIP',
    favoriteService: 'Hot Towel Shave',
  },
];

export const revenueByDay = [
  { label: 'Mon', value: 320 },
  { label: 'Tue', value: 440 },
  { label: 'Wed', value: 280 },
  { label: 'Thu', value: 560 },
  { label: 'Fri', value: 680 },
  { label: 'Sat', value: 520 },
  { label: 'Sun', value: 725 },
];

export const peakHours = [
  { label: '10A', value: 20 },
  { label: '12P', value: 42 },
  { label: '2P', value: 78 },
  { label: '4P', value: 100 },
  { label: '6P', value: 64 },
  { label: '8P', value: 31 },
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const getServiceMeta = (serviceName: string) =>
  adminServices.find((service) => service.id === serviceName || service.name === serviceName) ?? adminServices[0];
