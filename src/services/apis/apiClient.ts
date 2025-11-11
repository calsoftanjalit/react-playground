import axios from 'axios';
import { API_TIMEOUT } from '@/constants/api';

const BASE_URL = 'https://dummyjson.com/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  allowAbsoluteUrls: true,
  timeout: API_TIMEOUT, // 60 sec
});

export default apiClient;
