import axios from 'axios';

const API = axios.create({
  baseURL: 'http://34.229.58.48:4000/api/',
});

export const notificationSubscribe = (data) =>
  API.post('/notification/subscribe', data);

export const sendNotification = (data) =>
  API.post('/notification/sendNotification', data);

// API.interceptors.request.use((req) => {
//   if (localStorage.getItem('profile')) {
//     req.headers.authorization = `Bearer ${
//       JSON.parse(localStorage.getItem('profile')).token
//     }`;
//   }
//   return req;
// });

export const fetchForAdmin = (role, adminId) =>
  API.get(`/list/${role}?adminRef=${adminId}`);

export const fetchAdminServices = (adminId) =>
  API.get(`/getAdminServiceData?adminRef=${adminId}`);

export const updateAdminServiceData = (payload) =>
  API.post(`/updateAdminServiceData`, payload);

export const fetchAgentsForManager = (adminId) =>
  API.get(`/getAgentsForManager?managerRef=${adminId}`);

export const fetchClientsForAgent = (agentId) =>
  API.get(`/getClientsForAgent?agentRef=${agentId}`);

export const getAgentServiceMapforClient = (clientRef) =>
  API.get(`/getAgentServiceMapForClient?clientRef=${clientRef}`);

export const getManagerServiceMapForAgent = (agentRef) =>
  API.get(`/getManagerServiceMapForAgent?agentRef=${agentRef}`);

export const assignClientToAgent = (data) =>
  API.post('/assignClientToAgent', data);

export const assignAgentToManager = (data) =>
  API.post('/assignAgentToManager', data);

export const register = (userData) => API.post('/register', userData);

export const fetchClients = () => API.get('/clients');
export const fetchAllServices = () => API.get('/getAllServices');

export const signup = (userData) => API.post(`/user/signup`, userData);
export const signin = (userData) => API.post(`/login`, userData);

export const getAccessKeys = (id) => API.get(`/getAccessKeys?entityID=${id}`);
export const updateAccessKeys = (payload) =>
  API.post(`/updateAccessKeys`, payload);

export const getAllBillsOfAdmin = (payload) =>
  API.post(`/getAllBillsOfAdmin`, payload);

export const getAllBillsOfClient = (payload) =>
  API.post(`/getAllBillsOfClient`, payload);

// =====================   ORDERS  ============================

export const getDataUploadStageDetails = (
  agentRef,
  serviceRef,
  adminRef,
  service
) =>
  agentRef
    ? API.get(
        `/${service}/getDataUploadStageDetails?agentRef=${agentRef}serviceRef=${serviceRef}&adminRef=${adminRef}`
      )
    : API.get(
        `/${service}/getDataUploadStageDetails?serviceRef=${serviceRef}&adminRef=${adminRef}`
      );

export const getWorkingStageDetails = (
  agentRef,
  serviceRef,
  adminRef,
  service
) =>
  agentRef
    ? API.get(
        `/${service}/getWorkingStageDetails?agentRef=${agentRef}serviceRef=${serviceRef}&adminRef=${adminRef}`
      )
    : API.get(
        `/${service}/getWorkingStageDetails?serviceRef=${serviceRef}&adminRef=${adminRef}`
      );

export const getSubmitStageDetails = (
  agentRef,
  serviceRef,
  adminRef,
  service
) =>
  agentRef
    ? API.get(
        `/${service}/getSubmitStageDetails?agentRef=${agentRef}serviceRef=${serviceRef}&adminRef=${adminRef}`
      )
    : API.get(
        `/${service}/getSubmitStageDetails?serviceRef=${serviceRef}&adminRef=${adminRef}`
      );

export const getCompleteStageDetails = (
  agentRef,
  serviceRef,
  adminRef,
  service
) =>
  agentRef
    ? API.get(
        `/${service}/getCompleteStageDetails?agentRef=${agentRef}serviceRef=${serviceRef}&adminRef=${adminRef}`
      )
    : API.get(
        `/${service}/getCompleteStageDetails?serviceRef=${serviceRef}&adminRef=${adminRef}`
      );

export const postClientDataUpload = (formData, service) =>
  API.post(`/${service}/postClientDataUpload`, formData);

export const postWorkingStageDetails = (formData, service) =>
  API.post(`/${service}/postWorkingStageDetails`, formData);

export const postSubmitStageDetails = (formData, service) =>
  API.post(`/${service}/postSubmitStageDetails`, formData);
