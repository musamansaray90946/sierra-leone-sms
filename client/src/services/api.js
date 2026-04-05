import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
};

export const studentsAPI = {
  getAll: (params) => API.get('/students', { params }),
  getOne: (id) => API.get(`/students/${id}`),
  create: (data) => API.post('/students', data),
  update: (id, data) => API.put(`/students/${id}`, data),
  delete: (id) => API.delete(`/students/${id}`),
};

export const teachersAPI = {
  getAll: () => API.get('/teachers'),
  getOne: (id) => API.get(`/teachers/${id}`),
};

export const classesAPI = {
  getAll: () => API.get('/classes'),
  create: (data) => API.post('/classes', data),
};

export const attendanceAPI = {
  getAll: (params) => API.get('/attendance', { params }),
  create: (data) => API.post('/attendance', data),
};

export const examsAPI = {
  getAll: () => API.get('/exams'),
  create: (data) => API.post('/exams', data),
  addResults: (id, data) => API.post(`/exams/${id}/results`, data),
};

export const feesAPI = {
  getAll: (params) => API.get('/fees', { params }),
  create: (data) => API.post('/fees', data),
  pay: (id, data) => API.patch(`/fees/${id}/pay`, data),
};

export default API;