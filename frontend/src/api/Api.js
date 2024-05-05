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


// postData cần có các trường sau:caption, ảnh và video tải lên (tối đa 10), username (createdBy)
export function createPost(postData) {
  return axios.post(
    API_BASE_URL + "/create-post", 
    postData, 
    headers
  );
}


// API get posts and stories
export function getPostsByUsername(username) {
  return axios.get(API_BASE_URL + "/posts/" + username, headers);
}

export function getNewPostsByUsername(username) {
  return axios.get(API_BASE_URL + "/new-posts/" + username, headers);
}

// storyData cần có các trường sau:caption, media (ảnh hoặc video tải lên) chỉ 1, username (createdBy)
export function createStory(storyData) {
  return axios.post(
    API_BASE_URL + "/create-story", 
    storyData, 
    headers
  );
}
export function getStoriesByUsername(username) {
  return axios.get(API_BASE_URL + "/stories/" + username, headers);
}
export function getNewStoriesByUsername(username) {
  return axios.get(API_BASE_URL + "/new-stories/" + username, headers);
}
export function getMyNewStories(username) {
  return axios.get(API_BASE_URL + "/my-new-stories/" + username, headers);
}
// API highlight
export function addToHighlight(highlightData) {
  return axios.post(
    API_BASE_URL + "/highlights/add-to-highlights", 
    highlightData, 
    headers
  );
}

export function deleteStoriesFromHighlight(highlightData) {
  return axios.post(
    API_BASE_URL + "/highlights/delete", 
    highlightData, 
    headers
  );
}
function getHighlightsByUsername(username) {
  return axios.get(API_BASE_URL + "/highlights/" + username, headers);
}

