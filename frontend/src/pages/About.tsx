const masters = [
  {
    name: 'Elias Vance',
    role: 'Founder & Master Barber',
    specialty: 'Classic Cuts & Hot Towel Shaves',
    years: '22 years',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOJuFOY7NtI2QK5qDJsw_ea5KQFdG2jULIRyHTr8KsTAgvY7i8Q4OivP3oMXgTRBK6aN0s5w8XFfsJ9bKvsein1-2Kp3HPdsWG5HD1gDBULcAudJ0JIm0dnd3SZ05Sqpx8SNkoYpVueIiEHvm7kPwULbfHKgIf8VLCwbcDmvgbwH0FWQwamg466taCGM-lD0fCc83893CLv5sOwIpHXscp3k7O5jlucG-q9ZTa0mG04-UCcJa7ThCP9bRNAP7W37BVLW2wVB9PcEQX',
  },
  {
    name: 'Marcus Thorne',
    role: 'Senior Barber',
    specialty: 'Modern Fades & Beard Art',
    years: '14 years',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4mxpKZSTTYoIzDpjw-Y5vKzLs_CXfqJBkNi5dTkzs9fCFE0d81GvDQLhFu9Udko-KayUvZuDiZ7meYPVhH2Z4SxcH3EnuaSDwzkeY5xeBcFjLHOGB6Q3-FwQ2WGjWcCZGt-r8r9Zhc3gkl4TYfvi9-YFXxDkGVwUZdiqkV9UamU2U3R_T9FmreyoiASPm7PpAgXg4NOjCgekp3stCpqWjMgdkDiKlA62C-U19q2RqzfA6D73NIJpLEfA3raTLeXytncjMvX75Z9YZs4zKmImSUhEAvzw0FOSRtiS8wC1XM3iFJA9',
  },
  {
    name: 'Julian Cross',
    role: 'Straight Razor Specialist',
    specialty: 'Luxury Shaves & Skin Fades',
    years: '9 years',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlG0DCTEOpX6UKr6xGX3qQgVx9_G-G_oCmYxGPkZZ6xXWFZvLEgTQmYDXm8V2X_R3kXMF8UqxlCYr-tVzFrQgLvJuXS7dEqFCh-VcNLfX7hjWE0A7Uz-wKL_2fQ74sMa8y9nKr8vY8GyOwNvGHnN9WMmkEO-1Xw5KZ4i79Z5F4AX2yxp8QlP6kQlHr-RFKlJM9wYMxLI-kNWVDw',
  },
];

const values = [
  { icon: 'workspace_premium', title: 'Mastery', desc: 'Over two decades of perfecting the craft, passed down through generations of barbering tradition.' },
  { icon: 'history', title: 'Heritage', desc: 'Rooted in the golden age of barbershops, we preserve techniques that have stood the test of time.' },
  { icon: 'favorite', title: 'Attention to Detail', desc: 'Every cut, every line, every shave is executed with unwavering precision and care.' },
];

export const About = () => {
  return (
    <main className="flex-grow">

      {/* ── Heritage Hero ── */}
      <section className="py-20 md:py-32 px-8 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
            <p className="text-primary text-xs tracking-[0.4em] uppercase font-semibold mb-5 animate-fade-in-up">A Legacy in Steel & Leather</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-on-background mb-5 leading-tight animate-fade-in-up delay-100"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Precision &{' '}
              <em className="italic text-primary">Heritage</em>
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-transparent mb-8 animate-fade-in-up delay-200" />
            <p className="text-on-surface-variant leading-relaxed mb-5 animate-fade-in-up delay-300">
              Founded in a time when a haircut was a ritual rather than a chore, our shop was built on the uncompromising pursuit of craft. We believe in the weight of a well-balanced blade and the dignity of taking one's time.
            </p>
            <p className="text-on-surface-variant leading-relaxed animate-fade-in-up delay-400">
              Every chair in our gallery represents decades of passed-down technique. We don't just cut hair: we sculpt confidence. It is a retreat for the modern gentleman who understands that true luxury lies in meticulous attention to detail and unwavering consistency.
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2 relative">
            <div className="relative w-full aspect-square overflow-hidden rounded-sm">
              <img
                alt="Barbershop Interior"
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk46t-xfrS07uzEBJJutPRCCZtBAzxll1Aqj_nNV9fjWDqtXr6vkKk5MYAv-xSqFaIW4Uy04sJsT3hxUk8xuiIMiPj6waaViB3505_T_50M6OReLgA5DnA2Pmx6VJQBDiEbPyNao_FHB4_QUBLATWAmGw3oRoE0qfjpYHPaXpJch9nd-CB-Y7HpxoBe31n96b1lHFfDZaxKjgZpLgOHPfcgTFXaluF9MByARmAh_T7rRZk_JG_UNxzqjKA_XMbST0CQGxfym-daem7"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border border-primary/20 rounded-sm -z-10 hidden lg:block" />
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-surface-container-lowest border-y border-surface-variant py-20 px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-xs tracking-[0.4em] uppercase font-semibold mb-4">What We Stand For</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-on-background"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`text-center p-8 border border-surface-variant rounded-sm card-hover animate-fade-in-up delay-${(i + 1) * 200}`}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                  <span className="material-symbols-outlined text-primary text-2xl">{v.icon}</span>
                </div>
                <h3
                  className="text-xl font-bold text-on-surface mb-3 uppercase tracking-wide"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {v.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="py-12 flex items-center justify-center">
        <div className="divider-line w-64">
          <span className="material-symbols-outlined text-primary/60 text-3xl">content_cut</span>
        </div>
      </div>

      {/* ── The Masters ── */}
      <section className="max-w-screen-xl mx-auto px-8 pb-24">
        <div className="text-center mb-14">
          <p className="text-primary text-xs tracking-[0.4em] uppercase font-semibold mb-4">Meet the Team</p>
          <h2
            className="text-3xl md:text-5xl font-bold text-on-background mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Masters
          </h2>
          <p className="text-on-surface-variant max-w-md mx-auto">
            A collective of seasoned craftsmen dedicated to the art of traditional barbering
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {masters.map((master, i) => (
            <div
              key={master.name}
              className={`group text-center animate-fade-in-up delay-${(i + 1) * 200}`}
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-sm mb-6 border border-surface-variant">
                <img
                  alt={master.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  src={master.img}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="text-primary text-xs font-semibold uppercase tracking-widest">{master.specialty}</span>
                </div>
              </div>
              <h3
                className="text-xl font-bold text-on-surface uppercase tracking-wide mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {master.name}
              </h3>
              <p className="text-on-surface-variant text-sm mb-1">{master.role}</p>
              <p className="text-primary text-xs uppercase tracking-widest font-semibold">{master.years} experience</p>
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
