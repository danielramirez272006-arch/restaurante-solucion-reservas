import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const dishes = [
	{ title: 'Mogambos', detail: 'Crujientes por fuera, suaves por dentro.', tone: 'coral', image: '/limon-food.jpg' },
	{ title: 'Rice & Beans', detail: 'Arroz, frijol, coco y todo el sabor.', tone: 'gold', image: '/limon-food.jpg' },
	{ title: 'Rondón', detail: 'Cremoso, sabroso y lleno de historia.', tone: 'green', image: '/limon-food.jpg' },
]

const cultureWords = ['Limón', 'Coco', 'Calipso', 'Patí', 'Rondón', 'Comunidad']

// Melodía y ritmo de calipso caribeño sintetizado con Web Audio API
function createCalypsoPlayer() {
	let audioCtx = null
	let isPlaying = false
	let timerId = null

	const notes = [
		// Frecuencias para una melodía alegre caribeña (estilo steelpan C-Major pentatonic / calypso)
		523.25, 587.33, 659.25, 783.99, 880.0, 1046.5
	]
	const melody = [
		{ note: 0, dur: 0.18 }, { note: 2, dur: 0.18 }, { note: 3, dur: 0.25 },
		{ note: 4, dur: 0.22 }, { note: 3, dur: 0.18 }, { note: 2, dur: 0.22 },
		{ note: 3, dur: 0.35 }, { note: 1, dur: 0.18 }, { note: 2, dur: 0.18 },
		{ note: 0, dur: 0.4 }
	]

	function playTone(freq, duration) {
		if (!audioCtx) return
		const osc = audioCtx.createOscillator()
		const gain = audioCtx.createGain()
		// Forma de onda brillante simulando percusión caribeña
		osc.type = 'triangle'
		osc.frequency.setValueAtTime(freq, audioCtx.currentTime)

		gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
		gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)

		osc.connect(gain)
		gain.connect(audioCtx.destination)
		osc.start()
		osc.stop(audioCtx.currentTime + duration)
	}

	function start() {
		if (!audioCtx) {
			const AudioContextClass = window.AudioContext || window.webkitAudioContext
			if (AudioContextClass) {
				audioCtx = new AudioContextClass()
			}
		}
		if (audioCtx && audioCtx.state === 'suspended') {
			audioCtx.resume()
		}
		isPlaying = true
		let step = 0

		function loop() {
			if (!isPlaying) return
			const item = melody[step % melody.length]
			playTone(notes[item.note], item.dur)
			step++
			timerId = setTimeout(loop, item.dur * 1000 + 40)
		}
		loop()
	}

	function stop() {
		isPlaying = false
		if (timerId) {
			clearTimeout(timerId)
			timerId = null
		}
	}

	return {
		toggle: (callback) => {
			if (isPlaying) {
				stop()
				callback(false)
			} else {
				start()
				callback(true)
			}
		},
		stop: () => stop(),
	}
}

function HomePage() {
	const [isPlayingCalypso, setIsPlayingCalypso] = useState(false)
	const playerRef = useRef(null)

	const handleToggleCalypso = () => {
		if (!playerRef.current) {
			playerRef.current = createCalypsoPlayer()
		}
		playerRef.current.toggle(setIsPlayingCalypso)
	}

	return (
		<main className="mockup-home">
			<section className="mockup-hero">
				<div className="mockup-hero__shade" />

				<div className="mockup-hero__content">
					<div className="mockup-hero__copy">
						<span className="mockup-kicker">Caribe costarricense · Limón</span>
						<h1>De Limón
							<em>pa’ la mesa</em></h1>
						<p>Reservá tu mesa y vení a compartir el sabor del Caribe costarricense.</p>
						<div className="mockup-actions">
							<Link className="mockup-button mockup-button--gold" to="/reservar">Reservar mesa <span>→</span></Link>
							<Link className="mockup-button mockup-button--ghost" to="/menu">Ver el menú</Link>
						</div>
					</div>
					<div className="mockup-hero__family-note">Una casa abierta
						<strong>pa’ todo el que entra</strong></div>
				</div>
				<span className="caribbean-bird caribbean-bird--one" aria-hidden="true">⌁</span>
				<span className="caribbean-bird caribbean-bird--two" aria-hidden="true">⌁</span>
			</section>

			<div className="culture-ribbon" aria-label="Cultura limonense">
				<span className="culture-ribbon__pattern">◇◆◇◆◇</span>
				{cultureWords.map((word) => <span key={word}>{word}</span>)}
				<span className="culture-ribbon__pattern">◇◆◇◆◇</span>
			</div>

			<section id="nosotros" className="mockup-intro">
				<div>
					<span className="mockup-kicker mockup-kicker--dark">Comida · música · memoria</span>
					<h2>El Caribe también
						<em>se escucha.</em></h2>
				</div>
				<div className="mockup-intro__copy">
					<p>Historias, recetas y ritmos que mantienen viva nuestra cultura. Aquí la mesa no es solo un lugar: es donde nos volvemos a encontrar.</p>
					<button
						className={`mockup-button ${isPlayingCalypso ? 'mockup-button--gold' : 'mockup-button--green'}`}
						type="button"
						onClick={handleToggleCalypso}
						aria-pressed={isPlayingCalypso}
					>
						<span>{isPlayingCalypso ? '⏹' : '▶'}</span>
						{isPlayingCalypso ? 'Pausar calipso' : 'Escuchar calipso'}
					</button>
				</div>
			</section>

			<section className="dish-section" aria-labelledby="dish-title">
				<div className="section-heading--mockup"><div><span className="mockup-kicker mockup-kicker--dark">De la cocina a la mesa</span><h2 id="dish-title">Platos con raíz</h2></div><Link to="/menu">Ver menú completo →</Link></div>
				<div className="dish-grid--mockup">
					{dishes.map((dish, index) => <article className={`dish-tile dish-tile--${dish.tone}`} key={dish.title}>
						<div className="dish-tile__image" style={{ backgroundImage: `url(${dish.image})`, backgroundPosition: `${35 + index * 30}% center` }} />
						<div className="dish-tile__body"><span>0{index + 1}</span><h3>{dish.title}</h3><p>{dish.detail}</p><Link to="/menu">Conocer más →</Link></div>
					</article>)}
				</div>
			</section>

			<section className="mockup-booking-strip">
				<h2>Reservá tu mesa</h2><span>01 Elegí fecha y hora</span><span>02 Contanos cuántos son</span><span>03 Confirmá y listo</span><Link className="mockup-button mockup-button--dark" to="/reservar">Empezar →</Link>
			</section>
		</main>
	)
}

export default HomePage