import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "./api.request";

const ACADEMIC_YEAR_PATH = "/academic_year";

// academic year apis

export const getAcademicYear = async () =>
  await getRequest(`${ACADEMIC_YEAR_PATH}/view`);

export const createAcademicYear = async (body) =>
  await postRequest(ACADEMIC_YEAR_PATH, body);

export const updateAcademicYear = async (body) =>
  await postRequest(ACADEMIC_YEAR_PATH, body);

export const deleteAcademicYear = async (body) =>
  await deleteRequest(`${ACADEMIC_YEAR_PATH}/${body?.id}`);

export const makeYearCurrent = async (body) =>
  await postRequest(`${ACADEMIC_YEAR_PATH}/current`, body);
