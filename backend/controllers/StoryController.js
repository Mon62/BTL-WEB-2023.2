import { v4 as uuid } from "uuid";
import { admin, db, storage } from "../firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  query,
  getDocs,
  where,
  onSnapshot,
  collection,
  updateDoc,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import multer from "multer";
import storyModel from "../models/StoryModel.js";

// export const createStory = async (req, res, next) => {
//     const username = req.body.username; //createdBy
//     const caption = req.body.caption;
//     const media = req.file;
//     const createdAt = Timestamp.now();
//     const storyId = uuid();
//     const endAt = Timestamp.fromMillis(createdAt.toMillis() + 24 * 60 * 60 * 1000); // 24 hours
//     const mediaRef = ref(
//         storage,
//         `story/${storyId}/${media.originalname + uuid()}`
//     );
//     const metaData = {
//         contentType: media.mimetype,
//     };
//     await uploadBytes(mediaRef, media.buffer, metaData)
//         .then((snapshot) => {
//             console.log("Uploaded a blob or file!");
//         })
//         .catch((error) => {
//             console.error(error);
//             next(error);
//         });
//     const mediaURL = await getDownloadURL(mediaRef)
//         .then((url) => {
//             console.log("File available at", url);
//             return url;
//         })
//         .catch((error) => {
//             console.error(error);
//             next(error);
//         });
//     const storyData = {
//         storyId: storyId,
//         caption: caption,
//         mediaURL: mediaURL,
//         likes: [],
//         createdAt: createdAt,
//         createdBy: username,
//         endAt: endAt,
//     };
//     try {
//         await setDoc(doc(db, "stories", storyId), storyData);
//         await updateDoc(doc(db, "users", username), {
//             stories: arrayUnion(storyId),
//         });

//         // Fetch followers of the user
//         const userSnapshot = await getDoc(doc(db, "users", username));
//         const userData = userSnapshot.data();
//         const followers = userData.followers;

//         // Update each follower's stories with the new storyId
//         for (const follower of followers) {
//             const followerRef = doc(db, "users", follower);
//             await updateDoc(followerRef, {
//                 newStories: arrayUnion(storyId),
//             });
//         }

//         res.status(200).json({
//             status: "success",
//             message: "Đăng Story thành công!",
//         });
//     } catch (error) {
//         console.error(error);
//         return next(error);
//     }
//     console.log(storyData);
// }

export const createStory = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    const username = req.body.username; //createdBy
    const caption = req.body.caption;
    const media = req.file;
    const musicURL = req.body.musicURL;
    const createdAt = Timestamp.now();
    const storyId = uuid();
    const endAt = Timestamp.fromMillis(
      createdAt.toMillis() + 24 * 60 * 60 * 1000
    ); // 24 hours
    const mediaRef = ref(
      storage,
      `story/${storyId}/${media.originalname + uuid()}`
    );
    const metaData = {
      contentType: media.mimetype,
    };

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        await uploadBytes(mediaRef, media.buffer, metaData)
          .then((snapshot) => {
            console.log("Uploaded a blob or file!");
          })
          .catch((error) => {
            console.error(error);
            next(error);
          });
        const mediaURL = await getDownloadURL(mediaRef)
          .then((url) => {
            console.log("File available at", url);
            return url;
          })
          .catch((error) => {
            console.error(error);
            next(error);
          });
        const storyData = {
          storyId: storyId,
          caption: caption,
          mediaURL: mediaURL,
          musicURL: musicURL,
          likes: [],
          createdAt: createdAt,
          createdBy: username,
          endAt: endAt,
        };
        await setDoc(doc(db, "stories", storyId), storyData);
        await updateDoc(doc(db, "users", username), {
          stories: arrayUnion(storyId),
        });

        // Fetch followers of the user
        const userSnapshot = await getDoc(doc(db, "users", username));
        const userData = userSnapshot.data();
        const followers = userData.followers;

        // Update each follower's stories with the new storyId
        for (const follower of followers) {
          const followerRef = doc(db, "users", follower);
          const followerData = (await getDoc(followerRef)).data();
          const followerNewStories = followerData.newStories || {};
          followerNewStories[username] = followerNewStories[username] || [];
          followerNewStories[username].push(storyId);
          await updateDoc(followerRef, {
            newStories: followerNewStories,
          });
        }

        await updateDoc(doc(db, "users", username), {
          myNewStories: arrayUnion(storyId),
        });
        res.status(200).json({
          status: "success",
          message: "Đăng Story thành công!",
          data: storyData,
        });
        console.log(storyData);
      })
      .catch((error) => {
        console.error(error);
        return next(error);
      });
  } catch (error) {
    console.error(error);
    return next(error);
  }

};

