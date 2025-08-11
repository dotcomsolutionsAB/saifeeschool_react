import { getRequest, postRequest } from "../api.request";

const STUDENT_PATH = "/student";

// student apis
export const getPendingFees = async (body) =>
  await postRequest(`${STUDENT_PATH}/fees_pending`, body);

export const getPaidFees = async (body) =>
  await postRequest(`${STUDENT_PATH}/paid_fees`, body);

export const getTransactions = async (body) =>
  await postRequest(`/transactions/student`, body);

// pay fees
export const payFees = async (body) => await postRequest(`test-fees`, body);

export const getTransactionStatus = async (body) =>
  await getRequest(`fee/confirmation/${body?.txn_id}`);

export const printFees = async (id) => await getRequest(`/fee/print/${id}`);
