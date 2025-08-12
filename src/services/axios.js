import axios from 'axios';
import { store } from '../store/store';

axios.interceptors.request.use(
  (config) => {
    const { userData } = store.getState().userData;
    config.baseURL = 'https://reqres.in/api';

    if (config.headers) {
      config.headers['x-api-key'] = 'reqres-free-v1';
    }

    if (userData?.token && config.headers) {
      config.headers.Authorization = `Bearer ${userData?.token}`;
    }

    return config;
  },
  () => {
    return Promise.reject('Ocorreu um erro !');
  },
);

export default axios;
