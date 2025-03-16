import axiosInstance from './axiosConfig';

const transactionService = {
  processTransaction: async (transactionData) => {

    const userId = JSON.parse(localStorage.getItem('user')).id;

    const formattedData = {
      user: {
        id: userId
      },
      transactions: [
        ...(transactionData.purchases.length > 0 ? [{
          type: "purchase",
          items: transactionData.purchases.map(item => ({
            book: {
              id: item.bookId
            },
            quantity: item.quantity
          }))
        }] : []),
        ...transactionData.loans.map(loan => ({
          type: "loan",
          book: {
            id: loan.bookId
          }
        }))
      ]
    };

    const response = await axiosInstance.post('/library/bills', formattedData);
    return response.data;
  },

  getTransactions: async () => {
    const response = await axiosInstance.get('/library/bills');
    return response.data;
  },

  getTransaction: async (id) => {
    const response = await axiosInstance.get(`/library/bills/${id}`);
    return response.data;
  }
};

export default transactionService; 