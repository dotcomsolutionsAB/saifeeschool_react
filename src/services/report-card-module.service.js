import { getRequest, postRequest } from "./api.request";

const TRANSFER_CERTIFICATE = "/transfer_certificate";
const CHARACTER_CERTIFICATE = "/character_certificate";

// Transter Certificate
export const getTransferCertificates = async (body) =>
  await postRequest(`${TRANSFER_CERTIFICATE}/view`, body);

export const exportTCDetails = async (body) =>
  await postRequest(`${TRANSFER_CERTIFICATE}/export`, body);

export const createTransferCertificate = async (body) =>
  await postRequest(`${TRANSFER_CERTIFICATE}`, body);

export const updateTransferCertificate = async (body) =>
  await postRequest(`${TRANSFER_CERTIFICATE}/${body?.id}`, body);

export const printTCPdf = async (body) =>
  await getRequest(`${TRANSFER_CERTIFICATE}/print/${body?.id}`);

// Character Certificate
export const getCharacterCertificates = async (body) =>
  await postRequest(`${CHARACTER_CERTIFICATE}/view`, body);

export const exportCCDetails = async (body) =>
  await postRequest(`${CHARACTER_CERTIFICATE}/export`, body);

export const createCharacterCertificate = async (body) =>
  await postRequest(`${CHARACTER_CERTIFICATE}`, body);

export const updateCharacterCertificate = async (body) =>
  await postRequest(`${CHARACTER_CERTIFICATE}/${body?.id}`, body);

export const printCCPdf = async (body) =>
  await getRequest(`${CHARACTER_CERTIFICATE}/print/${body?.id}`);

export const createBulkCharacterCertificate = async (body) =>
  await postRequest(`${CHARACTER_CERTIFICATE}/bulk`, body);
