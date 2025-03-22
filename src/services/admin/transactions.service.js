import { getRequest, postRequest } from "../api.request";

const TRANSACTION_PATH = "/transactions";

export const addMoneyToWallet = async (body) =>
  await postRequest(`${TRANSACTION_PATH}/add-money-to-wallet`, body);

export const paymentAttempts = async (body) =>
  await postRequest(`${TRANSACTION_PATH}/payment-attempts`, body);

export const getAllTransactions = async (body) =>
  await postRequest(`${TRANSACTION_PATH}/all`, body);

export const getRecords = async (body) =>
  await postRequest(`${TRANSACTION_PATH}/records`, body);

export const getPaymentModes = async () =>
  await getRequest(`${TRANSACTION_PATH}/modes`);
