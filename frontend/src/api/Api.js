import axios from "axios";

const local = "http://localhost:3000";
const newLocal = "";
const headers = {
  headers: {
    "access-control-allow-origin": "*",
    "content-type": "application/json; charset=utf-8 ",
  },
};
export const API_BASE_URL = local;

// API user

export function registerUser(userData) {
  return axios.post(API_BASE_URL + "/signup", userData, headers);
}

export function login(email, password) {
  return axios.post(
    API_BASE_URL + "/login",
    {
      email: email,
      password: password,
    },
    headers
  );
}

export function logout() {
  return axios.get(API_BASE_URL + "/logout", headers);
}

export function resetPassword(email) {
  return axios.post(
    API_BASE_URL + "/password/reset",
    {
      email: email,
    },
    headers
  );
}
