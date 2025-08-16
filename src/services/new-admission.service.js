import { getRequest, postRequest } from "./api.request";

const NEW_ADMISSION_PATH = "/admission";

export const newAdmission = async (body) =>
  await postRequest(`${NEW_ADMISSION_PATH}`, body, true);

export const checkApplicationStatus = async (params) =>
  await getRequest(`${NEW_ADMISSION_PATH}/check/${params.applicationNo}`);

export const getPaymentStatus = async (body) =>
  await getRequest(`admission/confirmation/${body?.txn_id}`);
