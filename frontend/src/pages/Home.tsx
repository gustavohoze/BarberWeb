import { Link } from 'react-router-dom';

const stats = [
  { number: '15+', label: 'Years of Craft' },
  { number: '4,800+', label: 'Happy Clients' },
  { number: '3', label: 'Master Barbers' },
  { number: '98%', label: 'Satisfaction Rate' },
];

const featuredServices = [
  {
    icon: 'content_cut',
    name: 'Executive Haircut',
    desc: 'Precision cut, hot lather neck shave, and premium styling.',
    price: '$45',
    duration: '45 min',
  },
  {
    icon: 'face',
    name: 'Luxury Hot Towel Shave',
    desc: 'Multiple hot towels, pre-shave oil, and straight razor finish.',
    price: '$55',
    duration: '45 min',
  },
  {
    icon: 'auto_awesome',
    name: 'The Full Works',
    desc: 'Executive Cut + Hot Towel Shave. The ultimate grooming reset.',
    price: '$90',
    duration: '75 min',
  },
];

const testimonials = [
  {
    quote: "Best barbershop in the city, hands down. The Executive Cut is an experience unlike any other.",
    author: "James Whitmore",
    title: "Regular since 2019",
    rating: 5,
  },
  {
    quote: "The hot towel shave was incredibly relaxing. A true gentleman's ritual. I leave feeling like a new man every time.",
    author: "Oliver Hartley",
    title: "Loyal Client",
    rating: 5,
  },
  {
    quote: "Thomas is an artist. He listened to exactly what I wanted and delivered something even better.",
    author: "Marcus Reid",
    title: "Monthly Member",
    rating: 5,
  },
];

