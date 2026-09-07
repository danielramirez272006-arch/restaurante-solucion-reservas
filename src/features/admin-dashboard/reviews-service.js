import { apiRequest } from '../../shared/services/api-client'

export function getReviews() {
  return apiRequest('/reviews')
}

export function buildReviewMetrics(reviews = []) {
  const safeReviews = reviews.filter((review) => Number(review.rating) >= 1 && Number(review.rating) <= 5)
  const average = safeReviews.length
    ? safeReviews.reduce((total, review) => total + Number(review.rating), 0) / safeReviews.length
    : 0
  const sentiment = safeReviews.reduce((summary, review) => {
    const key = review.sentiment || 'neutro'
    summary[key] = (summary[key] || 0) + 1
    return summary
  }, { positiva: 0, negativa: 0, neutro: 0, incognito: 0 })

  return {
    total: safeReviews.length,
    average: Number(average.toFixed(1)),
    sentiment,
    latest: [...safeReviews].sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 4),
  }
}
