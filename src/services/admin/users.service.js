import { getRequest, postRequest, deleteRequest } from "../api.request";

const USERS_PATH = "/users";

// users apis

export const getUsers = async (body) =>
  await postRequest(`${USERS_PATH}/fetch_users`, body);

export const getUserById = async (id) =>
  await getRequest(`${USERS_PATH}/fetch_users/${id}`);

export const createUser = async (body) =>
  await postRequest(`${USERS_PATH}/register`, body);

export const updateUser = async (body) =>
  await postRequest(`${USERS_PATH}/${body?.id}`, body);

export const deleteUser = async (body) =>
  await deleteRequest(`${USERS_PATH}/${body?.id}`);
