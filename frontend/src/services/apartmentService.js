import api from './api';

export const apartmentService = {
  getAll: async () => {
    const response = await api.get('/apartments');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/apartments/${id}`);
    return response.data;
  },

  create: async (apartmentData) => {
    const response = await api.post('/apartments', apartmentData);
    return response.data;
  },

  update: async (id, apartmentData) => {
    const response = await api.put(`/apartments/${id}`, apartmentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/apartments/${id}`);
    return response.data;
  },

  importCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/apartments/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  exportCSV: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/apartments/export?${params}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'apartments.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  }
};