import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

const getAuthHeader = () => {
  const token = localStorage.getItem('safevault_token');
  return token ? { Authorization: `Bearer ${token}` } : {}; 
};

export const authRegister = async ({ name, email, password }) => {
  const res = await axios.post(`${BACKEND_URL}/api/auth/register`, { name, email, password });
  return res.data;
};

export const authLogin = async ({ email, password }) => {
  const res = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
  return res.data;
};

/** GET /api/auth/me - Get current user (requires JWT) */
export const fetchMe = async () => {
  const res = await axios.get(`${BACKEND_URL}/api/auth/me`, { headers: getAuthHeader() });
  return res.data;
};

export const uploadFiles = async (files, onUploadProgress) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  const res = await axios.post(`${BACKEND_URL}/api/files/upload`, formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return res.data;
};

/** Fetch files. deleted=true returns recycle bin items. */
export const fetchFiles = async (deleted = false) => {
  const res = await axios.get(`${BACKEND_URL}/api/files`, { headers: getAuthHeader() });
  const files = res.data.files || [];
  return deleted ? files.filter((f) => f.isDeleted) : files.filter((f) => !f.isDeleted);
};

export const deleteFile = async (id) => {
  const res = await axios.post(`${BACKEND_URL}/api/files/delete/${id}`, {}, { headers: getAuthHeader() });
  return res.data;
};

export const restoreFile = async (id) => {
  const res = await axios.post(`${BACKEND_URL}/api/files/restore/${id}`, {}, { headers: getAuthHeader() });
  return res.data;
};

export const permanentDelete = async (id) => {
  const res = await axios.post(`${BACKEND_URL}/api/files/deletePermanent/${id}`, {}, { headers: getAuthHeader() });
  return res.data;
};

/** Alias for permanentDelete */
export const permanentDeleteFile = permanentDelete;

export const downloadFile = async (id, name) => {
  const res = await axios.get(`${BACKEND_URL}/api/files/download/${id}`, {
    headers: getAuthHeader(),
    responseType: 'blob',
  });
  const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const fetchDashboard = async () => {
  const res = await axios.get(`${BACKEND_URL}/api/dashboard`, { headers: getAuthHeader() });
  return res.data;
};

export const fetchLogs = async () => {
  const res = await axios.get(`${BACKEND_URL}/api/logs`, { headers: getAuthHeader() });
  return res.data.logs;
};

export const fetchVersions = async (originalName) => {
  const res = await axios.get(`${BACKEND_URL}/api/files/versions/${encodeURIComponent(originalName)}`, { headers: getAuthHeader() });
  return res.data.versions;
};
