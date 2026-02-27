import api from './api';

export const reservationService = {
  create: async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },

  getMyReservations: async () => {
    const response = await api.get('/reservations/my-reservations');
    return response.data;
  },

  getAllReservations: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/reservations/all?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  }
};