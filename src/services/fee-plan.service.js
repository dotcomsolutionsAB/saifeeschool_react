import { postRequest, deleteRequest } from "./api.request";

const FEE_PLAN_PATH = "/fee_plan";

// fee plan apis

export const getAllFeePlan = async (body) =>
  await postRequest(`${FEE_PLAN_PATH}/view_all`, body);

export const createFeePlan = async (body) =>
  await postRequest(`${FEE_PLAN_PATH}/register`, body);

export const updateFeePlan = async (body) =>
  await postRequest(`${FEE_PLAN_PATH}/register`, body);

export const deleteFeePlan = async (body) =>
  await deleteRequest(`${FEE_PLAN_PATH}/${body?.id}`);
