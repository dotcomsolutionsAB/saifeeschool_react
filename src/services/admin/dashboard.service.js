import { postRequest } from "../api.request";

// class group apis

export const getFeeStats = async (body) =>
  await postRequest("/dashboardfee", body);

export const getStudentStats = async (body) =>
  await postRequest("/dashboard", body);

export const getTransactionStats = async (body) =>
  await postRequest("/dashboardtransactions", body);
