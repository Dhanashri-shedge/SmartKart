import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/vendor';

export const placeVendorOrder = async (orderData) => {
  const response = await axios.post(`${API_BASE_URL}/order`, orderData);
  return response.data;
};
