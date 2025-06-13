import { postRequest } from "../api.request";

const FEES_PATH = "/fee";

// fees apis

export const getAllFees = async (body) =>
  await postRequest(`${FEES_PATH}/view_all`, body);

export const getOneTimeFees = async (body) =>
  await postRequest(`${FEES_PATH}/one_time`, body);

export const exportTransactions = async (body) =>
  await postRequest(`/transactions/export`, body); // to download the report

export const exportFeesPDF = async (body) =>
  await postRequest(`${FEES_PATH}/export_pdf`, body); // to download the fees pdf report

export const exportFeesExcel = async (body) =>
  await postRequest(`${FEES_PATH}/export_excel`, body); // to download the fees excel report
