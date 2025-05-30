import { getRequest, postRequest, deleteRequest } from "../api.request";

const PRODUCT_PATH = "/item";
const SUPPLIER_PATH = "/supplier";
const PURCHASE_PATH = "/purchase";

//dashboard api
export const getProcurementDashboard = async () =>
  await getRequest(`/procurement/dashboard`);

// category api
export const getProductCategory = async () =>
  await getRequest(`${PRODUCT_PATH}/category`);

// products apis

export const getProducts = async (body) =>
  await postRequest(`${PRODUCT_PATH}/view`, body);

export const getProductById = async (id) =>
  await getRequest(`${PRODUCT_PATH}/view/${id}`);

export const createProduct = async (body) =>
  await postRequest(`${PRODUCT_PATH}/register`, body);

export const updateProduct = async (body) =>
  await postRequest(`${PRODUCT_PATH}/${body?.id}`, body);

export const deleteProduct = async (body) =>
  await deleteRequest(`${PRODUCT_PATH}/${body?.id}`);

// suppliers apis

export const getSuppliers = async (body) =>
  await postRequest(`${SUPPLIER_PATH}/view`, body);

export const getSupplierById = async (id) =>
  await getRequest(`${SUPPLIER_PATH}/view/${id}`);

export const createSupplier = async (body) =>
  await postRequest(`${SUPPLIER_PATH}/register`, body);

export const updateSupplier = async (body) =>
  await postRequest(`${SUPPLIER_PATH}/update/${body?.id}`, body);

export const deleteSupplier = async (body) =>
  await deleteRequest(`${SUPPLIER_PATH}/${body?.id}`);

// purchase apis

export const getUnits = async () => await getRequest(`${PURCHASE_PATH}/units`);

export const getCurrency = async () =>
  await getRequest(`${PURCHASE_PATH}/currency`);

export const getPurchases = async (body) =>
  await postRequest(`${PURCHASE_PATH}/view`, body);

export const getPurchaseById = async (id) =>
  await getRequest(`${PURCHASE_PATH}/view/${id}`);

export const createPurchase = async (body) =>
  await postRequest(`${PURCHASE_PATH}/register`, body);

export const updatePurchase = async (body) =>
  await postRequest(`${PURCHASE_PATH}/update/${body?.id}`, body);

export const deletePurchase = async (body) =>
  await deleteRequest(`${PURCHASE_PATH}/${body?.id}`);
