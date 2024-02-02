import axios from 'axios';

export const confirmEmail = async (key) => {
  const response = await axios.post(`/confirm/${key}`);
  return response;
};
