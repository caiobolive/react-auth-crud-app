import axios from '../axios';

export const crudService = {
  getUsers: async (page = 1) => {
    const response = await axios.get(`/users?page=${page}`);
    return response.data;
  },

  getUser: async (id) => {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axios.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await axios.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
  },
};
