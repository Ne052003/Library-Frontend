import axiosInstance from './axiosConfig';

const billService = {
  getUserBills: async () => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const response = await axiosInstance.get(`/library/bills/user/${userId}`);
    return response.data;
  },

  getBillById: async (id) => {
    const response = await axiosInstance.get(`/library/bills/${id}`);
    return response.data;
  },

  getAllBills: async () => {
    const response = await axiosInstance.get('/library/admin/bills');
    return response.data;
  },
};

export default billService; 