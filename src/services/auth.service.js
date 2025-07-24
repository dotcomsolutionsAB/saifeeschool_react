import { postRequest } from "./api.request";

const LOGIN_PATH = "/login";
const LOGIN_AS_STUDENT_PATH = "/login_as_student";

export const loginApi = async (body) => await postRequest(LOGIN_PATH, body);

export const loginAsStudentApi = async ({ username }, { bearerToken }) =>
  await postRequest(LOGIN_AS_STUDENT_PATH, { username, bearerToken });
