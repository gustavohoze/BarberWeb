import { useState } from 'react';

const galleryItems = [
  { id: 1, category: 'HAIRCUTS', title: 'The Executive Pompadour', label: 'Precision Cut', colSpan: 2, rowSpan: 2 },
  { id: 2, category: 'BEARDS', title: 'Sharp & Defined', label: 'Beard Sculpting', colSpan: 1, rowSpan: 1 },
  { id: 3, category: 'SHOP', title: 'The Retreat', label: 'Atmosphere', colSpan: 1, rowSpan: 1 },
  { id: 4, category: 'HAIRCUTS', title: 'Flawless Transition', label: 'Skin Fade', colSpan: 1, rowSpan: 2 },
  { id: 5, category: 'SHOP', title: 'The Arsenal', label: 'Tools', colSpan: 1, rowSpan: 1 },
  { id: 6, category: 'BEARDS', title: 'Premium Grooming', label: 'Beard Perfection', colSpan: 1, rowSpan: 1 },
];

const imageUrls = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCBRpC2jdQdpZjXLQ-ikHplK2DTB3cnTR8jfMaPwSBS3Q_qwfz9VyPvjzW7a_Ol99Alrz5uhak42Jqilq4v2_8CjZ4EvM5VYqBCnWvG5f2y5jzUvvgzeZAR3JIge6TgYsBn8dpUA9OFcthl3Apm-IsNtG3G45IPojmUV5C7RVK0-8xqiuif2oxM6wD_N4QwCenc0rNmb_IsTCq_zz-REe-BnEJfA3RdKQJh92s9VLDFnvARjWLLtWNYjwXzug69h84BIUw3NcxJuo2e',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB1FRAxq7hMoc8Ahfw8KoqiJf_Ct5CRRkgjoW1k7Vb4a44De7A1jeo29rmDFLHBV_ofFYDQV5gQaE3FT9lsuBAt0XnmnCdHgssjdmratP6uX0xZ5fNyhw_sCooz6getRw8MUn4Z1J3VTjMRko4sKsuXliVvDTvLXVD_X2pSibXiMu0c4zc2_Db8bNxNP42STLeKKr6yurVx3rG0UOZeGl6XfQjQIJCWKER7qoE6xiLNF_M2mV7xxvCfTFSnzdYXi-yDbn9bj267EemD',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAk46t-xfrS07uzEBJJutPRCCZtBAzxll1Aqj_nNV9fjWDqtXr6vkKk5MYAv-xSqFaIW4Uy04sJsT3hxUk8xuiIMiPj6waaViB3505_T_50M6OReLgA5DnA2Pmx6VJQBDiEbPyNao_FHB4_QUBLATWAmGw3oRoE0qfjpYHPaXpJch9nd-CB-Y7HpxoBe31n96b1lHFfDZaxKjgZpLgOHPfcgTFXaluF9MByARmAh_T7rRZk_JG_UNxzqjKA_XMbST0CQGxfym-daem7',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCBpopHLURcX24nMbD6tPHBqK7MtRykq_fDhq1UNXW05iztzfbICCsT052vGT5i4sYjyd13r2D4IOKZ-UNiyrzM1la0vOKnPSDFYoB4S0-GQ4zQJtfU-UpVGjP0G9zQnWHlGNRyQEBrP9tRJwNMnRBI_-A4U3qUE5UhuYJo1be64FbWAb_YOZlRQM9F8Ix1nRC7kKjFdEe0LbbaXnKpTmUSP4n1EEpMFkJrL9W47XQQVmlVNPMzLG57kBrNpZy0wSK54C46IFR6QnEw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDXf86kzG6A4W4Gpz-qNYRHfIUG9sV49GVu9DM1D4MJZ2Zfr_mqFCv400L0B3BczU2uphbYIP2lQn4yvBbA7swiWano4vAJDRZF4KmGZooP-Qf_V0gFi_EtqVViDvSvfP1NjUAiFORJwmox9w2dsUyIKEJsEcVCyTXFEMjVT7sijsyge3zJ1AtvcKeUg_n4hiqosuNTZHxwMarP8lHzlCIe_232UKxNqlrgSP-dtkMMOw_q6OK_ZPsSoSnK741nQBmLL_3IqYcu7SzH',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDXf86kzG6A4W4Gpz-qNYRHfIUG9sV49GVu9DM1D4MJZ2Zfr_mqFCv400L0B3BczU2uphbYIP2lQn4yvBbA7swiWano4vAJDRZF4KmGZooP-Qf_V0gFi_EtqVViDvSvfP1NjUAiFORJwmox9w2dsUyIKEJsEcVCyTXFEMjVT7sijsyge3zJ1AtvcKeUg_n4hiqosuNTZHxwMarP8lHzlCIe_232UKxNqlrgSP-dtkMMOw_q6OK_ZPsSoSnK741nQBmLL_3IqYcu7SzH',
];

const filters = ['ALL', 'HAIRCUTS', 'BEARDS', 'SHOP'];

export const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [lightbox, setLightbox] = useState<null | { src: string; title: string }>(null);

  const filteredItems = activeFilter === 'ALL'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <main className="flex-grow">
      {/* ── Header ── */}
      <section className="max-w-screen-2xl mx-auto px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <p className="text-primary text-xs tracking-[0.4em] uppercase font-semibold mb-4 animate-fade-in-up">Gallery</p>
            <h1
              className="text-4xl md:text-6xl font-bold text-on-surface animate-fade-in-up delay-100"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The Craft
            </h1>
          </div>
          <p className="text-on-surface-variant max-w-sm leading-relaxed animate-fade-in-up delay-200">
            A curated selection of our finest work, blending classic techniques with modern precision.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3 mb-12 animate-fade-in-up delay-300">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 text-xs font-semibold uppercase tracking-widest rounded-full border transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-primary/15 border-primary text-primary'
                  : 'border-surface-variant text-on-surface-variant hover:border-primary/40 hover:text-on-surface'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightbox({ src: imageUrls[index % imageUrls.length], title: item.title })}
              className={`group relative overflow-hidden bg-surface-container cursor-pointer rounded-sm animate-scale-in ${
                item.colSpan === 2 ? 'lg:col-span-2' : ''
              } ${item.rowSpan === 2 ? 'md:row-span-2' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                alt={item.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                src={imageUrls[index % imageUrls.length]}
              />
              {/* Overlay */}
              <div className="gallery-item-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <span className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">
                  {item.label}
                </span>
                <h3
                  className="text-white text-xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-3 text-white/70 text-xs uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">zoom_in</span>
                  View
                </div>
              </div>

              {/* Category badge */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-surface-container/80 backdrop-blur-sm text-on-surface text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-surface-variant">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-12">
          <button className="btn-outline inline-flex items-center gap-2 text-on-surface font-semibold text-sm px-10 py-4 uppercase tracking-widest rounded-sm">
            <span className="material-symbols-outlined text-base">add</span>
            Load More Work
          </button>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined">close</span>
              Close
            </button>
            <img
              src={lightbox.src}
              alt={lightbox.title}
              className="w-full max-h-[80vh] object-contain rounded-sm"
            />
            <p
              className="text-white text-center mt-4 text-lg font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {lightbox.title}
            </p>
          </div>
        </div>
      )}
    </main>
  );
};