const masterBarbers = [
  { name: 'Arthur Stone', years: '22 Years', specialty: 'Razor Shave Master', philosophy: 'The blade never lies.', image: 'https://images.unsplash.com/photo-1503460293376-303bbac90831?auto=format&fit=crop&w=800&q=80' },
  { name: 'Marcus Vance', years: '15 Years', specialty: 'Skin Fade Artisan', philosophy: 'Precision over speed.', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80' },
  { name: 'Elias Thorne', years: '12 Years', specialty: 'Classic Scissor Work', philosophy: 'Style is in the details.', image: 'https://images.unsplash.com/photo-1622286332618-f2803b114283?auto=format&fit=crop&w=800&q=80' },
  { name: 'Julian Reed', years: '8 Years', specialty: 'Beard Sculpting', philosophy: 'A beard is a man\'s signature.', image: 'https://images.unsplash.com/photo-1599305090598-fe175d2f6220?auto=format&fit=crop&w=800&q=80' },
];

export const Home = () => {
  return (
    <main className="flex-grow">

      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[700px] max-h-[900px] w-full overflow-hidden flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 w-full h-full">
          <img
            alt="Master Barber at work"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuByg6-jn3Jw4dFB2z9I8nCUJnYjNXi1XBtPgYcRNEnraXOTY3W5KC3mN0Ms5fc9R-BJ2GMSNmITBpmMIayv0A60GpPLuHaO6QQsgw4HjIfhmO0ajrn5rwSFjd-I9tSLo1YAEoOF8JVmBfa0l_ZgI23ztymLnw6Hm3CDS0fg2DXY7jc79CG6pw-zZelMJYE36vLh9FO_qbOZTMnb0LftzwforOAI_x66DH-aeT7hyTROAIJUu2bmaA0HCPaQXKMoO-BJPBRGkM4t41_P"
          />
          {/* Multi-layer gradient for drama */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-8 md:px-16">
          <div className="max-w-2xl">
            <p className="animate-fade-in-up text-primary text-xs tracking-[0.4em] uppercase font-bold mb-8">
              Est. 1992 · London, W1D
            </p>
            <h1 className="animate-fade-in-up delay-100 text-6xl md:text-8xl font-serif font-bold text-on-background mb-8 leading-[1.05]">
              Precision.<br />
              <em className="italic text-primary">Heritage.</em><br />
              Style.
            </h1>
            <p className="animate-fade-in-up delay-200 text-on-surface-variant text-xl max-w-md leading-relaxed mb-12">
              Experience the pinnacle of men's grooming. Where time-honored tradition meets modern sophistication.
            </p>
            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-0">
              <Link
                to="/booking"
                className="bg-primary hover:bg-primary-container text-on-primary font-bold text-sm px-10 py-5 uppercase tracking-widest transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">event</span>
                Book an Appointment
              </Link>
              <Link
                to="/services"
                className="border border-white/20 hover:border-primary/50 text-on-surface font-bold text-sm px-10 py-5 uppercase tracking-widest transition-colors duration-300 flex items-center justify-center gap-2"
              >
                View Services
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-16 flex flex-col items-start gap-4 animate-fade-in delay-700">
          <span className="text-on-surface-variant text-[10px] tracking-[0.3em] uppercase vertical-text">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent ml-[5px]" />
        </div>
      </section>

      {/* ── Stats Bar (Reworked to avoid slop) ── */}
      <section className="border-y border-surface-variant bg-surface-container-low overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-8 py-16">
          <div className="flex flex-col md:flex-row items-baseline gap-12 md:gap-24">
            <div className="max-w-xs">
              <h2 className="text-xs tracking-[0.4em] uppercase font-bold text-primary mb-4">Legacy</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Over three decades of perfecting the ritual of grooming for the city's most discerning gentlemen.
              </p>
            </div>
            <div className="flex-grow grid grid-cols-2 md:grid-cols-3 gap-12 border-l border-surface-variant pl-12">
              {stats.slice(0, 3).map((stat) => (
                <div key={stat.label} className="animate-fade-in-up">
                  <div className="text-4xl md:text-5xl font-serif font-bold text-on-background mb-2">
                    {stat.number}
                  </div>
                  <div className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Master Barbers Section ── */}
      <section className="py-32 px-8 bg-background overflow-hidden border-b border-surface-variant">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
            <div className="max-w-2xl">
              <span className="text-primary text-xs tracking-[0.4em] uppercase font-bold mb-8 block">The Artisans</span>
              <h2 className="text-6xl md:text-8xl font-serif font-bold text-on-background leading-[0.95] tracking-tighter">
                The Hands Behind <br />
                <em className="italic text-primary">the Craft</em>
              </h2>
            </div>
            <div className="max-w-xs border-l border-primary/20 pl-10 pb-2">
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Mastery isn't taught, it's forged over decades of precision and the quiet pursuit of excellence.
              </p>
            </div>
          </div>

          {/* Barbers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-surface-variant/10">
            {masterBarbers.map((barber, i) => (
              <div 
                key={barber.name} 
                className="group relative aspect-[3/4] overflow-hidden border-r border-b lg:border-b-0 border-surface-variant/30 last:border-r-0 animate-fade-in-up"
                style={{ animationDelay: `${(i + 1) * 150}ms` }}
              >
                {/* Image Layer */}
                <img 
                  src={barber.image} 
                  alt={barber.name} 
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-[1200ms] ease-out-expo"
                />
                
                {/* Cinematic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 group-hover:opacity-40 transition-opacity duration-700" />
                
                {/* Content Layer */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out-expo">
                    <div className="text-primary text-[10px] tracking-[0.3em] uppercase font-bold mb-3 flex items-center gap-3">
                      <span className="w-8 h-px bg-primary/40" />
                      {barber.years}
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-on-background mb-2">
                      {barber.name}
                    </h3>
                    <p className="text-on-surface-variant text-[11px] uppercase tracking-[0.2em] mb-6 font-bold">
                      {barber.specialty}
                    </p>
                    <div className="overflow-hidden h-0 group-hover:h-12 transition-all duration-700 delay-100">
                      <p className="text-on-surface text-sm italic opacity-60 leading-relaxed border-l-2 border-primary/30 pl-4">
                        "{barber.philosophy}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 flex justify-center">
            <Link
              to="/booking"
              className="group bg-primary hover:bg-primary-container text-on-primary font-bold text-sm px-16 py-7 uppercase tracking-[0.4em] transition-all duration-500 flex items-center gap-6"
            >
              Choose Your Barber
              <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-3">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Philosophy Section ── */}
      <section className="py-24 px-8 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-5 flex flex-col justify-center">
            <span className="text-primary text-xs tracking-[0.4em] uppercase font-bold mb-6">Our Philosophy</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-on-background mb-8 leading-tight">
              The Art of{' '}
              <em className="italic text-primary">Grooming</em>
            </h2>
            <div className="w-24 h-px bg-primary mb-10" />
            <p className="text-on-surface-variant text-lg leading-relaxed mb-6">
              We believe that a haircut is more than just a routine—it's a ritual. Our sanctuary is designed for the modern gentleman who demands excellence and appreciates the finer details.
            </p>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
              Every snip, shave, and styling is executed with masterful precision, ensuring you leave not just looking your best, but feeling your most confident.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-4 text-primary font-bold text-sm uppercase tracking-[0.2em] group"
            >
              Read Our Story
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-2">arrow_forward</span>
            </Link>
          </div>

          <div className="md:col-span-6 md:col-start-7 relative">
            <div className="relative w-full aspect-[4/5] overflow-hidden">
              <img
                alt="Barber Tools"
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8_rrc4D0Ice2lIiQWTiPT5br9y7W32iMW9bmVwas2JdDPD-6aL_kkTwsy9XXY2sgkFFOjrCGmSUpMrKHxbCN5SRiw-B0vtwuKeE7_cO24b6_tbs5aHtzaVm8P8ImPsMs-NT0RLp89xDtPHVkD4n8kiiT2tkvfQL0BWDNmk5h55G8mSA0wQj9cCrhLNxLiuBXXAboRxZ4WQqqo3TXeMneJRI0bTRchkJJKSa1m0WKPAwfhl7FtP9-JhFS_HmWI9t2NSMp-U-jO26Xt"
              />
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-8 -left-8 w-full h-full border border-primary/10 -z-10 hidden md:block" />
            
            {/* Status indicator (Sharp) */}
            <div className="absolute -top-4 -right-4 bg-surface-container border border-primary/20 px-6 py-3 hidden md:flex items-center gap-3">
              <span className="w-2 h-2 bg-primary animate-pulse" />
              <span className="text-on-surface text-[10px] tracking-[0.3em] uppercase font-bold">Open Today</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Services (Reworked to Editorial Menu) ── */}
      <section className="py-24 px-8 bg-surface-container-lowest border-y border-surface-variant">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <span className="text-primary text-xs tracking-[0.4em] uppercase font-bold">Our Services</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-on-background mt-4 mb-8">
              Crafted for the Gentleman
            </h2>
            <div className="w-16 h-px bg-primary/30 mx-auto" />
          </div>

          {/* Service Menu Style */}
          <div className="max-w-3xl mx-auto space-y-12">
            {featuredServices.map((service) => (
              <div
                key={service.name}
                className="group animate-fade-in-up"
              >
                <div className="flex items-baseline mb-2">
                  <h3 className="text-2xl font-serif font-bold text-on-surface group-hover:text-primary transition-colors duration-300">
                    {service.name}
                  </h3>
                  <div className="flex-grow border-b border-dotted border-surface-variant mx-4 relative -top-1" />
                  <span className="text-2xl font-serif font-bold text-primary">
                    {service.price}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-on-surface-variant text-sm leading-relaxed max-w-md">
                    {service.desc}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                    {service.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <Link
              to="/services"
              className="border border-white/20 hover:border-primary/50 text-on-surface font-bold text-sm px-12 py-5 uppercase tracking-widest transition-colors duration-300"
            >
              View All Services
              <span className="material-symbols-outlined text-base ml-2">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials (Editorial Layout) ── */}
      <section className="py-24 px-8 bg-background">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-4">
              <span className="text-primary text-xs tracking-[0.4em] uppercase font-bold">Voices</span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-on-background mt-6 mb-8 leading-tight">
                The Gentleman's <br />
                <em className="italic text-primary">Verdict</em>
              </h2>
              <div className="w-16 h-px bg-primary/30" />
            </div>

            <div className="md:col-span-8 space-y-32">
              {testimonials.slice(0, 2).map((t, i) => (
                <div 
                  key={t.author} 
                  className={`flex flex-col ${i % 2 === 0 ? 'items-start' : 'items-end'} animate-fade-in-up`}
                  style={{ animationDelay: `${(i + 1) * 200}ms` }}
                >
                  <div className={`max-w-2xl ${i % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <div className={`flex gap-1 mb-8 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <span key={s} className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                    
                    <div className="relative">
                      {/* Hanging Quote */}
                      <span className={`absolute -top-4 ${i % 2 === 0 ? '-left-8' : '-right-8'} text-6xl font-serif text-primary/10 select-none`}>
                        &ldquo;
                      </span>
                      
                      <blockquote className="text-3xl md:text-4xl font-serif text-on-surface mb-10 leading-tight italic [text-wrap:balance]">
                        {t.quote}
                      </blockquote>
                    </div>

                    <div className={`flex items-center gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className="w-14 h-14 bg-surface-container-high border border-primary/20 flex items-center justify-center font-serif font-bold text-primary text-2xl relative">
                        <div className="absolute inset-1 border border-primary/5" />
                        {t.author[0]}
                      </div>
                      <div>
                        <p className="text-on-surface font-bold tracking-[0.2em] uppercase text-xs mb-1">{t.author}</p>
                        <p className="text-on-surface-variant text-[10px] tracking-[0.3em] uppercase font-bold">{t.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner (Polished) ── */}
      <section className="relative py-32 px-8 overflow-hidden border-y border-surface-variant bg-surface-container-low">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)] from-primary/30" />
        </div>
        
        <div className="relative max-w-screen-2xl mx-auto text-center z-10">
          <p className="text-primary text-xs tracking-[0.4em] uppercase font-bold mb-6">Reservation</p>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-on-background mb-8">
            Secure Your Chair
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto mb-12 text-xl leading-relaxed">
            Precision takes time. Reserve your session with our master barbers today.
          </p>
          <Link
            to="/booking"
            className="bg-primary hover:bg-primary-container text-on-primary font-bold text-sm px-16 py-6 uppercase tracking-[0.3em] transition-all duration-300 inline-flex items-center gap-4"
          >
            <span className="material-symbols-outlined text-xl">calendar_month</span>
            Book Now
          </Link>
        </div>
      </section>
    </main>
  );
};
