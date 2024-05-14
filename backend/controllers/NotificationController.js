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
} from "firebase/firestore";
 import ffmpeg from 'fluent-ffmpeg';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import multer from "multer";

import PostModel from "../models/PostModel.js";
import UserModel from "../models/UserModel.js";



// export const createNotification = async (type, sender, receiver, postId, storyId) => {
//   const createdAt = Timestamp.now();

//   switch (type) { 
//     // - > messsgae

//     // case "like":
//     //   await saveNotification(type, sender, receiver, postId, storyId, createdAt);
//     //   break;
//     // case "comment":
//     //   await saveNotification(type, sender, receiver, postId, storyId, createdAt);
//     //   break;
//     // case "follow":
//     //   await saveNotification(type, sender, receiver, postId, storyId, createdAt);
//     //   break;
//     // case "storyLike":
//     //   await saveNotification(type, sender, receiver, postId, storyId, createdAt);
//     //   break;
//     default:
//       return;
//   }
//   const notification = new Notification(type, sender, receiver, postId, storyId, createdAt);
//   const notificationRef = doc(db, "notifications", uuid());
//   await setDoc(notificationRef, notification);
// };






// truyền vào postid, username
// export const likePost = async (req, res) => {
//     const { postId } = req.params;
//     const { username } = req.body;
//     const postRef = doc(db, "posts", postId);
//     const postSnapshot = await getDoc(postRef);
//     if (!postSnapshot.exists()) {
//         return res.status(404).json({ message: "Post not found" });
//     }
//     const post = postSnapshot.data();
//     if (post.likes.includes(username)) {
//         return res.status(400).json({ message: "Post already liked" });
//     }
//     await updateDoc(postRef, { likes: arrayUnion(username) });
//     await createNotification("like", username, post.createdBy, postId);
//     res.status(200).json({ message: "Post liked" });
//     }