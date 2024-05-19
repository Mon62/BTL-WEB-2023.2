import { v4 as uuid } from "uuid";
import { admin, db, storage } from "../firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  query,
  getDocs,
  deleteDoc,
  where,
  onSnapshot,
  collection,
  updateDoc,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

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

    // Function to determine the type of media
    const getTypeOfMedia = (filename) => {
      const lowerCaseFilename = filename.toLowerCase();
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];
      const videoExtensions = ["mp4", "avi", "mov"];

      if (imageExtensions.some((ext) => lowerCaseFilename.includes(ext))) {
        return "picture";
      } else if (
        videoExtensions.some((ext) => lowerCaseFilename.includes(ext))
      ) {
        return "video";
      } else {
        return "unknown";
      }
    };
    const typeOfMedia = getTypeOfMedia(media.originalname);

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
          caption: JSON.stringify(caption),
          mediaURL: mediaURL,
          typeOfMedia: typeOfMedia,
          musicURL: musicURL,
          likes: [],
          createdAt: createdAt,
          createdBy: username,
          endAt: endAt,
          inHighlights: [],
        };
        await setDoc(doc(db, "stories", storyId), storyData).catch((err) =>
          next(err)
        );
        await updateDoc(doc(db, "users", username), {
          stories: arrayUnion(storyId),
        }).catch((err) => next(err));

        // Fetch followers of the user
        const userSnapshot = await getDoc(doc(db, "users", username)).catch(
          (err) => next(err)
        );
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
          }).catch((err) => next(err));
        }

        await updateDoc(doc(db, "users", username), {
          myNewStories: arrayUnion(storyId),
        }).catch((err) => next(err));
        res.status(200).json({
          status: "success",
          message: "Đăng Story thành công!",
          data: storyData,
        });
        console.log(storyData);
      })
      .catch((err) => next(err));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

//delete story
export const deleteStory = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    const storyId = req.body.storyId;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        const storyRef = doc(db, "stories", storyId);
        const storySnapshot = await getDoc(storyRef).catch((err) => next(err));

        if (!storySnapshot.exists()) {
          return res.status(400).json({ message: "Story does not exist" });
        }

        const storyData = storySnapshot.data();
        const username = storyData.createdBy;
        const inHighlights = storyData.inHighlights || [];

        // Remove storyId from user's stories
        const userRef = doc(db, "users", username);
        await updateDoc(userRef, {
          stories: arrayRemove(storyId),
        }).catch((err) => next(err));

        // Create an array to hold all the promises
        let promises = [];

        for (let i = 0; i < inHighlights.length; i++) {
          const highlightRef = doc(db, "highlights", inHighlights[i]);
          const highlightSnapshot = await getDoc(highlightRef).catch((err) =>
            next(err)
          );
          if (highlightSnapshot.exists()) {
            const highlightData = highlightSnapshot.data();
            const updatedStories = highlightData.stories.filter(
              (id) => id !== storyId
            );
            // If the highlight doesn't have any stories, delete the highlight
            if (updatedStories.length === 0) {
              promises.push(deleteDoc(highlightRef));
            } else {
              // Otherwise, update the highlight with the updated stories
              promises.push(
                updateDoc(highlightRef, { stories: updatedStories })
              );
            }
          }
        }

        // Wait for all promises to resolve
        await Promise.all(promises).catch((err) => next(err));

        // Remove story from database
        await deleteDoc(storyRef).catch((err) => next(err));

        return res.status(200).json({
          status: "success",
          message: "Story deleted successfully",
        });
      })
      .catch((err) => next(err));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const getStoryById = async (req, res, next) => {
  try {
    const storyId = req.params.storyId;
    const storySnapshot = await getDoc(doc(db, "stories", storyId)).catch(
      (err) => next(err)
    );
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

//GET /stories/:username
export const getStoriesByUsername = (req, res, next) => {
  try {
    const username = req.params.username;
    const accessToken = req.headers.authorization;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then((decodedToken) => {
        const docRef = doc(db, "users", username);

        setTimeout(() => {
          getDoc(docRef)
            .then((user) => {
              if (!user.exists()) {
                return res
                  .status(400)
                  .json({ message: "Không tồn tại người dùng " + username });
              }
              const userData = user.data();
              const storyIdList = userData.stories;
              if (storyIdList.length === 0) {
                return res.status(200).json({ storiesData: [] });
              }

              let storiesData = [];
              const storyPromises = storyIdList.map(async (storyId) => {
                const storyRef = doc(db, "stories", storyId);
                const story = await getDoc(storyRef).catch((err) => next(err));
                const data = story.data();
                return {
                  mediaURL: data.mediaURL,
                  typeOfMedia: data.typeOfMedia,
                  isInHighlight: data.inHighlights.length > 0,
                  storyId: data.storyId,
                };
              });

              Promise.all(storyPromises)
                .then((_storiesData) => {
                  storiesData.push(..._storiesData);
                  return res.status(200).json({
                    storiesData: storiesData,
                  });
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }, 700);
      })
      .catch((err) => next(err));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
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
        const userSnapshot = await getDoc(userRef).catch((err) => next(err));
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
            const storySnapshot = await getDoc(
              doc(db, "stories", storyId)
            ).catch((err) => next(err));
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
      .catch((err) => next(err));
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
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
        const userSnapshot = await getDoc(userRef).catch((err) => next(err));
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
          const storySnapshot = await getDoc(doc(db, "stories", storyId)).catch(
            (err) => next(err)
          );
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
          }).catch((err) => next(err));
        }

        return res.status(200).json({
          status: "success",
          message: "Lấy myNewStories thành công!",
          data: myNewStories,
        });
      })
      .catch((err) => next(err));
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getMusicFiles = async (req, res, next) => {
  try {
    const musicFolder = ref(storage, "/music");
    const result = await listAll(musicFolder).catch((err) => next(err));
    const fileData = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item).catch((err) => next(err));
        const name = item.name;
        return { name, url };
      })
    ).catch((err) => next(err));
    res.status(200).json({ message: "success", data: fileData });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
