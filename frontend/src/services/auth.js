import api from './api';

const auth = {
  login: async (username, password) => {
    const response = await api.post('/auth/token/', { username, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/user/');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

export default auth; 