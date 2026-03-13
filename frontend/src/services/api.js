import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// FIX: eliminat window.location.href = '/login' care cauza reload infinit.
// App-ul gestioneaza starea de auth prin React state, nu prin redirecturi de browser.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Lasam App.jsx sa gestioneze 401 prin state (setUser(null))
    return Promise.reject(error);
  }
);

const api = {
  async call(endpoint, options = {}) {
    const { method = 'GET', body, headers, ...restOptions } = options;

    try {
      const response = await axiosInstance({
        url: endpoint,
        method,
        data: body ? JSON.parse(body) : undefined,
        headers,
        ...restOptions
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message || 'Request failed');
    }
  }
};

export default api;