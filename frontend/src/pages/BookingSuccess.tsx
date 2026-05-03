import { useSearchParams, Link } from 'react-router-dom';

export const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Show last 8 chars of the Stripe session ID as a human-readable reference
  const reference = sessionId ? sessionId.slice(-8).toUpperCase() : null;

  return (
    <main className="flex-grow flex items-center justify-center px-8 py-24">
      <div className="text-center max-w-lg w-full animate-scale-in">

        {/* Animated checkmark */}
        <div className="relative mx-auto mb-8 w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20 animate-pulse-glow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
        </div>

        {/* Heading */}
        <p className="text-primary text-xs tracking-[0.4em] uppercase font-semibold mb-4">
          Payment Confirmed
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold text-on-background mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          You're All Set!
        </h1>
        <p className="text-on-surface-variant leading-relaxed mb-8">
          Your appointment has been confirmed and payment received. A confirmation
          email will be sent to you shortly. We look forward to seeing you.
        </p>

        {/* Reference */}
        {reference && (
          <div className="inline-flex items-center gap-2 bg-surface-container border border-surface-variant rounded-sm px-5 py-3 mb-8">
            <span className="material-symbols-outlined text-on-surface-variant text-base">receipt</span>
            <span className="text-on-surface-variant text-xs uppercase tracking-widest">
              Booking Ref:&nbsp;
            </span>
            <span className="text-on-surface font-mono font-semibold text-sm tracking-widest">
              {reference}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="w-px h-8 bg-gradient-to-b from-surface-variant to-transparent mx-auto mb-8" />

        {/* What's next */}
        <div className="bg-surface-container-low border border-surface-variant rounded-sm p-6 text-left mb-10">
          <h2 className="text-xs font-semibold text-on-surface uppercase tracking-widest mb-4">
            What's next?
          </h2>
          <ul className="space-y-3">
            {[
              { icon: 'mail', text: 'Check your inbox for a confirmation email with appointment details.' },
              { icon: 'calendar_month', text: 'Add the appointment to your calendar to avoid missing it.' },
              { icon: 'location_on', text: 'Find us at 123 Heritage Row, London, W1D 4EY.' },
            ].map(({ icon, text }) => (
              <li key={icon} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary/70 text-base mt-0.5">{icon}</span>
                <span className="text-on-surface-variant text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-gold inline-flex items-center justify-center gap-2 text-on-primary font-semibold text-sm px-8 py-4 uppercase tracking-widest rounded-sm"
          >
            <span className="material-symbols-outlined text-base">home</span>
            Return Home
          </Link>
          <Link
            to="/booking"
            className="btn-outline inline-flex items-center justify-center gap-2 text-on-surface font-semibold text-sm px-8 py-4 uppercase tracking-widest rounded-sm"
          >
            Book Another
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </main>
  );
};
