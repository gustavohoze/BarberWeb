import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminStaff, toISODate } from '../lib/adminData';
import { apiUrl } from '../lib/api';

interface AvailabilityResponse {
  available: boolean;
  reason?: string;
  unavailableTimes: string[];
}

const getTomorrowISO = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toISODate(date);
};

const normalizeTime = (value: string) => value.trim().toLowerCase().replace(/^0/, '');
const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

export const Booking = () => {
  const [searchParams] = useSearchParams();
  const wasCancelled = searchParams.get('cancelled') === 'true';

  const [selectedService, setSelectedService] = useState('executive-cut');
  const [selectedBarber, setSelectedBarber] = useState(adminStaff[0].id);
  const [date, setDate] = useState(getTomorrowISO);
  const [time, setTime] = useState('09:00 AM');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [success] = useState(false);
  const [error, setError] = useState('');

  const services = [
    { id: 'executive-cut', name: 'The Executive Cut', desc: 'Precision haircut, neck shave, and styling. Includes a hot towel finish.', duration: '45 MINS', price: '$45', icon: 'content_cut' },
    { id: 'masters-shave', name: "The Master's Shave", desc: 'Traditional straight razor hot towel shave with premium essential oils.', duration: '30 MINS', price: '$35', icon: 'face' },
    { id: 'beard-sculpting', name: 'Beard Sculpting', desc: 'Detailed beard trim, shaping, and conditioning treatment.', duration: '30 MINS', price: '$25', icon: 'auto_awesome' },
    { id: 'full-works', name: 'The Full Works', desc: "Executive Cut combined with The Master's Shave. The ultimate reset.", duration: '75 MINS', price: '$75', icon: 'workspace_premium' },
  ];

  const barbers = adminStaff.map((member) => ({
    id: member.id,
    name: member.name,
    title: `${member.role} / ${member.specialty}`,
    img: '',
  }));

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedBarberData = barbers.find(b => b.id === selectedBarber);
  const unavailableTimeSet = useMemo(
    () => new Set(unavailableTimes.map((slot) => normalizeTime(slot))),
    [unavailableTimes],
  );
  const isSelectedDateInvalid = date <= toISODate(new Date());
  const isSelectedTimeUnavailable = unavailableTimeSet.has(normalizeTime(time));
  const canSubmit = !loading && !availabilityLoading && !isSelectedDateInvalid && !isSelectedTimeUnavailable && Boolean(time);

  useEffect(() => {
    let isMounted = true;

    const fetchAvailability = async () => {
      if (!date || !selectedBarberData?.name) {
        return;
      }

      setAvailabilityLoading(true);
      setAvailabilityMessage('');

      try {
        const params = new URLSearchParams({
          date,
          barber: selectedBarberData.name,
        });
        const response = await fetch(`${apiUrl('/api/bookings/availability')}?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Availability check is temporarily unavailable.');
        }

        const data = (await response.json()) as AvailabilityResponse;
        if (!isMounted) {
          return;
        }

        const unavailable = data.unavailableTimes || [];
        setUnavailableTimes(unavailable);
        setAvailabilityMessage(data.reason || '');

        const unavailableSet = new Set(unavailable.map((slot) => normalizeTime(slot)));
        setTime((currentTime) => {
          if (!unavailableSet.has(normalizeTime(currentTime))) {
            return currentTime;
          }
          return timeSlots.find((slot) => !unavailableSet.has(normalizeTime(slot))) || '';
        });
      } catch (err) {
        if (isMounted) {
          setUnavailableTimes([]);
          setAvailabilityMessage(err instanceof Error ? err.message : 'Availability check is temporarily unavailable.');
        }
      } finally {
        if (isMounted) {
          setAvailabilityLoading(false);
        }
      }
    };

    fetchAvailability();

    return () => {
      isMounted = false;
    };
  }, [date, selectedBarberData?.name]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!customerName || !customerEmail || !date || !time || !selectedBarberData?.name) {
      setError('Please fill in your name, email, date, time, and barber.');
      setLoading(false);
      return;
    }

    if (isSelectedDateInvalid) {
      setError('Same-day booking is not available. Please choose a future date.');
      setLoading(false);
      return;
    }

    if (isSelectedTimeUnavailable) {
      setError('That time has already been booked for your selected barber.');
      setLoading(false);
      return;
    }

    try {
      // Create a Stripe Checkout Session via the backend
      const response = await fetch(apiUrl('/api/bookings/create-session'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          service: selectedService,
          serviceName: selectedServiceData?.name,
          barber: selectedBarberData?.name,
          date,
          time,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to initiate payment');
      }

      const { checkoutUrl } = await response.json();
      // Redirect the browser to Stripe's hosted checkout page
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initiation failed. Is the backend running?');
      setLoading(false);
    }
    // Note: don't call setLoading(false) on success — the page is redirecting
  };

  const steps = ['Service', 'Barber', 'Schedule', 'Your Info'];

  // Generate next 21 days for the calendar
  const today = new Date();
  const next21Days = Array.from({ length: 21 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i + 1);
    return d;
  });

  return (
    <main className="flex-grow">
      <div className="max-w-screen-xl mx-auto px-8 py-16 md:py-24">

        {/* Page Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-xs tracking-[0.4em] uppercase font-semibold mb-4 animate-fade-in-up">Reservations</p>
          <h1
            className="text-4xl md:text-6xl font-bold text-on-background mb-4 animate-fade-in-up delay-100"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Secure Your Chair
          </h1>
          <p className="text-on-surface-variant animate-fade-in-up delay-200">
            Precision takes time. Reserve your session with our master barbers below.
          </p>
        </div>

        {/* Cancelled Notice */}
        {wasCancelled && (
          <div className="flex items-center gap-3 px-5 py-4 mb-8 bg-surface-container border border-outline-variant rounded-sm animate-fade-in-up">
            <span className="material-symbols-outlined text-primary/70">info</span>
            <p className="text-on-surface-variant text-sm">
              Payment was cancelled — your details are saved below. You can try again when you're ready.
            </p>
          </div>
        )}

        {/* Step Progress */}
        <div className="flex items-center justify-center gap-2 mb-16">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="step-indicator active">{i + 1}</span>
                <span className="text-xs text-on-surface-variant uppercase tracking-widest hidden sm:block">{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-8 h-px bg-surface-variant mx-1" />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* ── Main Booking Flow ── */}
            <div className="lg:col-span-8 flex flex-col gap-14">

              {/* Step 1: Service */}
              <section>
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-surface-variant">
                  <div className="step-indicator active">1</div>
                  <div>
                    <h2 className="text-lg font-semibold text-on-background uppercase tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Select Your Service
                    </h2>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">Choose one</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(service => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`service-card cursor-pointer rounded-sm p-6 transition-all duration-300 relative group ${
                        selectedService === service.id
                          ? 'selected bg-surface-container border border-primary/60'
                          : 'bg-surface-container-lowest border border-surface-variant hover:border-primary/30'
                      }`}
                    >
                      {selectedService === service.id && (
                        <div className="absolute top-4 right-4 text-primary">
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          selectedService === service.id ? 'bg-primary/15 border border-primary/40' : 'bg-surface-container-high border border-surface-variant'
                        }`}>
                          <span className={`material-symbols-outlined text-lg ${selectedService === service.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                            {service.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <h3 className="font-semibold text-on-surface mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {service.name}
                          </h3>
                          <p className="text-on-surface-variant text-xs leading-relaxed mb-4">{service.desc}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-on-surface-variant text-xs uppercase tracking-widest flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">schedule</span>
                              {service.duration}
                            </span>
                            <span className="text-primary font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {service.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Step 2: Barber */}
              <section>
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-surface-variant">
                  <div className="step-indicator active">2</div>
                  <div>
                    <h2 className="text-lg font-semibold text-on-background uppercase tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Choose Your Barber
                    </h2>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">Select a specialist</p>
                  </div>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {barbers.map(barber => (
                    <div
                      key={barber.id}
                      onClick={() => setSelectedBarber(barber.id)}
                      className={`flex-shrink-0 w-44 cursor-pointer rounded-sm border transition-all duration-300 p-5 text-center group ${
                        selectedBarber === barber.id
                          ? 'border-primary/60 bg-surface-container'
                          : 'border-surface-variant bg-surface-container-lowest hover:border-primary/30'
                      }`}
                    >
                      {barber.img ? (
                        <img
                          alt={barber.name}
                          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          src={barber.img}
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-surface-container-high border border-surface-variant flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl text-on-surface-variant">people</span>
                        </div>
                      )}
                      <p className="font-semibold text-on-surface text-sm mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {barber.name}
                      </p>
                      <p className="text-on-surface-variant text-xs uppercase tracking-widest">{barber.title}</p>
                      {selectedBarber === barber.id && (
                        <div className="mt-2">
                          <span className="text-primary material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                            verified
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Step 3: Date & Time */}
              <section>
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-surface-variant">
                  <div className="step-indicator active">3</div>
                  <div>
                    <h2 className="text-lg font-semibold text-on-background uppercase tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Date & Time
                    </h2>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">Pick your slot</p>
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div>
                    <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                      <label className="block text-xs text-on-surface-variant uppercase tracking-widest">
                        Select Date *
                      </label>
                      <p className="text-xs text-on-surface-variant">
                        Same-day booking is closed. Choose tomorrow or later.
                      </p>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                      {next21Days.map((d, i) => {
                        const dateStr = d.toISOString().split('T')[0];
                        const isSelected = date === dateStr;
                        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                        const dayNum = d.getDate();
                        const monthName = d.toLocaleDateString('en-US', { month: 'short' });
                        return (
                          <div 
                            key={i}
                            onClick={() => setDate(dateStr)}
                            className={`flex-shrink-0 w-24 h-28 rounded-sm border transition-all duration-300 flex flex-col items-center justify-center cursor-pointer select-none group
                              ${isSelected 
                                ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                                : 'border-surface-variant bg-surface-container-lowest hover:border-primary/50 text-on-surface hover:shadow-lg'
                              }`}
                          >
                            <span className={`text-[10px] uppercase tracking-widest mb-1 ${isSelected ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary/70'}`}>
                              {monthName}
                            </span>
                            <span className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {dayNum}
                            </span>
                            <span className={`text-[10px] uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary/70'}`}>
                              {dayName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                      <label className="block text-xs text-on-surface-variant uppercase tracking-widest">
                        Select Time
                      </label>
                      <p className="text-xs text-on-surface-variant">
                        {availabilityLoading
                          ? 'Checking confirmed bookings...'
                          : availabilityMessage || 'Booked slots are disabled for the selected barber.'}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {timeSlots.map(slot => {
                        const isUnavailable = unavailableTimeSet.has(normalizeTime(slot));
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={availabilityLoading || isUnavailable}
                            onClick={() => setTime(slot)}
                            className={`py-2 px-3 text-xs font-medium uppercase tracking-widest rounded-sm border transition-all duration-200 ${
                              time === slot
                                ? 'border-primary bg-primary/10 text-primary'
                                : isUnavailable
                                  ? 'cursor-not-allowed border-surface-variant bg-surface-container-high text-on-surface-variant/40 line-through'
                                  : 'border-surface-variant text-on-surface-variant hover:border-primary/40 hover:text-on-surface'
                            }`}
                          >
                            <span>{slot}</span>
                            {isUnavailable && <span className="mt-1 block text-[9px] no-underline">Booked</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Step 4: Customer Info */}
              <section>
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-surface-variant">
                  <div className="step-indicator active">4</div>
                  <div>
                    <h2 className="text-lg font-semibold text-on-background uppercase tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Your Information
                    </h2>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">Contact details</p>
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="form-input"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                        className="form-input"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="form-input"
                        placeholder="+44 207 123 4567"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Status Messages */}
              {error && (
                <div className="flex items-center gap-3 px-5 py-4 bg-error-container/20 border border-error/30 rounded-sm">
                  <span className="material-symbols-outlined text-error">error</span>
                  <p className="text-on-error-container text-sm">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-3 px-5 py-4 bg-primary/10 border border-primary/30 rounded-sm">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <p className="text-on-surface text-sm font-medium">Booking confirmed! Check your email for details.</p>
                </div>
              )}
            </div>

            {/* ── Appointment Summary ── */}
            <div className="lg:col-span-4">
              <div className="bg-surface-container-low border border-surface-variant rounded-sm p-7 sticky top-24">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-6 pb-4 border-b border-surface-variant"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Appointment Summary
                </h3>

                <div className="space-y-5 mb-6">
                  {[
                    { label: 'Service', value: selectedServiceData?.name, icon: 'content_cut' },
                    { label: 'Barber', value: selectedBarberData?.name, icon: 'person' },
                    { label: 'Date', value: date ? new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : '—', icon: 'calendar_month' },
                    { label: 'Time', value: time, icon: 'schedule' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary/60 text-base mt-0.5">{icon}</span>
                      <div>
                        <p className="text-on-surface-variant text-[10px] uppercase tracking-widest mb-0.5">{label}</p>
                        <p className="text-on-surface text-sm font-medium">{value || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-surface-variant pt-5 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant text-xs uppercase tracking-widest">Total</span>
                    <span
                      className="text-3xl font-bold text-primary"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {selectedServiceData?.price}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-xs mt-1">Secure payment confirms the slot</p>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="btn-gold w-full text-on-primary font-semibold text-sm py-4 uppercase tracking-widest rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                      Confirming…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">event_available</span>
                      Confirm Booking
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">lock</span>
                  <span className="text-on-surface-variant text-xs">Secure booking · Free cancellation</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};
