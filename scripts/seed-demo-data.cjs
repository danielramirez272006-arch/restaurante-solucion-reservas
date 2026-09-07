const fs = require('node:fs')
const path = require('node:path')

const file = path.resolve(process.cwd(), 'db.json')
const db = JSON.parse(fs.readFileSync(file, 'utf8'))

const users = [
  ['u-ana', 'Ana Rodríguez', 'ana.rodriguez@demo.com', '+506 8888 1001'],
  ['u-mateo', 'Mateo Vargas', 'mateo.vargas@demo.com', '+506 8888 1002'],
  ['u-sofia', 'Sofía Castillo', 'sofia.castillo@demo.com', '+506 8888 1003'],
  ['u-diego', 'Diego Jiménez', 'diego.jimenez@demo.com', '+506 8888 1004'],
  ['u-valeria', 'Valeria Solano', 'valeria.solano@demo.com', '+506 8888 1005'],
  ['u-nicolas', 'Nicolás Rojas', 'nicolas.rojas@demo.com', '+506 8888 1006'],
  ['u-carolina', 'Carolina Méndez', 'carolina.mendez@demo.com', '+506 8888 1007'],
  ['u-esteban', 'Esteban Mora', 'esteban.mora@demo.com', '+506 8888 1008'],
  ['u-mariana', 'Mariana Chaves', 'mariana.chaves@demo.com', '+506 8888 1009'],
  ['u-julian', 'Julián Pérez', 'julian.perez@demo.com', '+506 8888 1010'],
  ['u-laura', 'Laura Gómez', 'laura.gomez@demo.com', '+506 8888 1011'],
  ['u-carlos', 'Carlos Mendoza', 'carlos.mendoza@demo.com', '+506 8888 1012'],
].map(([id, name, email, phone]) => ({ id, name, email, password: '1234', role: 'user', phone }))

const existingUserIds = new Set(db.users.map((user) => user.id))
db.users.push(...users.filter((user) => !existingUserIds.has(user.id)))

const reservationTemplates = [
  ['u-ana', 'Ana Rodríguez', 'ana.rodriguez@demo.com', '2026-08-22', '19:00', 2, 'Aniversario', 'Mesa tranquila junto al jardín'],
  ['u-mateo', 'Mateo Vargas', 'mateo.vargas@demo.com', '2026-08-23', '20:00', 4, 'Cena', ''],
  ['u-sofia', 'Sofía Castillo', 'sofia.castillo@demo.com', '2026-08-24', '13:00', 3, 'Familiar', 'Alérgica a nueces'],
  ['u-diego', 'Diego Jiménez', 'diego.jimenez@demo.com', '2026-08-30', '19:00', 6, 'Cumpleaños', ''],
  ['u-valeria', 'Valeria Solano', 'valeria.solano@demo.com', '2026-08-31', '20:00', 2, 'Romántica', ''],
  ['u-nicolas', 'Nicolás Rojas', 'nicolas.rojas@demo.com', '2026-09-01', '12:00', 5, 'Negocios', ''],
  ['u-carolina', 'Carolina Méndez', 'carolina.mendez@demo.com', '2026-09-02', '18:00', 4, 'Cena', ''],
  ['u-esteban', 'Esteban Mora', 'esteban.mora@demo.com', '2026-09-03', '19:00', 2, 'Cena', ''],
  ['u-mariana', 'Mariana Chaves', 'mariana.chaves@demo.com', '2026-09-05', '13:00', 3, 'Almuerzo', ''],
  ['u-julian', 'Julián Pérez', 'julian.perez@demo.com', '2026-09-06', '20:00', 8, 'Familiar', ''],
  ['u-laura', 'Laura Gómez', 'laura.gomez@demo.com', '2026-09-08', '19:00', 4, 'Cena', ''],
  ['u-carlos', 'Carlos Mendoza', 'carlos.mendoza@demo.com', '2026-09-10', '20:00', 5, 'Negocios', ''],
]
const existingReservationIds = new Set(db.reservations.map((reservation) => reservation.id))
const reservations = reservationTemplates.map(([userId, guestName, email, date, time, guests, type, notes], index) => ({
  id: `demo-res-${index + 1}`,
  userId,
  guestName,
  cliente: guestName,
  email,
  phone: db.users.find((user) => user.id === userId)?.phone || '',
  date,
  time,
  guests,
  type,
  notes,
  status: index % 5 === 0 ? 'Pendiente' : 'Confirmada',
  estado: index % 5 === 0 ? 'Pendiente' : 'Confirmada',
  createdAt: `${date}T10:00:00.000Z`,
}))
db.reservations.push(...reservations.filter((reservation) => !existingReservationIds.has(reservation.id)))

db.reviews = [
  { id: 'review-001', userId: 'u-ana', author: 'Ana R.', rating: 5, sentiment: 'positiva', visibility: 'publica', comment: 'El rondón tiene un sabor profundo y el servicio se siente muy cercano.', date: '2026-08-22' },
  { id: 'review-002', userId: 'u-mateo', author: 'Mateo V.', rating: 5, sentiment: 'positiva', visibility: 'publica', comment: 'Excelente rice & beans, porciones generosas y música preciosa.', date: '2026-08-23' },
  { id: 'review-003', userId: 'u-sofia', author: 'Sofía C.', rating: 4, sentiment: 'positiva', visibility: 'publica', comment: 'La comida estuvo deliciosa. Volveríamos por el patí.', date: '2026-08-24' },
  { id: 'review-004', userId: 'u-diego', author: 'Diego J.', rating: 3, sentiment: 'neutro', visibility: 'publica', comment: 'La experiencia fue buena, aunque esperamos un poco por la mesa.', date: '2026-08-30' },
  { id: 'review-005', userId: 'u-valeria', author: 'Valeria S.', rating: 5, sentiment: 'positiva', visibility: 'publica', comment: 'Una noche caribeña hermosa. Ray explica cada plato con mucha pasión.', date: '2026-08-31' },
  { id: 'review-006', userId: 'u-nicolas', author: 'Nicolás R.', rating: 2, sentiment: 'negativa', visibility: 'publica', comment: 'El plato llegó más tarde de lo esperado.', date: '2026-09-01' },
  { id: 'review-007', userId: 'u-carolina', author: 'Carolina M.', rating: 5, sentiment: 'positiva', visibility: 'publica', comment: 'El ambiente, el coco y el fuego hacen que la visita sea inolvidable.', date: '2026-09-02' },
  { id: 'review-008', userId: 'u-esteban', author: 'Anónimo', rating: 4, sentiment: 'positiva', visibility: 'incognito', comment: 'Muy buen balance entre tradición y una presentación moderna.', date: '2026-09-03' },
  { id: 'review-009', userId: 'u-mariana', author: 'Mariana C.', rating: 5, sentiment: 'positiva', visibility: 'publica', comment: 'El mejor patí que hemos probado en Limón.', date: '2026-09-05' },
  { id: 'review-010', userId: 'u-julian', author: 'Julián P.', rating: 4, sentiment: 'positiva', visibility: 'publica', comment: 'Un lugar con identidad y una atención muy cálida.', date: '2026-09-06' },
]

fs.writeFileSync(file, `${JSON.stringify(db, null, 2)}\n`)
console.log(`Seed completado: ${db.users.length} usuarios, ${db.reservations.length} reservas y ${db.reviews.length} comentarios.`)