//Get All Stories by Username
// export const getStoryByUsername = async (req, res, next) => {
//   try {
//     const username = req.params.username;
//     const userSnapshot = await getDoc(doc(db, "users", username));
//     if (!userSnapshot.exists()) {
//       return res
//         .status(400)
//         .json({ message: "Không tồn tại người dùng " + username });
//     }
//     const q = query(
//       collection(db, "stories"),
//       where("createdBy", "==", username)
//     );
//     const querySnapshot = await getDocs(q).catch((err) => next(err));
//     if (querySnapshot.empty) {
//       return res
//         .status(400)
//         .json({ message: "Người dùng " + username + " không có story nào" });
//     }
//     const stories = [];
//     querySnapshot.forEach((doc) => {
//       stories.push(doc.data());
//     });
//     return res.status(200).json({ message: "success", data: stories });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const getStoryByStoryId = async (req, res, next) => {
  try {
    const storyId = req.params.storyId;
    const storySnapshot = await getDoc(doc(db, "stories", storyId));
    if (!storySnapshot.exists()) {
      return res
        .status(400)
        .json({ message: "Không tồn tại story " + storyId });
    }
    const story = storySnapshot.data();
    return res.status(200).json({ message: "success", data: story });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getNewStoriesByUsername = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        const username = req.params.username;
        // Fetch the user
        const userRef = doc(db, "users", username);
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) {
          throw new Error("User does not exist");
        }

        // Get the user's newStories
        const userData = userSnapshot.data();
        const newStoriesIds = userData.newStories || {};

        // Fetch each story and replace the storyId with the story object
        const newStories = {};
        for (const [username, storyIds] of Object.entries(newStoriesIds)) {
          newStories[username] = [];
          for (const storyId of storyIds) {
            const storySnapshot = await getDoc(doc(db, "stories", storyId));
            if (storySnapshot.exists()) {
              // newStories[username].push(storySnapshot.data());
              const storyData = storySnapshot.data();
              // Check if the story's endAt is greater than the current time
              if (storyData.endAt.toMillis() > Date.now()) {
                newStories[username].push(storyData);
              }
            }
          }
          // Sort the stories by createdAt in ascending order
          newStories[username].sort((a, b) => a.createdAt - b.createdAt);
        }
        for (const username in newStories) {
          if (newStories[username].length === 0) {
            delete newStories[username];
          }
        }

        // Sort the usernames by the createdAt of their latest story in descending order
        const sortedUsernames = Object.keys(newStories).sort(
          (a, b) =>
            newStories[b][newStories[b].length - 1].createdAt -
            newStories[a][newStories[a].length - 1].createdAt
        );
        const sortedNewStories = {};
        for (const username of sortedUsernames) {
          sortedNewStories[username] = newStories[username];
        }

        return res.status(200).json({
          status: "success",
          message: "Lấy newStories thành công!",
          data: sortedNewStories,
        });
      })
      .catch((error) => {
        console.error(error);
        return next(error);
      }
      );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMyNewStories = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        const username = req.params.username;
        // Fetch the user
        const userRef = doc(db, "users", username);
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) {
          throw new Error("User does not exist");
        }

        // Get the user's myNewStories
        const userData = userSnapshot.data();
        const myNewStoriesIds = userData.myNewStories || [];

        // Fetch each story and replace the storyId with the story object
        const myNewStories = [];
        const expiredStories = [];
        for (const storyId of myNewStoriesIds) {
          const storySnapshot = await getDoc(doc(db, "stories", storyId));
          if (storySnapshot.exists()) {
            const storyData = storySnapshot.data();
            // Check if the story's endAt is greater than the current time
            if (storyData.endAt.toMillis() > Date.now()) {
              myNewStories.push(storyData);
            } else {
              expiredStories.push(storyId);
            }
          }
        }
        // Sort the stories by createdAt in descending order
        myNewStories.sort((a, b) => b.createdAt - a.createdAt);

        // Remove expired stories from user's myNewStories
        if (expiredStories.length > 0) {
          await updateDoc(userRef, {
            myNewStories: arrayRemove(...expiredStories),
          });
        }

        return res.status(200).json({
          status: "success",
          message: "Lấy myNewStories thành công!",
          data: myNewStories,
        });
      }
      )
      .catch((error) => {
        console.error(error);
        return next(error);
      });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Highlight
