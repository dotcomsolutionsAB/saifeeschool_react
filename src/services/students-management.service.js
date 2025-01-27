import { getRequest, postRequest } from "./api.request";

const STUDENTS_PATH = "/student";
const CLASS_PATH = "/class_group";
const ACADEMIC_PATH = "/academic_year";

export const getAllStudents = async (body) =>
  await postRequest(`${STUDENTS_PATH}/view`, body);

// to download the report
export const exportStudents = async (body) =>
  await postRequest(`${STUDENTS_PATH}/export`, body);

export const getAllClasses = async (body) =>
  await postRequest(`${CLASS_PATH}/view`, body);

export const getAllAcademicYears = async () =>
  await getRequest(`${ACADEMIC_PATH}/view`);
