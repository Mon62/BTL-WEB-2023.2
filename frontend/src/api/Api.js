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

class Api {
  // API user

  registerUser(userData) {
    return axios.post(API_BASE_URL + "/signup", userData, headers);
  }

  login(email, password) {
    return axios.post(
      API_BASE_URL + "/login",
      {
        email: email,
        password: password,
      },
      headers
    );
  }

  logout() {
    return axios.get(API_BASE_URL + "/logout", headers);
  }

  resetPassword(email) {
    return axios.get(
      API_BASE_URL + "/password/reset",
      { email: email },
      headers
    );
  }
}

export default new Api();
