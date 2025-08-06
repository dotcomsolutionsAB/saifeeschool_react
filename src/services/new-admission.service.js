import { postRequest } from "./api.request";

const NEW_ADMISSION_PATH = "/admissions";

export const newAdmission = async (body) =>
  await postRequest(`${NEW_ADMISSION_PATH}/${body?.class}`, body, true);
