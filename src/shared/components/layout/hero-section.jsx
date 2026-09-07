import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReservationCtaButton from '../ui/reservation-cta-button.jsx';
import heroImg from '../../../assets/images/caribbean_hero_bar_1788651748042.jpg';

// Flame SVG Icon replacing generic flame emoji
export function FlameIcon({ className = "w-5 h-5", color = "#c8860a" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2C10.5 4.5 9 7 9 9.5C9 10.5 9.4 11.4 10 12C8 11.5 6 13 6 15.5C6 18.5 8.7 21 12 21C15.3 21 18 18.5 18 15.5C18 11.5 14 8 13.5 6.5C13.5 5 13.8 3.5 12 2Z"
        fill={color}
      />
      <path
        d="M12 18C10.6 18 9.5 16.9 9.5 15.5C9.5 14 10.5 13 11.2 12.2C11.7 11.7 12 11 12 10.5C12.5 11.5 13.5 12.5 13.8 13.2C14.2 14 14.5 14.8 14.5 15.5C14.5 16.9 13.4 18 12 18Z"
        fill="#f0e6cc"
        fillOpacity="0.85"
      />
    </svg>
  );
}

const EMBERS = [
  { id: 1, left: '12%', delay: '0s', duration: '5.2s' },
  { id: 2, left: '24%', delay: '1.4s', duration: '6.4s' },
  { id: 3, left: '38%', delay: '0.6s', duration: '5.8s' },
  { id: 4, left: '52%', delay: '2.1s', duration: '6.2s' },
  { id: 5, left: '66%', delay: '1.1s', duration: '5.1s' },
  { id: 6, left: '78%', delay: '2.7s', duration: '6.7s' },
  { id: 7, left: '89%', delay: '0.3s', duration: '5.5s' },
  { id: 8, left: '45%', delay: '3.3s', duration: '6.1s' },
];

export default function HeroSection() {
  const line1Words = ['Sabor,', 'fuego', 'y'];
  const line2Words = ['vibra', 'caribeña.'];

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero-jungle-texture relative text-[#f0e6cc] pt-14 pb-20 px-6 sm:px-10 lg:px-16 border-b border-[#c8860a]/20 overflow-hidden">
      {/* Subtle Ember Particles Layer */}
      <div className="ember-container" aria-hidden="true">
        {EMBERS.map((e) => (
          <span
            key={e.id}
            className="ember-particle"
            style={{
              left: e.left,
              bottom: '10px',
              animationDelay: e.delay,
              animationDuration: e.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Hero Text & Actions (moves at 0.1x scroll speed) */}
        <div
          className="lg:col-span-7 flex flex-col items-start transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
            willChange: 'transform',
          }}
        >
          {/* Location Badge with Animated Growing Gold Line */}
          <div className="inline-flex flex-col mb-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#132c21] border border-[#c8860a]/35 text-[#f0e6cc] text-xs font-label uppercase tracking-[0.18em]">
              <span className="dot-dash-indicator" aria-hidden="true" />
              <span>Puerto Viejo, Limon · Costa Rica</span>
            </div>
            {/* 1.5s ease line growing 0 to 100% on load */}
            <div className="h-[2px] bg-gradient-to-r from-[#c8860a] via-[#e59c19] to-transparent animate-line-grow mt-2 rounded-full" />
          </div>

          <span className="font-label text-xs tracking-[0.2em] text-[#c8860a] uppercase font-semibold mb-3">
            Alta Cocina Afrocaribeña & Fogón de Autor
          </span>

          {/* Headline with Smoke-Rise Rising Lettering */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#f0e6cc] font-bold leading-[1.12] mb-6 tracking-tight">
            <span className="inline-block overflow-hidden">
              {line1Words.map((word, i) => (
                <span
                  key={word}
                  className="inline-block mr-3 animate-smoke-rise opacity-0"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  {word}
                </span>
              ))}
            </span>
            <br />
            <span className="inline-block overflow-hidden text-[#c8860a] font-oblique-8">
              {line2Words.map((word, i) => (
                <span
                  key={word}
                  className="inline-block mr-3 animate-smoke-rise opacity-0"
                  style={{ animationDelay: `${(line1Words.length + i) * 0.14}s` }}
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>

          {/* Poetic Subtext (Max 2 lines) */}
          <p className="font-body text-lg sm:text-xl text-[#f0e6cc]/85 max-w-2xl leading-relaxed mb-8 font-normal">
            Bajo la brisa de Talamanca y el susurro del mar, el coco, el tomillo y la leña celebran la memoria viva de nuestra gente en cada bocado.
          </p>

          {/* Crowd Notice Banner with SVG Flame */}
          <div className="w-full max-w-xl p-4 mb-9 rounded bg-[#15291f] border border-[#c8860a]/30 flex items-start gap-3.5 shadow-lg">
            <div className="mt-0.5 flex-shrink-0 p-2 rounded bg-[#0d1f17] border border-[#c8860a]/30">
              <FlameIcon className="w-5 h-5" color="#e59c19" />
            </div>
            <div>
              <strong className="block text-sm font-label font-bold text-[#e59c19] uppercase tracking-wider mb-1">
                Cupo Exclusivo · 20 Personas por Turno
              </strong>
              <p className="text-xs text-[#f0e6cc]/80 leading-normal m-0 font-body">
                Para honrar el fuego lento y una atención fraterna, gestionamos cupos limitados. Te invitamos a apartar tu mesa con anticipación.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-5">
            <ReservationCtaButton to="/reservar">
              Asegurar mi mesa
            </ReservationCtaButton>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-sm font-label font-semibold tracking-wider text-[#f0e6cc] hover:text-[#c8860a] transition-colors py-3 px-4 border-b border-transparent hover:border-[#c8860a]"
            >
              <span>Descubrir el menú de autor</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Visual Frame (moves at 0.4x scroll speed) */}
        <div
          className="lg:col-span-5 flex justify-center transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${scrollY * 0.4}px)`,
            willChange: 'transform',
          }}
        >
          <div className="relative w-full max-w-md">
            {/* Handcrafted wooden & gold trim border frame */}
            <div className="relative p-2.5 rounded bg-[#14261d] border-2 border-[#c8860a]/40 shadow-2xl">
              <div className="overflow-hidden rounded relative aspect-[4/5]">
                <img
                  src={heroImg}
                  alt="Restaurante Fino Donde Ray en Puerto Viejo Limón"
                  className="w-full h-full object-cover brightness-95 hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f17] via-transparent to-transparent opacity-60" />
              </div>

              {/* Caption Tag */}
              <div className="mt-3 px-2 py-1.5 flex items-center justify-between text-xs font-label text-[#d8caa7]">
                <span className="uppercase tracking-[0.16em]">Alta Cocina & Fogón de Autor</span>
                <span className="text-[#c8860a] font-bold">Puerto Viejo · Limon</span>
              </div>
            </div>

            {/* Subtle decorative woven diamond in corners */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#c8860a] rotate-45 border border-[#0d1f17]" aria-hidden="true" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#c8860a] rotate-45 border border-[#0d1f17]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
