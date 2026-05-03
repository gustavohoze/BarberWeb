interface AdminStatusBadgeProps {
  status: string;
}

const statusClasses: Record<string, string> = {
  confirmed: 'border-primary text-primary',
  completed: 'border-green-500 text-green-500',
  pending: 'border-outline-variant text-on-surface-variant',
  cancelled: 'border-error text-error',
  active: 'border-primary text-primary',
  featured: 'border-primary-container text-primary-container',
  paused: 'border-outline-variant text-on-surface-variant',
  available: 'border-green-500 text-green-500',
  'in-service': 'border-primary text-primary',
  'off-duty': 'border-outline-variant text-on-surface-variant',
  VIP: 'border-primary text-primary',
  Regular: 'border-outline text-on-surface',
  New: 'border-green-500 text-green-500',
};

export const AdminStatusBadge = ({ status }: AdminStatusBadgeProps) => (
  <span
    className={[
      'inline-flex items-center border px-2 py-1 font-label-caps text-label-caps uppercase tracking-widest',
      statusClasses[status] ?? 'border-outline-variant text-on-surface-variant',
    ].join(' ')}
  >
    {status.replace('-', ' ')}
  </span>
);
