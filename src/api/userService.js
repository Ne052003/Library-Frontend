import axiosInstance from './axiosConfig';

const userService = {
  getUserProfile: async (token) => {
    const response = await axiosInstance.get('/library/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axiosInstance.get('/library/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axiosInstance.get(`/library/users/${id}`);
    return response.data;
  },

  updateUserProfile: async (userData) => {
    const response = await axiosInstance.put('/library/users/profile', userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/library/users/${id}`);
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await axiosInstance.put(`/library/users/${id}/role`, {
      role: role
    });
    return response.data;
  },

  getUserBills: async (id) => {
    const response = await axiosInstance.get(`/library/users/${id}/bills`);
    return response.data;
  },

  getUserBooks: async (id) => {
    const response = await axiosInstance.get(`/library/users/${id}/books`);
    return response.data;
  }
};

export default userService; 