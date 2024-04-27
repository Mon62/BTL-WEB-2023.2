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


// postData cần có các trường sau:caption, ảnh và video tải lên , username (createdBy)
export function createPost(postData) {
  return axios.post(
    API_BASE_URL + "/create-post", 
    postData, 
    headers
  );
}

// storyData cần có các trường sau:caption, imageURL, musicURL, userId (createdBy)
export function createStory(storyData) {
  return axios.post(
    API_BASE_URL + "/create-story", 
    storyData, 
    headers
  );
}