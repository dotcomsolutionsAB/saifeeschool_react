import { getRequest, postRequest, deleteRequest } from "../api.request";

const ITEM_PATH = "/item";

export const getAllItem = async (body) =>
  await postRequest(`${ITEM_PATH}/view`, body);

export const getAllItemById = async (id) =>
  await getRequest(`${ITEM_PATH}/view/${id}`);

export const createItem = async (body) =>
  await postRequest(`${ITEM_PATH}/register`, body);

export const updateItem = async (body) =>
  await postRequest(`${ITEM_PATH}/${body?.id}`, body);

export const deleteItem = async (body) =>
  await deleteRequest(`${ITEM_PATH}/${body?.id}`);

export const getProducts = async () =>
  await getRequest(`${ITEM_PATH}/category`);
