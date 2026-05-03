import { Link } from 'react-router-dom';

const footerLinks = {
  navigate: [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'About', to: '/about' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Booking', to: '/booking' },
    { label: 'Contact', to: '/contact' },
  ],
  hours: [
    { day: 'Mon – Fri', time: '9:00 AM – 8:00 PM' },
    { day: 'Saturday', time: '10:00 AM – 6:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-surface-variant mt-auto">
      <div className="max-w-screen-2xl mx-auto px-8 pt-16 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="text-primary text-3xl font-serif font-bold tracking-[0.1em] uppercase mb-2">
              The Master Barber
            </div>
            <div className="text-on-surface-variant text-[10px] tracking-[0.4em] uppercase mb-8">
              Precision & Heritage Since 1992
            </div>
            <p className="text-on-surface-variant text-base leading-relaxed max-w-sm mb-10">
              Where time-honored tradition meets modern sophistication. Experience the pinnacle of men's grooming in the heart of London.
            </p>
            {/* Social Icons (Sharp) */}
            <div className="flex gap-4">
              {['instagram', 'facebook', 'twitter'].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="w-12 h-12 bg-surface-container border border-surface-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 uppercase text-[9px] tracking-[0.2em] font-bold"
                  aria-label={social}
                >
                  {social === 'instagram' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  ) : social === 'facebook' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-on-surface text-xs font-bold uppercase tracking-[0.3em] mb-8">Navigate</h3>
            <ul className="space-y-4">
              {footerLinks.navigate.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-on-surface-variant text-sm hover:text-primary transition-colors duration-300 uppercase tracking-widest font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-on-surface text-xs font-bold uppercase tracking-[0.3em] mb-8">Opening Hours</h3>
            <ul className="space-y-4">
              {footerLinks.hours.map(({ day, time }) => (
                <li key={day} className="flex flex-col gap-1">
                  <span className="text-on-surface text-[10px] uppercase tracking-[0.2em] font-bold">{day}</span>
                  <span className={`text-sm font-serif ${time === 'Closed' ? 'text-on-surface-variant/30' : 'text-primary'}`}>{time}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-surface-variant">
              <a href="tel:+442071234567" className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors mb-3">
                <span className="material-symbols-outlined text-base">phone</span>
                +44 207 123 4567
              </a>
              <a href="mailto:info@masterbarber.com" className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-base">mail</span>
                info@masterbarber.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-variant pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-on-surface-variant text-[10px] tracking-[0.4em] uppercase">
            © 2026 The Master Barber. Precision & Heritage.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <a key={item} href="#" className="text-on-surface-variant text-[10px] hover:text-primary transition-colors uppercase tracking-[0.4em]">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
