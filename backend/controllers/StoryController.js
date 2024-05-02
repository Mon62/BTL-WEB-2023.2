import { v4 as uuid } from 'uuid';
import { db, storage } from "../firebase.js";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import multer from "multer";
import storyModel from "../models/StoryModel.js";

export const createStory = async (req, res, next) => {
    const username = req.body.username; //createdBy
    const caption = req.body.caption;
    const media = req.file;
    const createdAt = Timestamp.now();
    const storyId = uuid();
    const endAt = Timestamp.fromMillis(createdAt.toMillis() + 24 * 60 * 60 * 1000); // 24 hours
    const mediaRef = ref(
        storage,
        `story/${storyId}/${media.originalname + uuid()}`
    );
    const metaData = {
        contentType: media.mimetype,
    };
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
        likes: [],
        createdAt: createdAt,
        createdBy: username,
        endAt: endAt, 
    };
    try {
        await setDoc(doc(db, "stories", storyId), storyData);
        await updateDoc(doc(db, "users", username), {
            stories: arrayUnion(storyId),
        });
        res.status(200).json({
            status: "success",
            message: "Đăng Story thành công!",
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
    console.log(storyData);
}

export const getStoryByUsername = async (req, res, next) => {
    try {
        const username = req.params.username;
        const userSnapshot = await getDoc(doc(db, "users", username));
        if (!userSnapshot.exists()) {
            return res.status(400).json({ message: "Không tồn tại người dùng " + username });
        }
        const q = query(collection(db, "stories"), where("createdBy", "==", username));
        const querySnapshot = await getDocs(q).catch((err) => next(err));
        if (querySnapshot.empty) {
            return res.status(400).json({ message: "Người dùng " + username + " không có story nào" });
        }
        const stories = [];
        querySnapshot.forEach((doc) => {
            stories.push(doc.data());
        });
        return res.status(200).json({ message: "success", data: stories });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const addToHighlight = async (req, res, next) => {
    try {
        const { storyIds, username } = req.body;
        const userRef = doc(db, "users", username);
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) {
            return res.status(400).json({ message: "Không tồn tại người dùng " + username });
        }
        await updateDoc(userRef, {
            highlights: arrayUnion(...storyIds),
        });
        return res.status(200).json({
            status: "success",
            message: "Thêm vào highlight thành công!",
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

export const getHighlightByUsername = async (req, res, next) => {
    try {
        const username = req.params.username;
        const userSnapshot = await getDoc(doc(db, "users", username));
        if (!userSnapshot.exists()) {
            return res.status(400).json({ message: "Không tồn tại người dùng " + username });
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
}

export const deleteStoriesFromHighlight = async (req, res, next) => {
    try {
      const { storyIds, username } = req.body;
      const userRef = doc(db, "users", username);
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        return res.status(400).json({ message: "Không tồn tại người dùng " + username });
      }
      await updateDoc(userRef, {
        highlights: arrayRemove(...storyIds),
      });
      return res.status(200).json({
        status: "success",
        message: "Xóa khỏi highlight thành công!",
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }