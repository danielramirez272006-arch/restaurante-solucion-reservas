import { Link } from 'react-router-dom';
import HeroSection from '../../shared/components/layout/hero-section.jsx';
import riceAndBeansImg from '../../assets/images/rice_and_beans_limon_1788651760839.jpg';
import rondonImg from '../../assets/images/rondon_soup_limon_1788651773676.jpg';
import patiImg from '../../assets/images/pati_caribeno_1788651839747.jpg';
import nightBarImg from '../../assets/images/bar_caribeno_noche_1788651853426.jpg';

const HIGHLIGHTS = [
  {
    number: '01',
    tag: 'Sazón Ancestral',
    title: 'Fuego a la Leña & Coco Puro',
    text: 'El secreto afrocaribeño de las abuelas limonenses: arroz y frijoles en leche de coco recién rallada, tomillo fresco y chile panameño sin romper.',
  },
  {
    number: '02',
    tag: 'Cultura & Raíces',
    title: 'Vibras Rastafari & Calypso',
    text: 'Filosofía One Love, acordes de don Walter Ferguson, compás one-drop en vivo y la calidez fraterna de la comunidad de Talamanca.',
  },
  {
    number: '03',
    tag: 'Bar & Fogón',
    title: 'La Mesa Viva de Puerto Viejo',
    text: 'Pesca fresca del día, costillas glaseadas al jerk, ron añejo especiado y Agua de Sapo con jengibre picante frente al mar.',
  },
];

