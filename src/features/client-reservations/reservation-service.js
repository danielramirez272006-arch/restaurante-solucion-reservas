/**
 * Servicio de API REST para el módulo de reservas de clientes en "Donde Ray".
 * Consume el backend simulado con JSON Server en http://localhost:3001/reservations
 */

import { mockFetch } from '../../shared/services/mock-api.js';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/reservations` : '/reservations';

/**
 * Función auxiliar para procesar respuestas de la Fetch API
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody && errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      // Ignorar si el cuerpo no es JSON
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const reservationService = {
  /**
   * Obtiene todas las reservas registradas para una fecha específica.
   * Utilizado para calcular la ocupación dinámica de cupos (Regla 4).
   * 
   * @param {string} date Formato 'YYYY-MM-DD'
   * @returns {Promise<Array>} Lista de reservas para la fecha
   */
  async getReservationsByDate(date) {
    if (!date) return [];
    try {
      const response = await mockFetch(`${API_BASE_URL}?date=${encodeURIComponent(date)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`[reservationService] Error al obtener reservas para la fecha ${date}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene las reservas exclusivas de un cliente específico usando query param (Regla 5).
   * 
   * @param {string|number} userId Identificador único del usuario
   * @returns {Promise<Array>} Lista de reservas del usuario
   */
  async getUserReservations(userId) {
    if (!userId) return [];
    try {
      // JSON Server soporta ordenamiento usando _sort y _order
      const url = `${API_BASE_URL}?userId=${encodeURIComponent(userId)}`;
      const response = await mockFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await handleResponse(response);
      // Ordenar por fecha y hora descendente para mostrar las más recientes primero
      return Array.isArray(data)
        ? data.sort((a, b) => new Date(`${b.date}T${b.time || '00:00'}`) - new Date(`${a.date}T${a.time || '00:00'}`))
        : [];
    } catch (error) {
      console.error(`[reservationService] Error al obtener reservas del usuario ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene una reserva individual por su ID
   * 
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async getReservationById(id) {
    if (!id) throw new Error('Se requiere el ID de la reserva.');
    try {
      const response = await mockFetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`[reservationService] Error al obtener la reserva ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva reserva en JSON Server respetando el contrato de datos y Regla 3 (status: 'Pendiente').
   * 
   * @param {Object} reservationData Datos de la reserva
   * @returns {Promise<Object>} Reserva creada
   */
  async createReservation(reservationData) {
    // Garantizar contrato exacto y campos requeridos
    const payload = {
      userId: reservationData.userId,
      guestName: reservationData.guestName.trim(),
      email: reservationData.email.trim().toLowerCase(),
      phone: reservationData.phone.trim(),
      date: reservationData.date,
      time: reservationData.time,
      guests: Number(reservationData.guests),
      type: reservationData.type,
      notes: reservationData.notes ? reservationData.notes.trim() : '',
      // REGLA 3: Toda nueva reserva creada debe tener obligatoriamente el status: 'Pendiente'
      status: 'Pendiente',
      // Aliases de compatibilidad con el panel de administración
      estado: 'Pendiente',
      cliente: reservationData.guestName.trim(),
      createdAt: reservationData.createdAt || new Date().toISOString()
    };

    try {
      const response = await mockFetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[reservationService] Error al crear la reserva:', error);
      throw error;
    }
  },

  /**
   * Actualiza o reagenda parcialmente una reserva existente
   * 
   * @param {string|number} id ID de la reserva
   * @param {Object} partialData Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateReservation(id, partialData) {
    if (!id) throw new Error('Se requiere el ID de la reserva a actualizar.');
    try {
      const response = await mockFetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...partialData,
          updatedAt: new Date().toISOString()
        })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`[reservationService] Error al actualizar la reserva ${id}:`, error);
      throw error;
    }
  },

  /**
   * Permite al cliente cancelar una de sus reservas
   * 
   * @param {string|number} id ID de la reserva
   * @returns {Promise<Object>}
   */
  async cancelReservation(id) {
    if (!id) throw new Error('Se requiere el ID de la reserva a cancelar.');
    try {
      const response = await mockFetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'Cancelada',
          estado: 'Cancelada',
          cancelledAt: new Date().toISOString()
        })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`[reservationService] Error al cancelar reserva ${id}:`, error);
      throw error;
    }
  }
};
