import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor pentru erori
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Wrapper cu metoda .call() pentru compatibilitate
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