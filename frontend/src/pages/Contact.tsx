import { useState } from 'react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <main className="flex-grow">

      {/* ── Hero Banner ── */}
      <div className="border-b border-surface-variant py-16 md:py-24 text-center px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at center, rgba(242,202,80,0.4) 0%, transparent 70%)' }}
        />
        <p className="text-primary text-xs tracking-[0.4em] uppercase font-semibold mb-4 relative animate-fade-in-up">Contact Us</p>
        <h1
          className="text-4xl md:text-6xl font-bold text-on-background mb-4 relative animate-fade-in-up delay-100"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Get in Touch
        </h1>
        <p className="text-on-surface-variant max-w-md mx-auto relative animate-fade-in-up delay-200">
          Precision styling awaits. Reach out to schedule a consultation or ask us anything.
        </p>
      </div>

      <section className="max-w-screen-xl mx-auto px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Left: Info Cards ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Address */}
            <div className="bg-surface-container-low border border-surface-variant rounded-sm p-6 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                </div>
                <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Visit Us
                </h2>
              </div>
              <address className="not-italic text-on-surface-variant leading-relaxed text-sm">
                123 Heritage Row<br />
                London, W1D 4EY
              </address>
            </div>

            {/* Hours */}
            <div className="bg-surface-container-low border border-surface-variant rounded-sm p-6 card-hover">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                </div>
                <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Opening Hours
                </h2>
              </div>
              <div className="space-y-3">
                {[
                  { day: 'Mon – Fri', time: '9:00 AM – 8:00 PM', open: true },
                  { day: 'Saturday', time: '10:00 AM – 6:00 PM', open: true },
                  { day: 'Sunday', time: 'Closed', open: false },
                ].map(({ day, time, open }) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-surface-variant/50 last:border-0">
                    <span className="text-on-surface text-sm">{day}</span>
                    <span className={`text-sm font-medium ${open ? 'text-primary' : 'text-on-surface-variant/50'}`}>{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-surface-container-low border border-surface-variant rounded-sm p-6 card-hover">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">phone</span>
                </div>
                <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Direct Contact
                </h2>
              </div>
              <div className="space-y-3">
                <a href="tel:+442071234567" className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors group">
                  <span className="material-symbols-outlined text-base group-hover:text-primary">call</span>
                  <span className="text-sm">+44 207 123 4567</span>
                </a>
                <a href="mailto:info@masterbarber.com" className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors group">
                  <span className="material-symbols-outlined text-base group-hover:text-primary">mail</span>
                  <span className="text-sm">info@masterbarber.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── Right: Contact Form ── */}
          <div className="lg:col-span-3 bg-surface-container-low border border-surface-variant rounded-sm p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-surface-variant">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">send</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-on-surface uppercase tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Send a Message
                </h2>
                <p className="text-on-surface-variant text-xs uppercase tracking-widest">We'll reply within 24 hours</p>
              </div>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Message Sent!
                </h3>
                <p className="text-on-surface-variant text-sm text-center">
                  We've received your message and will be in touch shortly.
                </p>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                      Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiry" className="block text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                    Inquiry Type
                  </label>
                  <select id="inquiry" className="form-input">
                    <option>General Booking</option>
                    <option>Question</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    placeholder="How can we assist you?"
                    rows={5}
                    required
                    className="form-input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold text-on-primary font-semibold text-sm py-4 uppercase tracking-widest rounded-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
