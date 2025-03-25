import { postRequest } from "../api.request";

const FEES_PATH = "/fee";

// fees apis

export const getAllFees = async (body) =>
  await postRequest(`${FEES_PATH}/view_all`, body);

export const getOneTimeFees = async (body) =>
  await postRequest(`${FEES_PATH}/one_time`, body);
