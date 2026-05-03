import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/booking', label: 'Booking' },
  { to: '/contact', label: 'Contact' },
];

export const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`w-full sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-lg shadow-black/30' : 'bg-transparent border-b border-white/5'
        }`}
      >
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          {/* Brand */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex flex-col group"
          >
            <span className="font-serif text-lg md:text-xl font-bold text-primary tracking-[0.2em] uppercase leading-none group-hover:text-primary-container transition-colors duration-300">
              The Master
            </span>
            <span className="font-sans text-[10px] tracking-[0.4em] text-on-surface-variant uppercase group-hover:text-primary-container transition-colors duration-300 mt-1">
              Barber Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-10 items-center font-bold tracking-[0.2em] uppercase text-[11px]">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`transition-colors duration-300 relative group ${
                  isActive(to)
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {label}
                <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${isActive(to) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-6">
            <Link
              to="/booking"
              className="hidden md:inline-flex bg-primary hover:bg-primary-container text-on-primary font-bold text-[11px] px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300"
            >
              Book Now
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col gap-2 p-2 group"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className={`block h-px w-6 bg-on-surface transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`block h-px bg-on-surface transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 w-0' : 'w-5'}`} />
              <span className={`block h-px w-6 bg-on-surface transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-fade-in"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-surface-container z-50 flex flex-col transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-8 py-8 border-b border-surface-variant">
          <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase font-serif">
            The Master Barber
          </span>
          <button
            onClick={closeMenu}
            className="text-on-surface-variant hover:text-primary transition-colors p-2"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex flex-col flex-1 px-8 py-12 gap-2">
          {navLinks.map(({ to, label }, i) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              style={{ animationDelay: `${i * 0.1}s` }}
              className={`animate-slide-in-left py-6 font-bold text-lg uppercase tracking-[0.2em] border-b border-surface-variant/50 transition-colors duration-300 flex items-center justify-between group ${
                isActive(to)
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="font-serif">{label}</span>
              <span className="material-symbols-outlined text-xl opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2 text-primary">arrow_forward</span>
            </Link>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="px-8 py-12 bg-surface-container-low">
          <Link
            to="/booking"
            onClick={closeMenu}
            className="block w-full bg-primary text-center text-on-primary font-bold text-xs py-5 uppercase tracking-[0.3em]"
          >
            Book an Appointment
          </Link>
          <Link
            to="/login"
            onClick={closeMenu}
            className="block text-center text-[10px] text-on-surface-variant hover:text-primary transition-colors mt-8 uppercase tracking-[0.4em]"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </>
  );
};
