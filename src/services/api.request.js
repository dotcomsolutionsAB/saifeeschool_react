import axios from "axios";
import { GET_ERROR, USER_INFO } from "../utils/constants";

const BASE_URL = "https://saifeeschool.dotcombusiness.in/api";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Add an Axios request interceptor to include the Bearer token in headers
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem(USER_INFO));
    console.log(userInfo, "userInfo");
    if (userInfo && userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token || ""}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Helper function to perform a GET request using Axios.
 * @param {string} path - The API endpoint to send the GET request to.
 * @returns {Promise<object>} - The response data from the server.
 *
 * Example Usage:
 *
 * // Simple GET request
 * const data = await getRequest('/users');
 * console.log(data);
 */

export const getRequest = async (path) => {
  try {
    let result = await api.get(path);
    return result?.data;
  } catch (error) {
    return GET_ERROR(error);
  }
};

/**
 * Helper function to perform a POST request using Axios.
 * @param {string} path - The API endpoint to send the POST request to.
 * @param {object} body - The payload to send in the POST request.
 * @param {boolean} isFormData - Set to true if the body contains FormData (e.g., for file uploads).
 * @returns {Promise<object>} - The response data from the server.
 *
 * Example Usage:
 *
 * // POST request without FormData
 * const data = await postRequest('/login', { email: "", password: "" });
 *
 * // POST request with FormData
 * const formData = new FormData();
 * formData.append("file", file);
 * const data = await postRequest('/upload', formData, true);
 */

export const postRequest = async (path, body, isFormData = false) => {
  try {
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
    const result = await api.post(path, body, { headers });
    console.log(result, "response result");
    return result?.data;
  } catch (error) {
    return GET_ERROR(error);
  }
};

/**
 * Helper function to perform a PUT request using Axios.
 * @param {string} path - The API endpoint to send the PUT request to.
 * @param {object} body - The payload to send in the PUT request.
 * @returns {Promise<object>} - The response data from the server.
 *
 * Example Usage:
 *
 * const data = await putRequest('/users/123', { name: "John Doe" });
 * console.log(data);
 */

export const putRequest = async (path, body) => {
  try {
    const result = await api.put(path, body);
    return result?.data;
  } catch (error) {
    return GET_ERROR(error);
  }
};

/**
 * Helper function to perform a DELETE request using Axios.
 * @param {string} path - The API endpoint to send the DELETE request to.
 * @returns {Promise<object>} - The response data from the server.
 *
 * Example Usage:
 *
 * const data = await deleteRequest('/users/123');
 * console.log(data);
 */

export const deleteRequest = async (path) => {
  try {
    const result = await api.delete(path);
    return result?.data;
  } catch (error) {
    return GET_ERROR(error);
  }
};
