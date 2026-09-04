function Card({ children, className = '' }) {
	return <article className={`ui-card ${className}`.trim()}>{children}</article>
}

export default Card
