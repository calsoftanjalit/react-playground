import axios from "axios";

const BASE_URL = 'https://jsonplaceholder.typicode.com/'

const apiClient = axios.create({
  baseURL: BASE_URL,
  allowAbsoluteUrls: true,
  timeout: 60000, // 60 sec
});

export default apiClient