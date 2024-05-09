import axios from "axios";

const dev_API_URL = "http://localhost:3000";
const production_API_URL = "";
const accessToken = sessionStorage.getItem("accessToken");
const baseHeader = {
  headers: {
    "access-control-allow-origin": "*",
    "content-type": "application/json; charset=utf-8 ",
  },
};
const formDataHeader = {
  headers: {
    "access-control-allow-origin": "*",
    "content-type": "multipart/form-data",
  },
};
export const API_URL = dev_API_URL;

// API for user
export function registerUser(userData) {
  return axios.post(API_URL + "/signup", userData, baseHeader);
}

export function login(email, password) {
  return axios.post(
    API_URL + "/login",
    {
      email: email,
      password: password,
    },
    baseHeader
  );
}

export function logout() {
  return axios.get(API_URL + "/logout", {
    headers: {
      "access-control-allow-origin": "*",
      "content-type": "application/json; charset=utf-8 ",
      Authorization: sessionStorage.getItem("accessToken"),
    },
  });
}

export function resetPassword(email) {
  return axios.post(
    API_URL + "/password/reset",
    {
      email: email,
    },
    baseHeader
  );
}

export function changePassword(email) {
  return axios.post(
    API_URL + "/password/change",
    {
      email: email,
    },
    {
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json; charset=utf-8 ",
        Authorization: sessionStorage.getItem("accessToken"),
      },
    }
  );
}

export function editProfile(username, profilePic, fullName, biography) {
  return axios.post(
    API_URL + "/account/edit",
    {
      username: username,
      profilePic: profilePic,
      fullName: fullName,
      biography: biography,
    },
    {
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "multipart/form-data",
        Authorization: sessionStorage.getItem("accessToken"),
      },
    }
  );
}

export function getProfileByUsername(username) {
  return axios.get(API_URL + "/profile/" + username, {
    headers: {
      "access-control-allow-origin": "*",
      "content-type": "application/json; charset=utf-8 ",
      Authorization: sessionStorage.getItem("accessToken"),
    },
  });
}

export function checkFollowStatus(currentUser, targetUser) {
  return axios.post(
    API_URL + "/check/followStatus",
    { currentUser: currentUser, targetUser: targetUser },
    {
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json; charset=utf-8 ",
        Authorization: sessionStorage.getItem("accessToken"),
      },
    }
  );
}

export function follow(currentUser, targetUser) {
  return axios.post(
    API_URL + "/follow",
    {
      currentUser: currentUser,
      targetUser: targetUser,
    },
    {
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json; charset=utf-8 ",
        Authorization: sessionStorage.getItem("accessToken"),
      },
    }
  );
}

export function unfollow(currentUser, targetUser) {
  return axios.post(
    API_URL + "/unfollow",
    {
      currentUser: currentUser,
      targetUser: targetUser,
    },
    {
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json; charset=utf-8 ",
        Authorization: sessionStorage.getItem("accessToken"),
      },
    }
  );
}

// API for posts and stories
// postData cần có các trường sau:caption, ảnh và video tải lên (tối đa 10), username (createdBy)
export function createPost(postData) {
  return axios.post(API_URL + "/create-post", 
  postData, 
  {
    headers: {
      "access-control-allow-origin": "*",
      "content-type": "multipart/form-data",
      Authorization: sessionStorage.getItem("accessToken"),
    },
  }
);
}

 // API get posts and stories


// export function getPostsByUsername(username) {
//   return axios.get(API_URL + "/posts/" + username, baseHeader);
// }
export function getPostById(pid) {
  return axios.get(API_URL + "/posts/" + pid, baseHeader);
}

export function getNewPostsByUsername(username) {
  return axios.get(API_URL + "/new-posts/" + username, {
    headers: {
      "access-control-allow-origin": "*",
      "content-type": "application/json; charset=utf-8 ",
      Authorization: sessionStorage.getItem("accessToken"),
    },
  });
}

// storyData cần có các trường sau:caption, media (ảnh hoặc video tải lên) chỉ 1, username (createdBy)
export function createStory(storyData) {
  return axios.post(API_URL + "/create-story", storyData, {
    headers: {
      "access-control-allow-origin": "*",
      "content-type": "multipart/form-data",
      Authorization: sessionStorage.getItem("accessToken"),
    },
  });
}
// export function getStoriesByUsername(username) {
//   return axios.get(API_URL + "/stories/" + username, baseHeader);
// }
export function getStoryByStoryId(storyId) {
  return axios.get(API_URL + "/stories/" + storyId, baseHeader);
}

export function getNewStoriesByUsername(username) {
  return axios.get(API_URL + "/new-stories/" + username, {
    headers: {
      "access-control-allow-origin": "*",
      "content-type": "application/json; charset=utf-8 ",
      Authorization: sessionStorage.getItem("accessToken"),
    },
  });
}

export function getMyNewStories(username) {
  return axios.get(API_URL + "/my-new-stories/" + username, {
    headers: {
      "access-control-allow-origin": "*",
      "content-type": "application/json; charset=utf-8 ",
      Authorization: sessionStorage.getItem("accessToken"),
    },
  });
}



// API highlight
export function addToHighlight(highlightData) {
  return axios.post(
    API_URL + "/highlights/add-to-highlights",
    highlightData,
    {
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json; charset=utf-8 ",
        Authorization: sessionStorage.getItem("accessToken"),
      },
    }
  );
}

export function deleteStoriesFromHighlight(highlightData) {
  return axios.post(API_URL + "/highlights/delete", highlightData, {
    headers: {
      "access-control-allow-origin": "*",
      "content-type": "application/json; charset=utf-8 ",
      Authorization: sessionStorage.getItem("accessToken"),
    },
  });
}

export function getHighlightsByUsername(username) {
  return axios.get(API_URL + "/highlights/" + username, baseHeader);
}


//MUSIC
export function getMusicFiles() {
  return axios.get(API_URL + "/music", baseHeader);
}