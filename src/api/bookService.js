import axiosInstance from './axiosConfig';

const bookService = {
  getAllBooks: async () => {
    const response = await axiosInstance.get('/library/books');
    return response.data;
  },

  getBookById: async (id) => {
    const response = await axiosInstance.get(`/library/books/${id}`);
    return response.data;
  },

  createBook: async (bookData) => {
    const response = await axiosInstance.post('/library/books', bookData);
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const response = await axiosInstance.put(`/library/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await axiosInstance.delete(`/library/books/${id}`);
    return response.data;
  },

};

export default bookService;