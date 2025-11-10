import axios from "axios";

const BASE_URL = 'https://jsonplaceholder.typicode.com/'
const API_TIMEOUT = 60000

const apiClient = axios.create({
  baseURL: BASE_URL,
  allowAbsoluteUrls: true,
  timeout: API_TIMEOUT, // 60 sec
});

export default apiClient
