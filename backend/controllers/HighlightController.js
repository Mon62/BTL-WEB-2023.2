import { v4 as uuid } from "uuid";
import { auth, db, storage, admin } from "../firebase.js";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import multer from "multer";

import HighlightModel from "../models/HighlightModel.js";
import StoryModel from "../models/StoryModel.js";
import UserModel from "../models/UserModel.js";

export const createHighlight = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    // const { hlname, username, hlimgURL, stories } = req.body;
    const hlname = req.body.hlname;
    const username = req.body.username;
    const hlimgURL = req.body.hlimgURL;
    const stories = req.body.stories ? req.body.stories : [];

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
        const hlid = uuid();
        const highlightdata = {
          hlid: hlid,
          hlname: hlname,
          username: username,
          hlimgURL: hlimgURL,
          stories: stories,
        };
        const highlightRef = doc(db, "highlights", hlid);
        await setDoc(highlightRef, highlightdata);

        // Add hlid to user's highlights
        await updateDoc(userRef, {
          highlights: arrayUnion(hlid),
        });

        // Add hlid to inHighlights of each story
        for (let i = 0; i < stories.length; i++) {
          const storyRef = doc(db, "stories", stories[i]);
          const storySnapshot = await getDoc(storyRef);
          if (storySnapshot.exists()) {
            await updateDoc(storyRef, {
              inHighlights: arrayUnion(hlid),
            });
          }
        }

        return res.status(200).json({
          status: "success",
          message: "Tạo highlight thành công!",
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

export const updateHighlight = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    const { hlid, hlname, hlimgURL, stories } = req.body;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        const highlightRef = doc(db, "highlights", hlid);
        const highlightSnapshot = await getDoc(highlightRef);
        if (!highlightSnapshot.exists()) {
          return res
            .status(400)
            .json({ message: "Không tồn tại highlight " + hlid });
        }


        const oldHighlightSnapshot = await getDoc(highlightRef);
        const oldStories = oldHighlightSnapshot.data().stories;

        // Remove hlid from old stories
        for (let i = 0; i < oldStories.length; i++) {
          const storyRef = doc(db, "stories", oldStories[i]);
          await updateDoc(storyRef, {
            inHighlights: arrayRemove(hlid),
          });
        }

        // Add hlid to new stories
        for (let i = 0; i < stories.length; i++) {
          const storyRef = doc(db, "stories", stories[i]);
          await updateDoc(storyRef, {
            inHighlights: arrayUnion(hlid),
          });
        }

        const highlightdata = {
          hlid: hlid,
          hlname: hlname,
          hlimgURL: hlimgURL,
          stories: stories,
        };
        await updateDoc(highlightRef, highlightdata);




        return res.status(200).json({
          status: "success",
          message: "Cập nhật highlight thành công!",
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

export const deleteHighlight = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    const { hlid } = req.body;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        const highlightRef = doc(db, "highlights", hlid);
        const highlightSnapshot = await getDoc(highlightRef);

        if (!highlightSnapshot.exists()) {
          return res
            .status(400)
            .json({ message: "Không tồn tại highlight " + hlid });
        }

        const highlightData = highlightSnapshot.data();
        const username = highlightData.username;
        const stories = highlightSnapshot.data().stories;

        // Remove hlid from stories
        for (let i = 0; i < stories.length; i++) {
          const storyRef = doc(db, "stories", stories[i]);
          await updateDoc(storyRef, {
            inHighlights: arrayRemove(hlid),
          });
        }





        // Get user document
        const userRef = doc(db, "users", username);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          // Remove the highlight id from the user's highlights array
          const updatedHighlights = userData.highlights.filter(
            (id) => id !== hlid
          );
          // Update the user's highlights array in the database
          await updateDoc(userRef, { highlights: updatedHighlights });
        }

        await deleteDoc(highlightRef);

        return res.status(200).json({
          status: "success",
          message: "Xóa highlight thành công!",
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

export const getAllHighlightsByUsername = async (req, res, next) => {
  try {
    const username = req.params.username;
    const userRef = doc(db, "users", username);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      return res
        .status(400)
        .json({ message: "Không tồn tại người dùng " + username });
    }
    const userData = userSnapshot.data();
    const highlights = userData.highlights || [];
    const highlightData = [];

    for (let i = 0; i < highlights.length; i++) {
      const highlightRef = doc(db, "highlights", highlights[i]);
      const highlightSnapshot = await getDoc(highlightRef);
      if (highlightSnapshot.exists()) {
        const highlight = highlightSnapshot.data();
        const stories = [];
        if (highlight.stories) {
          for (let j = 0; j < highlight.stories.length; j++) {
            const storyRef = doc(db, "stories", highlight.stories[j]);
            const storySnapshot = await getDoc(storyRef);
            if (storySnapshot.exists()) {
              stories.push(storySnapshot.data());
            }
          }
        }
        highlight.stories = stories;
        highlightData.push(highlight);
      }
    }
    return res.status(200).json({ message: "success", data: highlightData });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
