import { getRequest, postRequest } from "./api.request";

const STUDENTS_PATH = "/student";
const CLASS_PATH = "/class_group";
const ACADEMIC_PATH = "/academic_year";
const BLOOD_GROUP_PATH = "/blood-groups";
const HOUSE_PATH = "/house-options";
const FEE_PLAN_PATH = "/fee_plan";

// students apis

export const getAllStudents = async (body) =>
  await postRequest(`${STUDENTS_PATH}/view`, body);

export const exportStudents = async (body) =>
  await postRequest(`${STUDENTS_PATH}/export`, body); // to download the report

export const uploadStudentImage = async (body) =>
  await postRequest(`${STUDENTS_PATH}/upload`, body, true);

export const createStudent = async (body) =>
  await postRequest(`${STUDENTS_PATH}/register`, body);

export const upgradeStudent = async (body) =>
  await postRequest(`${STUDENTS_PATH}/upgrade`, body);

export const applyFeePlan = async (body) =>
  await postRequest(`${STUDENTS_PATH}/apply_fee`, body);

export const getAllPendingFees = async (body) =>
  await postRequest(`${STUDENTS_PATH}/pending_fees`, body);

export const getAllPaidFees = async (body) =>
  await postRequest(`${STUDENTS_PATH}/paid_fees`, body);

// other apis

export const getHouse = async () => await getRequest(HOUSE_PATH);

export const getBloodGroups = async () => await getRequest(BLOOD_GROUP_PATH);

export const getFeePlan = async (body) =>
  await postRequest(`${FEE_PLAN_PATH}/view`, body);

export const getAllClasses = async (body) =>
  await postRequest(`${CLASS_PATH}/view`, body);

export const getAllAcademicYears = async () =>
  await getRequest(`${ACADEMIC_PATH}/view`);
