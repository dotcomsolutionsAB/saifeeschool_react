import { postRequest } from "../api.request";

const FEES_PATH = "/student";

// fees apis
export const getPendingFees = async (body) =>
  await postRequest(`${FEES_PATH}/fees_pending`, body);

export const getPaidFees = async (body) =>
  await postRequest(`${FEES_PATH}/paid_fees`, body);

export const getTransactions = async (body) =>
  await postRequest(`/transactions/student`, body);

// pay fees
export const payFees = async (body) => await postRequest(`pay-fees`, body);
