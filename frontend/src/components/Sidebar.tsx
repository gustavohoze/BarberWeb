import { Link, NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const adminNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/appointments', label: 'Appointments', icon: 'calendar_month' },
  { to: '/admin/services', label: 'Services', icon: 'content_cut' },
  { to: '/admin/staff', label: 'Staff', icon: 'group' },
  { to: '/admin/customers', label: 'Customers', icon: 'person' },
  { to: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
];

export const Sidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) => {
  const panelClasses = [
    'fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-surface-container-highest bg-surface-container-low transition-all duration-300 lg:translate-x-0',
    isCollapsed ? 'lg:w-20' : 'lg:w-64',
    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
  ].join(' ');

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close admin navigation"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          type="button"
        />
      )}

      <aside className={panelClasses}>
        <div className="border-b border-surface-container-highest px-4 py-5 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-primary-container bg-background">
            <span className="material-symbols-outlined text-2xl text-primary-container">content_cut</span>
          </div>
          <Link to="/admin/dashboard" onClick={onClose} className="block">
            <p className={['font-h3 text-lg text-primary-container uppercase tracking-tight', isCollapsed ? 'lg:hidden' : ''].join(' ')}>
              Precision
            </p>
            <p className={['mt-1 font-label-caps text-label-caps uppercase text-on-surface-variant', isCollapsed ? 'lg:hidden' : ''].join(' ')}>
              Master Barber
            </p>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="flex flex-col gap-1">
            {adminNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-4 border-l-2 px-4 py-3 font-label-caps text-label-caps uppercase transition-all duration-200',
                      isCollapsed ? 'lg:justify-center lg:px-0' : '',
                      isActive
                        ? 'border-primary-container bg-background/70 text-primary-container'
                        : 'border-transparent text-on-surface-variant hover:bg-background/50 hover:text-on-surface',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className="material-symbols-outlined text-xl"
                        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {item.icon}
                      </span>
                      <span className={isCollapsed ? 'lg:hidden' : ''}>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-surface-container-highest p-4">
          <button
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="mb-3 hidden w-full items-center justify-center gap-2 border border-outline-variant px-3 py-2 font-label-caps text-label-caps uppercase text-on-surface-variant transition-colors hover:border-primary hover:text-primary lg:flex"
            onClick={onToggleCollapse}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              {isCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
            </span>
            <span className={isCollapsed ? 'lg:hidden' : ''}>Collapse</span>
          </button>
        </div>
      </aside>
    </>
  );
};