export const addToHighlight = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    const { storyIds, username } = req.body;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        const userRef = doc(db, "users", username);
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) {
          return res
            .status(400)
            .json({ message: "Không tồn tại người dùng " + username });
        }
        await updateDoc(userRef, {
          highlights: arrayUnion(...storyIds),
        });
        return res.status(200).json({
          status: "success",
          message: "Thêm vào highlight thành công!",
        });
      }
      )
      .catch((error) => {
        console.error(error);
        return next(error);
      });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const getHighlightByUsername = async (req, res, next) => {
  try {
    const username = req.params.username;
    const userSnapshot = await getDoc(doc(db, "users", username));
    if (!userSnapshot.exists()) {
      return res
        .status(400)
        .json({ message: "Không tồn tại người dùng " + username });
    }
    const userData = userSnapshot.data();
    const highlights = userData.highlights || [];
    const highlightStories = [];
    for (let i = 0; i < highlights.length; i++) {
      const storySnapshot = await getDoc(doc(db, "stories", highlights[i]));
      if (storySnapshot.exists()) {
        highlightStories.push(storySnapshot.data());
      }
    }
    return res.status(200).json({ message: "success", data: highlightStories });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deleteStoriesFromHighlight = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    const { storyIds, username } = req.body;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        const userRef = doc(db, "users", username);
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) {
          return res
            .status(400)
            .json({ message: "Không tồn tại người dùng " + username });
        }
        await updateDoc(userRef, {
          highlights: arrayRemove(...storyIds),
        });
        return res.status(200).json({
          status: "success",
          message: "Xóa khỏi highlight thành công!",
        });
      })
      .catch((error) => {
        console.error(error);
        return next(error);
      });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};



// MUSIC IN STORY
// export const getMusicFiles = async (req, res, next) => {
//   try {
//     const musicFolder = storage.ref('/music');
//     const files = await getFiles(musicFolder);
//     const fileData = await Promise.all(files.map(async (file) => {
//       const url = await getDownloadURL(file);
//       const name = file.name;
//       return { name, url };
//     }));
//     res.status(200).json({ message: "success", data: fileData });
//   }
//   catch (error) {
//     console.error(error);
//     return next(error);
//   }
// }

export const getMusicFiles = async (req, res, next) => {
  try {
    const musicFolder = ref(storage, '/music');
    const result = await listAll(musicFolder);
    const fileData = await Promise.all(result.items.map(async (item) => {
      const url = await getDownloadURL(item);
      const name = item.name;
      return { name, url };
    }));
    res.status(200).json({ message: "success", data: fileData });
  }
  catch (error) {
    console.error(error);
    return next(error);
  }
}