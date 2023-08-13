import axios from 'axios';
import { toast } from 'react-toastify';

export const http = axios.create({
  baseURL: 'https://localhost:7083/api',
  // https://svcw-system.azurewebsites.net/api
  // timeout: 3000
});
http.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    toast('Có lỗi xảy ra', { theme: 'light' });

    return Promise.reject(error);
  }
);
