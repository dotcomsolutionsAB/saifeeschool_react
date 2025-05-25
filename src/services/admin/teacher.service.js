import { getRequest, postRequest, deleteRequest } from "../api.request";

const TEACHERS_PATH = "/teacher";
const TEACHERS_ATTENDANCE_PATH = "/teacher_attendance";

// teachers apis

export const getTeachers = async (body) =>
  await postRequest(`${TEACHERS_PATH}/view`, body);

export const getTeacherById = async (id) =>
  await getRequest(`${TEACHERS_PATH}/view/${id}`);

export const createTeacher = async (body) =>
  await postRequest(`${TEACHERS_PATH}/register`, body);

export const updateTeacher = async (body) =>
  await postRequest(`${TEACHERS_PATH}/update/${body?.id}`, body);

export const deleteTeacher = async (body) =>
  await deleteRequest(`${TEACHERS_PATH}/${body?.id}`);

// teachers attendance apis

export const getTeachersAttenandance = async (body) =>
  await postRequest(`${TEACHERS_ATTENDANCE_PATH}/fetch`, body);

export const createTeacherAttendance = async (body) =>
  await postRequest(`${TEACHERS_ATTENDANCE_PATH}/register`, body);
