import { postRequest } from "../api.request";

// class group apis

export const getStudentStats = async (body) =>
  await postRequest("/dashboard_student", body);
