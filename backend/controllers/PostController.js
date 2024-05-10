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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import multer from "multer";

import PostModel from "../models/PostModel.js";
import UserModel from "../models/UserModel.js";

export const createPost = async (req, res, next) => {
  try {
    const username = req.body.username; //createdBy
    const caption = req.body.caption;
    const files = req.files;
    const accessToken = req.headers.authorization;

    const createdAt = Timestamp.now();
    const pid = uuid();
    let imgURLs = [];

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        // Kiểm tra sự tồn tại của người dùng
        const userSnapshot = await getDoc(doc(db, "users", username));
        if (!userSnapshot.exists()) {
          return res.status(404).json({
            status: "error",
            message: "Người dùng không tồn tại!",
          });
        }

        // upload image to storage
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const imgRef = ref(storage, `post/${pid}/${file.originalname + uuid()}`);
          const metaData = {
            contentType: file.mimetype,
          };
          await uploadBytes(imgRef, file.buffer, metaData)
            .then((snapshot) => {
              console.log("Uploaded a blob or file!");
            })
            .catch((error) => {
              console.error(error);
              next(error);
            });
          await getDownloadURL(imgRef)
            .then((url) => {
              console.log("File available at", url);
              imgURLs.push(url);
            })
            .catch((error) => {
              console.error(error);
              next(error);
            });
        }

        //const postData = new postModel(username, caption, imgURL, createdAt);
        const postData = {
          pid: pid,
          caption: req.body.caption, // change this line
          imgURLs: imgURLs,
          likes: [],
          comments: [],
          createdAt: createdAt,
          createdBy: username,
        };

        await setDoc(doc(db, "posts", pid), postData);
        await updateDoc(doc(db, "users", username), {
          posts: arrayUnion(pid),
        });

        //Update Post to newPosts of followers
        //Update Post to newPosts of followers
        const userRef = doc(db, "users", username);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const user = userSnap.data();
          const followers = user.followers;
          const updatePromises = followers.map((follower) => {
            const followerRef = doc(db, "users", follower);
            return updateDoc(followerRef, {
              newPosts: arrayUnion(pid),
            });
          });
          await Promise.all(updatePromises);
        }

        res.status(200).json({
          status: "success",
          message: "Đăng bài viết thành công!",
          data: postData,
        });
        console.log(postData);
      })
      .catch((error) => {
        console.error(error);
        next(error);
      });
      
  } catch (error) {
    console.error(error);
    return next(error);
  }

};


export const updatePost = async (req, res, next) => {
  try {
    const pid = req.body.pid;
    const caption = req.body.caption;
    const accessToken = req.headers.authorization;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        const postRef = doc(db, "posts", pid);
        const postSnapshot = await getDoc(postRef);
        if (!postSnapshot.exists()) {
          return res.status(404).json({
            status: "error",
            message: "Bài viết không tồn tại!",
          });
        }

        // update the post document
        await updateDoc(postRef, {
          caption: caption,
        });

        res.status(200).json({
          status: "success",
          message: "Cập nhật bài viết thành công!",
        });
      })
      .catch((error) => {
        console.error(error);
        next(error);
      });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const pid = req.body.pid;
    const accessToken = req.headers.authorization;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        const postRef = doc(db, "posts", pid);
        const postSnapshot = await getDoc(postRef);
        if (!postSnapshot.exists()) {
          return res.status(404).json({
            status: "error",
            message: "Bài viết không tồn tại!",
          });
        }

        // delete the post document
        await deleteDoc(postRef);

        res.status(200).json({
          status: "success",
          message: "Xóa bài viết thành công!",
        });
      })
      .catch((error) => {
        console.error(error);
        next(error);
      });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// export const getPostByUsername = async (req, res, next) => {
//   try {
//     const username = req.params.username;
//     const userSnapshot = await getDoc(doc(db, "users", username));
//     if (!userSnapshot.exists()) {
//       return res
//         .status(400)
//         .json({ message: "Không tồn tại người dùng " + username });
//     }
//     const q = query(
//       collection(db, "posts"),
//       where("createdBy", "==", username)
//     );
//     const querySnapshot = await getDocs(q).catch((err) => next(err));
//     if (querySnapshot.empty) {
//       return res
//         .status(400)
//         .json({ message: "Người dùng " + username + " không có bài viết nào" });
//     }
//     const posts = [];
//     querySnapshot.forEach((doc) => {
//       posts.push(doc.data());
//     });
//     return res.status(200).json({ message: "success", data: posts });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const getPostById = async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const postSnapshot = await getDoc(doc(db, "posts", pid));
    if (!postSnapshot.exists()) {
      return res
        .status(400)
        .json({ message: "Không tồn tại bài viết " + pid });
    }
    const post = postSnapshot.data();
    return res.status(200).json({ message: "success", data: post });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// export const getNewPostsByUsername = async (req, res, next) => {
//     try {
//         const username = req.params.username;
//         const userSnapshot = await getDoc(doc(db, "users", username));
//         if (!userSnapshot.exists()) {
//             return res.status(400).json({ message: "Không tồn tại người dùng " + username });
//         }
//         const user = userSnapshot.data();
//         const newPosts = user.newPosts;
//         const validPosts = [];
//         const currentTime = Date.now();
//         const postPromises = newPosts.map(async (postId) => {
//             const postSnapshot = await getDoc(doc(db, "posts", postId));
//             if (postSnapshot.exists()) {
//                 const post = postSnapshot.data();
//                 if (currentTime - post.createdAt.toMillis() <= 3*24 * 60 * 60 * 1000) { // 3 days
//                     validPosts.push(post); // push the post object instead of postId
//                 }
//             }
//         });
//         await Promise.all(postPromises);
//         return res.status(200).json({ message: "success", data: validPosts });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

export const getNewPostsByUsername = async (req, res, next) => {
  try {
    const username = req.params.username;
    const userSnapshot = await getDoc(doc(db, "users", username));
    if (!userSnapshot.exists()) {
      return res
        .status(400)
        .json({ message: "Không tồn tại người dùng " + username });
    }
    const accessToken = req.headers.authorization;
    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        const user = userSnapshot.data();
        const newPosts = user.newPosts;
        const validPosts = [];
        const postPromises = newPosts.map(async (postId) => {
          const postSnapshot = await getDoc(doc(db, "posts", postId));
          if (postSnapshot.exists()) {
            const post = postSnapshot.data();
            validPosts.push(post); // push the post object instead of postId
          }
        });
        await Promise.all(postPromises);
    
        // Clear newPosts
        await updateDoc(doc(db, "users", username), {
          newPosts: [],
        });
        console.log(newPosts);
        return res.status(200).json({ message: "success", data: validPosts });
      }
    ).catch((error) => {
      console.error(error);
      next(error);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