const COCKTAILS = [
  { name: 'Coco Loco', desc: 'Con ron añejo caribeño y agua de coco fresca' },
  { name: 'Agua de Sapo', desc: 'Tapa de dulce artesanal, jengibre en mortero y limón' },
  { name: 'Cerveza Fría', desc: 'Con borde de sal marina y limón mandarina' },
  { name: 'Calypso Punch', desc: 'Frutas tropicales maceradas con especias' },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      {/* 1. HERO SECTION (Dark Roots #0d1f17 with Jungle Texture & Ember Particles) */}
      <HeroSection />

      {/* 2. INTRO SECTION (Aged Paper #f0e6cc) */}
      <section className="section-paper py-20 px-6 sm:px-10 lg:px-16 border-b border-[#d8caa7]">
        <div className="max-w-4xl mx-auto text-center reveal-on-scroll">
          <span className="font-label text-xs tracking-[0.2em] text-[#c8860a] uppercase font-bold mb-3 block">
            Nuestra Esencia
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1009] leading-tight mb-6">
            Aquí la comida se cocina <br />
            <span className="text-[#7c2d12] font-oblique-8">con el alma y el fogón.</span>
          </h2>

          <div className="divider-woven-line">
            <span className="divider-woven-diamond" />
          </div>

          <p className="font-body text-base sm:text-lg text-[#1a1009]/85 leading-relaxed max-w-2xl mx-auto">
            Donde Ray es el punto de encuentro en Puerto Viejo donde se rinde tributo a los pioneros afroantillanos.
            Sin prisas, con coco fresco en cada caldero, compás de calypso en la brisa y el calor sincero de atenderte en familia.
          </p>
        </div>
      </section>

      {/* 3. CULTURAL VALUES (Dark Roots #0d1f17) */}
      <section className="section-roots py-24 px-6 sm:px-10 lg:px-16 border-b border-[#c8860a]/20 bg-woven-pattern">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <span className="font-label text-xs tracking-[0.2em] text-[#c8860a] uppercase font-bold mb-2 block">
              Pilares de Nuestra Tierra
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#f0e6cc] font-bold">
              Tradición Viva en Talamanca
            </h2>
            <div className="divider-woven-line">
              <span className="divider-woven-diamond" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.number}
                className="reveal-on-scroll p-8 rounded bg-[#132c21] border border-[#c8860a]/35 flex flex-col justify-between hover:border-[#c8860a] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#c8860a]/20">
                    <span className="font-display text-2xl font-bold text-[#c8860a]">
                      {item.number}
                    </span>
                    <span className="font-label text-[11px] uppercase tracking-widest text-[#f0e6cc]/75 font-semibold">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#f0e6cc] mb-3">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-[#f0e6cc]/80 leading-relaxed">
                    {item.text}
                  </p>
                </div>
                <div className="mt-6 pt-4 flex items-center gap-2">
                  <span className="h-0.5 w-6 bg-[#c8860a]" />
                  <span className="text-[11px] font-label uppercase tracking-widest text-[#c8860a]">
                    Herencia Limonense
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DISHES & SPECIALTIES (Warm Earth #1c0f05) */}
      <section className="section-earth py-24 px-6 sm:px-10 lg:px-16 border-b border-[#c8860a]/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 reveal-on-scroll">
            <div>
              <span className="font-label text-xs tracking-[0.2em] text-[#e59c19] uppercase font-bold mb-2 block">
                Iconos de Limón
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#f0e6cc] font-bold">
                Especialidades de Ray
              </h2>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-sm font-label font-bold tracking-wider text-[#e59c19] hover:text-[#f0e6cc] transition-colors"
            >
              <span>Ver carta caribeña completa</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plato 1 */}
            <div className="reveal-on-scroll rounded bg-[#2c1a0e] border border-[#c8860a]/30 overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={riceAndBeansImg}
                  alt="Rice and Beans con Pollo Caribeño y Patacones"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 right-3 bg-[#c8860a] text-[#0d1f17] text-xs font-label uppercase tracking-widest font-extrabold px-3 py-1 rounded-sm shadow-md">
                  Plato Insignia
                </span>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-label text-xs uppercase tracking-widest text-[#e59c19] font-semibold block mb-1">
                    Receta Ancestral
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#f0e6cc] mb-3">
                    Rice & Beans con Pollo al Fuego
                  </h3>
                  <p className="font-body text-sm text-[#f0e6cc]/80 leading-relaxed mb-6">
                    Arroz y frijoles cocidos en leche de coco pura con tomillo de huerta y chile panameño entero, acompañado de pollo glaseado y patacones dorados.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#c8860a]/20 flex items-center justify-between text-xs font-label text-[#f0e6cc]/70">
                  <span>Cocción lenta a la leña</span>
                  <span className="text-[#c8860a] font-bold">Porción Tradicional</span>
                </div>
              </div>
            </div>

            {/* Plato 2 */}
            <div className="reveal-on-scroll rounded bg-[#2c1a0e] border border-[#c8860a]/30 overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={rondonImg}
                  alt="Rondón tradicional de pescado fresco en leche de coco"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 right-3 bg-[#7c2d12] text-[#f0e6cc] text-xs font-label uppercase tracking-widest font-extrabold px-3 py-1 rounded-sm shadow-md">
                  Caldero de la Casa
                </span>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-label text-xs uppercase tracking-widest text-[#e59c19] font-semibold block mb-1">
                    Pesca de Talamanca
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#f0e6cc] mb-3">
                    Rondón Tradicional de Pargo
                  </h3>
                  <p className="font-body text-sm text-[#f0e6cc]/80 leading-relaxed mb-6">
                    Pargo entero hervido a fuego sosegado en caldo espeso de coco con yuca, plátano verde, ñame y chile panameño que desprende su aroma único.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#c8860a]/20 flex items-center justify-between text-xs font-label text-[#f0e6cc]/70">
                  <span>Servido con patacón</span>
                  <span className="text-[#c8860a] font-bold">Herencia Cahuita</span>
                </div>
              </div>
            </div>

            {/* Plato 3 */}
            <div className="reveal-on-scroll rounded bg-[#2c1a0e] border border-[#c8860a]/30 overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={patiImg}
                  alt="Pati Limonense recién horneado y Agua de Sapo en Puerto Viejo"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 right-3 bg-[#1b533f] text-[#f0e6cc] text-xs font-label uppercase tracking-widest font-extrabold px-3 py-1 rounded-sm shadow-md">
                  Boca Tradicional
                </span>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-label text-xs uppercase tracking-widest text-[#e59c19] font-semibold block mb-1">
                    Para Picar & Brindar
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#f0e6cc] mb-3">
                    Pati Limonense & Agua de Sapo
                  </h3>
                  <p className="font-body text-sm text-[#f0e6cc]/80 leading-relaxed mb-6">
                    Empanadas doradas al horno con carne sazonada con especias antillanas, maridadas con el brebaje fresco de dulce, limón y jengibre.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#c8860a]/20 flex items-center justify-between text-xs font-label text-[#f0e6cc]/70">
                  <span>Horneado al momento</span>
                  <span className="text-[#c8860a] font-bold">Sabor Callejero</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NIGHT BAR & REGGAE (Dark Roots #0d1f17) */}
      <section className="section-roots py-24 px-6 sm:px-10 lg:px-16 border-b border-[#c8860a]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 reveal-on-scroll">
            <div className="relative p-2 rounded bg-[#132c21] border border-[#c8860a]/30 shadow-2xl">
              <img
                src={nightBarImg}
                alt="Ambiente nocturno frente al mar en el bar Donde Ray, Puerto Viejo"
                className="w-full rounded aspect-[4/3] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded bg-[#0d1f17]/95 border border-[#c8860a]/40 backdrop-blur-sm">
                <span className="block text-xs font-label uppercase tracking-widest text-[#e59c19] font-semibold">
                  Música en Vivo Fines de Semana
                </span>
                <strong className="font-display text-lg text-[#f0e6cc] block">
                  Roots Reggae & Calypso Antillano
                </strong>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 reveal-on-scroll">
            <span className="font-label text-xs tracking-[0.2em] text-[#c8860a] uppercase font-bold mb-2 block">
              La Noche Caribeña
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#f0e6cc] font-bold mb-6">
              Tragos con alma, <br />
              <span className="text-[#c8860a] font-oblique-8">fuego y buena vibra.</span>
            </h2>

            <p className="font-body text-base text-[#f0e6cc]/85 leading-relaxed mb-6">
              Al caer el sol en Playa Chiquita, Donde Ray enciende sus faroles ámbar. El aroma a coco y chile inunda la terraza mientras el bar vibra con locales, surfistas y viajeros unidos bajo el mismo compás.
            </p>

            {/* Custom Cocktail Grid (No generic emojis) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {COCKTAILS.map((c) => (
                <div
                  key={c.name}
                  className="p-3.5 rounded bg-[#14291f] border border-[#c8860a]/25 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#c8860a]" />
                    <strong className="text-sm font-label uppercase tracking-wider text-[#f0e6cc]">
                      {c.name}
                    </strong>
                  </div>
                  <span className="text-xs text-[#f0e6cc]/70 font-body">
                    {c.desc}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs font-body text-[#f0e6cc]/75 italic mb-8">
              Nuestro espacio opera a capacidad controlada para resguardar la intimidad y el servicio cálido.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/reservar" className="btn-artisan-gold">
                Reservar mesa en el bar
              </Link>
              <Link
                to="/menu"
                className="text-sm font-label uppercase tracking-wider text-[#f0e6cc] hover:text-[#c8860a] transition-colors py-2 px-3"
              >
                Ver carta de bebidas ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HISTORY & CULTURAL STAMP (Aged Paper #f0e6cc) */}
      <section id="nosotros" className="section-paper py-24 px-6 sm:px-10 lg:px-16 border-b border-[#d8caa7]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 flex justify-center reveal-on-scroll">
            <div className="w-64 h-64 rounded-full border-4 border-dashed border-[#c8860a] flex flex-col items-center justify-center p-6 text-center bg-[#ebe1c5] shadow-inner">
              <span className="font-display text-4xl font-black text-[#7c2d12] tracking-tighter mb-1">
                RAY
              </span>
              <span className="font-label text-xs uppercase tracking-[0.24em] text-[#1a1009] font-bold mb-2">
                Donde Ray
              </span>
              <span className="h-0.5 w-12 bg-[#c8860a] mb-2" />
              <span className="text-[11px] font-body text-[#1a1009]/80 uppercase tracking-widest">
                Puerto Viejo · Talamanca
                <br />
                One Love · Limón
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 reveal-on-scroll">
            <span className="font-label text-xs tracking-[0.2em] text-[#7c2d12] uppercase font-bold mb-2 block">
              Cultura Afrocostarricense
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1a1009] font-bold mb-6">
              La mesa caribeña <br />
              <span className="text-[#7c2d12] font-oblique-8">es hermandad y resistencia.</span>
            </h2>

            <p className="font-body text-base text-[#1a1009]/85 leading-relaxed mb-4">
              Donde Ray nació en Puerto Viejo para honrar a los pioneros afroantillanos que levantaron la provincia de Limón con trabajo, dignidad y una cultura culinaria inigualable.
            </p>
            <p className="font-body text-base text-[#1a1009]/85 leading-relaxed mb-8">
              En nuestra cocina el carbón vegetal y el fogón lento sazonan cada momento, el sonido de las olas acompaña la tertulia y el reggae roots marca el latido fraterno de la comunidad.
            </p>

            <Link to="/reservar" className="btn-artisan-gold">
              Apartar mi lugar en la mesa →
            </Link>
          </div>
        </div>
      </section>

      {/* 7. LOCATION & CONTACT (Warm Earth #1c0f05) */}
      <section className="section-earth py-20 px-6 sm:px-10 lg:px-16">
        <div className="max-w-5xl mx-auto text-center reveal-on-scroll">
          <span className="font-label text-xs tracking-[0.2em] text-[#e59c19] uppercase font-bold mb-2 block">
            Te Esperamos Frente al Caribe
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#f0e6cc] font-bold mb-10">
            Tu mesa está lista en Puerto Viejo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
            <div className="p-6 rounded bg-[#2c1a0e] border border-[#c8860a]/25">
              <span className="dot-dash-indicator text-xs font-label uppercase tracking-widest text-[#e59c19] font-bold mb-3 block">
                Ubicación
              </span>
              <span className="block text-sm text-[#f0e6cc] font-body leading-relaxed">
                Playa Chiquita & Centro, Puerto Viejo de Talamanca, Limón
              </span>
            </div>

            <div className="p-6 rounded bg-[#2c1a0e] border border-[#c8860a]/25">
              <span className="dot-dash-indicator text-xs font-label uppercase tracking-widest text-[#e59c19] font-bold mb-3 block">
                Horario
              </span>
              <span className="block text-sm text-[#f0e6cc] font-body leading-relaxed">
                Martes a Domingo
                <br />
                12:00 MD a 10:00 PM
              </span>
            </div>

            <div className="p-6 rounded bg-[#2c1a0e] border border-[#c8860a]/25">
              <span className="dot-dash-indicator text-xs font-label uppercase tracking-widest text-[#e59c19] font-bold mb-3 block">
                Contacto
              </span>
              <a
                href="mailto:wapin@donderay.com"
                className="block text-sm text-[#e59c19] font-body hover:underline"
              >
                wapin@donderay.com
              </a>
              <span className="text-xs text-[#f0e6cc]/70 block mt-1">
                Atención y Reservas Especiales
              </span>
            </div>
          </div>

          <Link to="/reservar" className="btn-heartbeat-cta">
            <span>Reservar mesa ahora</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
