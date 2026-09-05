import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const knowledge = [
    { keys: ['mogambo', 'mogambos'], answer: 'Los mogambos son bocaditos crujientes por fuera y suaves por dentro. Van muy bien para compartir en la mesa. Podés ver la carta completa en Menú.' },
    { keys: ['rice', 'beans', 'arroz', 'frijol'], answer: 'Nuestro rice & beans combina arroz, frijol y coco: un clásico de la cocina caribeña limonense, hecho para comer sin prisa.' },
    { keys: ['rondon', 'rondón'], answer: 'El rondón es un guiso cremoso con coco, tubérculos y sabores del mar. Es de esos platos que cuentan una historia en cada cucharada.' },
    { keys: ['pati', 'patí'], answer: 'El patí es una empanada caribeña rellena y especiada. Ideal para empezar la mesa con algo bien de Limón.' },
    { keys: ['reserv', 'mesa', 'cita'], answer: 'Claro. Elegí fecha, hora y cantidad de personas en nuestro calendario completo. Te acompaño desde aquí:', action: 'reservar' },
    { keys: ['horario', 'hora', 'abierto'], answer: 'La disponibilidad real aparece dentro del calendario de reservas. Ahí solo te mostramos horarios que el sistema puede recibir.' },
    { keys: ['limon', 'cultura', 'caribe', 'rastafari', 'calipso'], answer: 'Donde Ray nace desde el Caribe limonense: comunidad, coco, música, memoria y una mesa abierta. La influencia de la diáspora y del calipso está presente con respeto, sin disfrazar Limón de otro lugar.' },
]

function getAnswer(message) {
    const normalized = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const match = knowledge.find((item) => item.keys.some((key) => normalized.includes(key)))
    return match || { answer: 'Te puedo ayudar con el menú, los platos de Limón, horarios y reservas. Probá preguntarme por mogambos, rice & beans, rondón o cómo reservar.' }
}

function DondeRayChatbot() {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([{ from: 'bot', text: '¡Buenas! Soy la voz de Donde Ray. Preguntame por la comida, la cultura de Limón o tu próxima mesa.' }])
    const suggestions = useMemo(() => ['¿Qué es el rondón?', 'Quiero reservar', '¿Qué tienen de Limón?'], [])

    const sendMessage = (value = message) => {
        const clean = value.trim()
        if (!clean) return
        const result = getAnswer(clean)
        setMessages((current) => [...current, { from: 'user', text: clean }, { from: 'bot', text: result.answer, action: result.action }])
        setMessage('')
    }

    return <div className={`ray-chat ${open ? 'ray-chat--open' : ''}`}>
        {open && <section className="ray-chat__panel" aria-label="Asistente de Donde Ray">
            <header className="ray-chat__header"><span className="ray-chat__sun">DR</span><div><strong>La voz de Donde Ray</strong><small>Caribe limonense · en línea</small></div><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar chatbot">×</button></header>
            <div className="ray-chat__messages">{messages.map((item, index) => <div className={`ray-chat__message ray-chat__message--${item.from}`} key={`${item.text}-${index}`}>{item.text}{item.action === 'reservar' && <Link to="/reservar" className="ray-chat__action">Abrir reservas →</Link>}</div>)}</div>
            <div className="ray-chat__suggestions">{suggestions.map((item) => <button type="button" key={item} onClick={() => sendMessage(item)}>{item}</button>)}</div>
            <form className="ray-chat__form" onSubmit={(event) => { event.preventDefault(); sendMessage() }}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Escribí tu pregunta..." aria-label="Pregunta para Donde Ray" /><button type="submit" aria-label="Enviar mensaje">→</button></form>
        </section>}
        <button className="ray-chat__trigger" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}><span className="ray-chat__bird">⌁</span><span>{open ? 'Cerrar' : '¿Hablamos?'}</span></button>
    </div>
}

export default DondeRayChatbot