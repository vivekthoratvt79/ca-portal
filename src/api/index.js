import axios from 'axios';

const API = axios.create({
  baseURL: 'http://72.44.48.45:4000/',
});
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

// =====================   ORDERS  ============================

export const getDataUploadStageDetails = (agentRef, serviceRef, adminRef) =>
  agentRef
    ? API.get(
        `/gstr1/getDataUploadStageDetails?agentRef=${agentRef}serviceRef=${serviceRef}&adminRef=${adminRef}`
      )
    : API.get(
        `/gstr1/getDataUploadStageDetails?serviceRef=${serviceRef}&adminRef=${adminRef}`
      );

export const getWorkingStageDetails = (agentRef, serviceRef, adminRef) =>
  agentRef
    ? API.get(
        `/gstr1/getWorkingStageDetails?agentRef=${agentRef}serviceRef=${serviceRef}&adminRef=${adminRef}`
      )
    : API.get(
        `/gstr1/getWorkingStageDetails?serviceRef=${serviceRef}&adminRef=${adminRef}`
      );

export const getSubmitStageDetails = (agentRef, serviceRef, adminRef) =>
  agentRef
    ? API.get(
        `/gstr1/getSubmitStageDetails?agentRef=${agentRef}serviceRef=${serviceRef}&adminRef=${adminRef}`
      )
    : API.get(
        `/gstr1/getSubmitStageDetails?serviceRef=${serviceRef}&adminRef=${adminRef}`
      );

export const getCompleteStageDetails = (agentRef, serviceRef, adminRef) =>
  agentRef
    ? API.get(
        `/gstr1/getCompleteStageDetails?agentRef=${agentRef}serviceRef=${serviceRef}&adminRef=${adminRef}`
      )
    : API.get(
        `/gstr1/getCompleteStageDetails?serviceRef=${serviceRef}&adminRef=${adminRef}`
      );
