import { postRequest } from "./api.request";

const NEW_ADMISSION_PATH = "/admission";

export const newAdmission = async (body) =>
  await postRequest(NEW_ADMISSION_PATH, body, true);
