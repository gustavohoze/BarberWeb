import { Link } from 'react-router-dom';

const serviceCategories = [
  {
    id: 'hair',
    icon: 'content_cut',
    title: 'Hair',
    services: [
      { name: 'Executive Haircut', price: '$45', duration: '45 MIN', desc: 'A meticulous consultation followed by a precision cut using shears and clippers. Finished with a hot lather neck shave and premium styling products.' },
      { name: 'Classic Fade', price: '$40', duration: '30 MIN', desc: 'Seamless blending from skin to desired length. Sharp line-up and finished with our signature matte clay.' },
      { name: 'Buzz Cut & Line Up', price: '$25', duration: '20 MIN', desc: 'One guard all over, precise edging around the ears and neck. Clean, fast, and sharp.' },
    ],
  },
  {
    id: 'face',
    icon: 'face',
    title: 'Face & Beard',
    services: [
      { name: 'Luxury Hot Towel Shave', price: '$55', duration: '45 MIN', desc: 'The ultimate relaxation. Multiple hot towels, pre-shave oil, warm lather, and a straight razor shave, finished with a cooling balm and cold towel.' },
      { name: 'Beard Trim & Shape', price: '$30', duration: '30 MIN', desc: 'Sculpting and debulking to suit your face shape. Includes straight razor lining on the cheeks and neck for a crisp finish.' },
      { name: 'Beard Sculpting', price: '$25', duration: '30 MIN', desc: 'Detailed beard trim, shaping, and conditioning treatment.' },
    ],
  },
];

export const Services = () => {
  return (
    <main className="flex-grow">

      {/* ── Hero ── */}
      <header className="relative w-full h-72 md:h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Barbershop tools"
            className="w-full h-full object-cover"
            decoding="async"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvFNR-hoeCFE0d81GvDQLhFu9Udko-KayUvZuDiZ7meYPVhH2Z4SxcH3EnuaSDwzkeY5xeBcFjLHOGB6Q3-FwQ2WGjWcCZGt-r8r9Zhc3gkl4TYfvi9-YFXxDkGVwUZdiqkV9UamU2U3R_T9FmreyoiASPm7PpAgXg4NOjCgekp3stCpqWjMgdkDiKlA62C-U19q2RqzfA6D73NIJpLEfA3raTLeXytncjMvX75Z9YZs4zKmImSUhEAvzw0FOSRtiS8wC1XM3iFJA9"
            width="1600"
            height="900"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />
        </div>
        <div className="relative z-10 text-center px-8 max-w-3xl mx-auto">
          <p className="text-primary text-xs tracking-[0.4em] uppercase font-semibold mb-4 animate-fade-in-up">Our Craft</p>
          <h1
            className="text-4xl md:text-6xl font-bold text-on-surface mb-4 animate-fade-in-up delay-100"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Services & Pricing
          </h1>
          <p className="text-on-surface-variant animate-fade-in-up delay-200">
            Precision grooming tailored for the modern gentleman.
          </p>
        </div>
      </header>

      {/* ── Services Grid ── */}
      <section className="max-w-screen-xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {serviceCategories.map((cat) => (
            <div key={cat.id}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-10 pb-4 border-b border-surface-variant">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">{cat.icon}</span>
                </div>
                <h2
                  className="text-2xl font-bold text-on-background uppercase tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {cat.title}
                </h2>
              </div>

              {/* Service Items */}
              <div className="flex flex-col gap-8">
                {cat.services.map((service) => (
                  <article
                    key={service.name}
                    className="group service-card bg-surface-container-lowest border border-surface-variant p-6 rounded-sm hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <h3
                        className="text-lg font-semibold text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors duration-300"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {service.name}
                      </h3>
                      <span
                        className="text-primary text-xl font-bold shrink-0"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {service.price}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                      {service.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {service.duration}
                      </span>
                      <Link
                        to="/booking"
                        className="text-xs text-primary font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1"
                      >
                        Book
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Signature Package ── */}
        <div className="mt-20 relative overflow-hidden rounded-sm border border-primary/30 p-10 md:p-16 bg-surface-container-low">
          {/* Decorative glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 opacity-10 -translate-y-1/2 translate-x-1/2"
            style={{
              background: 'radial-gradient(circle, rgba(242,202,80,1) 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="text-primary text-xs tracking-[0.4em] uppercase font-semibold mb-3">Signature Package</p>
              <h2
                className="text-3xl md:text-4xl font-bold text-on-surface mb-3 uppercase"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                The Works
              </h2>
              <p className="text-on-surface-variant max-w-xl leading-relaxed mb-4">
                Our most comprehensive grooming experience. Combines the Executive Haircut with the Luxury Hot Towel Shave. Includes a complimentary beverage, scalp massage, and exclusive product recommendations.
              </p>
              <div className="flex items-center gap-4">
                <span
                  className="text-4xl font-bold text-primary"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  $90
                </span>
                <span className="text-on-surface-variant text-xs uppercase tracking-widest">75 min session</span>
              </div>
            </div>
            <Link
              to="/booking"
              className="btn-gold shrink-0 inline-flex items-center gap-2 text-on-primary font-semibold text-sm px-8 py-4 uppercase tracking-widest rounded-sm whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base">event</span>
              Book The Works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
