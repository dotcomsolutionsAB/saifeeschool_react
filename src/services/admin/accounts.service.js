import { getRequest, postRequest, deleteRequest } from "../api.request";

const CASH_RECEIVED_PATH = "/transactions/admin_transactions";
const DEBIT_PATH = "/debit-note";
const CREDIT_PATH = "/credit-note";
const BANK_PATH = "/bank";

// cash received apis
export const getCashReceived = async (params) =>
  await getRequest(`${CASH_RECEIVED_PATH}`, params);

export const createCashReceived = async (body) =>
  await postRequest(`${CASH_RECEIVED_PATH}`, body);

export const updateCashReceived = async (body) =>
  await postRequest(`${CASH_RECEIVED_PATH}/${body?.id}`, body);

export const deleteCashReceived = async (body) =>
  await deleteRequest(`${CASH_RECEIVED_PATH}/${body?.id}`);

// debit apis
export const getDebit = async (params) =>
  await getRequest(`${DEBIT_PATH}`, params);

export const createDebitVoucher = async (body) =>
  await postRequest(`${DEBIT_PATH}`, body);

export const updateDebitVoucher = async (body) =>
  await postRequest(`${DEBIT_PATH}/${body?.id}`, body);

export const deleteDebitVoucher = async (body) =>
  await deleteRequest(`${DEBIT_PATH}/${body?.id}`);

export const printDebitPdf = async (body) =>
  await getRequest(`${DEBIT_PATH}/print/${body?.id}`);

// credit apis
export const getCredit = async () => await getRequest(`${CREDIT_PATH}`);

export const createCreditVoucher = async (body) =>
  await postRequest(`${CREDIT_PATH}`, body);

export const updateCreditVoucher = async (body) =>
  await postRequest(`${CREDIT_PATH}/${body?.id}`, body);

export const deleteCreditVoucher = async (body) =>
  await deleteRequest(`${CREDIT_PATH}/${body?.id}`);

export const printCreditPdf = async (body) =>
  await getRequest(`${CREDIT_PATH}/print/${body?.id}`);

// bank apis
export const getBankTransactions = async () => await getRequest(`${BANK_PATH}`);

export const createBankTransaction = async (body) =>
  await postRequest(`${BANK_PATH}`, body);

export const updateBankTransaction = async (body) =>
  await postRequest(`${BANK_PATH}/${body?.id}`, body);

export const deleteBankTransaction = async (body) =>
  await deleteRequest(`${BANK_PATH}/${body?.id}`);
