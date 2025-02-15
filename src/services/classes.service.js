import { getRequest, postRequest, deleteRequest } from "./api.request";

const CLASS_GROUP_PATH = "/class_group";
const TEACHERS_PATH = "/teacher";

// class group apis

export const getAllClassGroup = async (body) =>
  await postRequest(`${CLASS_GROUP_PATH}/view_all`, body);

export const createClassGroup = async (body) =>
  await postRequest(`${CLASS_GROUP_PATH}/register`, body);

export const updateClassGroup = async (body) =>
  await postRequest(`${CLASS_GROUP_PATH}/register`, body);

export const deleteClassGroup = async (body) =>
  await deleteRequest(`${CLASS_GROUP_PATH}/${body?.id}`);

// teacher api

export const getTeachers = async () => await getRequest(`${TEACHERS_PATH}/get`);
