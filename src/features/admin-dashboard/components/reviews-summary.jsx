const sentimentLabels = {
  positiva: 'Positiva',
  negativa: 'Negativa',
  neutro: 'Neutro',
  incognito: 'Incógnito',
}

export default function ReviewsSummary({ stats }) {
  const sentiment = stats?.sentiment || {}
  const average = Number(stats?.averageRating || 0)
  const stars = Array.from({ length: 5 }, (_, index) => index < Math.round(average))

  return (
    <section className="reviews-dashboard-panel panel" aria-label="Comentarios y reputación">
      <div className="reviews-dashboard-header">
        <div>
          <span className="eyebrow">La voz de la mesa</span>
          <h2>Comentarios que cuentan <em>nuestra historia.</em></h2>
          <p>Score general basado en las experiencias registradas por quienes han venido a comer.</p>
        </div>
        <div className="review-score-orb">
          <strong>{average.toFixed(1)}</strong>
          <span>/ 5</span>
          <div className="review-stars" aria-label={`${average} de 5 estrellas`}>{stars.map((filled, index) => <span key={index} className={filled ? 'is-filled' : ''}>★</span>)}</div>
        </div>
      </div>
      <div className="sentiment-grid">
        {Object.entries(sentimentLabels).map(([key, label]) => (
          <div className={`sentiment-chip sentiment-chip--${key}`} key={key}>
            <span>{label}</span>
            <strong>{sentiment[key] || 0}</strong>
          </div>
        ))}
      </div>
      <div className="review-feed">
        {(stats?.latest || []).map((review) => (
          <article className="review-feed-card" key={review.id}>
            <div className="review-feed-top">
              <strong>{review.visibility === 'incognito' ? 'Comensal incógnito' : review.author || 'Comensal'}</strong>
              <span className="review-rating">{'★'.repeat(Number(review.rating))}{'☆'.repeat(5 - Number(review.rating))}</span>
            </div>
            <p>“{review.comment}”</p>
            <small>{sentimentLabels[review.sentiment] || 'Neutro'} · {review.date || 'Sin fecha'}</small>
          </article>
        ))}
      </div>
    </section>
  )
}
