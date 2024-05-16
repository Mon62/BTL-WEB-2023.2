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
          const imgRef = ref(
            storage,
            `post/${pid}/${file.originalname + uuid()}`
          );
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
        // Check if the first media is a picture or a video
        const getTypeOfMedia = (filename) => {
          const lowerCaseFilename = filename.toLowerCase();
          const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
          const videoExtensions = ['mp4', 'avi', 'mov'];
        
          if (imageExtensions.some(ext => lowerCaseFilename.includes(ext))) {
            return 'picture';
          } else if (videoExtensions.some(ext => lowerCaseFilename.includes(ext))) {
            return 'video';
          } else {
            return 'unknown';
          }
        };

        const typeOfFirstMedia = getTypeOfMedia(imgURLs[0]);
        //const postData = new postModel(username, caption, imgURL, createdAt);
        const postData = {
          pid: pid,
          caption: JSON.stringify(caption), // change this line
          imgURLs: imgURLs,
          likes: [],
          comments: [],
          createdAt: createdAt,
          createdBy: username,
          typeOfFirstMedia: typeOfFirstMedia, //First media is video or picture
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
          caption: JSON.stringify(caption),
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

//GET /posts/:username

//namvq recommend 
// export const getPostsByUsername = (req, res, next) => {
//   try {
//     const username = req.params.username;
//     const accessToken = req.headers.authorization;
//     console.log(username);

//     // const ffmpeg = require('ffmpeg');
//     admin
//       .auth()
//       .verifyIdToken(accessToken)
//       .then((decodedToken) => {
//         const docRef = doc(db, "users", username);

//         setTimeout(() => {
//           getDoc(docRef)
//             .then((user) => {
//               if (!user.exists()) {
//                 return res
//                   .status(400)
//                   .json({ message: "Không tồn tại người dùng " + username });
//               }
//               const userData = user.data();
//               const postIdList = userData.posts;
//               if (postIdList.length === 0) {
//                 return res.status(200).json({ postsData: [] });
//               }

//               const postPromises = postIdList.map(async (postId) => {
//                 const postRef = doc(db, "posts", postId);
//                 const post = await getDoc(postRef).catch((err) => next(err));
//                 const data = post.data();

//                 if (data.imgURLs[0].includes('.mp4')) {
//                   const thumbnailPath = `D:/DESKTOP/tetsstts/web/BTL-WEB-2023.2/backend/data/thumbnails/${postId}.jpg`;
//                   await new Promise((resolve, reject) => {
//                     ffmpeg(data.imgURLs[0])
//                       .on('end', resolve)
//                       .on('error', reject)
//                       .screenshots({
//                         timestamps: ['00:00:02'],
//                         filename: thumbnailPath,
//                         folder: 'D:/DESKTOP/tetsstts/web/BTL-WEB-2023.2/backend/data/thumbnails/',
//                       });
//                   });
//                   data.imgURLs[0] = thumbnailPath;
//                 }

//                 return {
//                   numberOfLikes: data.likes ? data.likes.length : 0,
//                   numberOfComments: data.comments ? data.comments.length : 0,
//                   firstPicURL: data.imgURLs[0],
//                 };
//               });

//               let postsData = [];
//               Promise.all(postPromises)
//                 .then((_postsData) => {
//                   postsData.push(..._postsData);
//                   return res.status(200).json({
//                     postsData: postsData,
//                   });
//                 })
//                 .catch((err) => next(err));
//             })
//             .catch((err) => next(err));
//         }, 700);
//       })
//       .catch((err) => next(err));
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: err.message });
//   }
// };

export const getPostsByUsername = (req, res, next) => {
  try {
    const username = req.params.username;
    const accessToken = req.headers.authorization;
    // console.log(username);

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
              const postIdList = userData.posts;
              if (postIdList.length === 0) {
                return res.status(200).json({ postsData: [] });
              }

              let postsData = [];
              const postPromises = postIdList.map(async (postId) => {
                const postRef = doc(db, "posts", postId);
                const post = await getDoc(postRef).catch((err) => next(err));
                const data = post.data();
                // console.log(data);
                return {
                  numberOfLikes: data.likes ? data.likes.length : 0,
                  numberOfComments: data.comments ? data.comments.length : 0,
                  firstPicURL: data.imgURLs[0],
                  typeOfFirstMedia: data.typeOfFirstMedia,
                  numberOfMediaFile: data.imgURLs.length
                };
              });

              Promise.all(postPromises)
                .then((_postsData) => {
                  postsData.push(..._postsData);
                  return res.status(200).json({
                    postsData: postsData,
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

export const getPostById = async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const postSnapshot = await getDoc(doc(db, "posts", pid));
    if (!postSnapshot.exists()) {
      return res.status(400).json({ message: "Không tồn tại bài viết " + pid });
    }
    const post = postSnapshot.data();
    return res.status(200).json({ message: "success", data: post });
  } catch (error) {
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
      })
      .catch((error) => {
        console.error(error);
        next(error);
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};





// export const getRecommendPosts = async (req, res, next) => {
//   try {
//     const username = req.params.username;

//     // Get user's posts
//     const userSnapshot = await getDoc(doc(db, 'users', username));
//     const userData = userSnapshot.data();
//     const userPosts = userData.posts;

//     // Get all posts
//     const allPostsSnapshot = await getDocs(collection(db, "posts"));
//     let allPosts = allPostsSnapshot.docs.map(doc => doc.data());

//     // Filter out posts by the current user
//     allPosts = allPosts.filter(post => !userPosts.includes(post.id));

//     // Shuffle the array to get random posts
//     for (let i = allPosts.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [allPosts[i], allPosts[j]] = [allPosts[j], allPosts[i]];
//     }

//     // Get maximum 30 posts
//     const recommendPosts = allPosts.slice(0, 30);

//     return res.status(200).json({ posts: recommendPosts });
//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// };


export const getRecommendPosts = async (req, res, next) => {
  try {
    const username = req.params.username;
    const allPostsSnapshot = await getDocs(collection(db, "posts"));
    let allPosts = allPostsSnapshot.docs.map(doc => doc.data());

    // Filter out posts by the current user
    allPosts = allPosts.filter(post => post.createdBy !== username);

    // Shuffle the array to get random posts
    for (let i = allPosts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPosts[i], allPosts[j]] = [allPosts[j], allPosts[i]];
    }

    // Get maximum 20 posts
    const recommendPosts = allPosts.slice(0, 20);

    return res.status(200).json({ posts: recommendPosts });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};


// export const getExplorePosts = async (req, res, next) => {
//   try {
//     const username = req.params.username;
//     const postsCollectionRef = collection(db, "posts");
//     const postsSnapshot = await getDocs(postsCollectionRef);
//     let postsData = [];
//     let count = 0;
//     postsSnapshot.forEach((doc) => {
//       const data = doc.data();
//       if (data.createdBy !== username) {
//         postsData.push({
//           pid: doc.id,
//           firstMediaURL: data.imgURLs[0],
//           typeOfFirstMedia: data.typeOfFirstMedia,
//           numberOfLikes: data.likes ? data.likes.length : 0,
//           numberOfComments: data.comments ? data.comments.length : 0,
//         });
//         count++;
//       }
//       return count  <=  2;
//     });

//     return res.status(200).json({ postsData: postsData });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: err.message });
//   }
// };


export const getExplorePosts = async (req, res, next) => {
  try {
    const username = req.params.username;
    const postsCollectionRef = collection(db, "posts");
    const postsSnapshot = await getDocs(postsCollectionRef);
    let postsData = [];
    let count = 0;

    postsSnapshot.docs.some((doc) => {
      const data = doc.data();
      if (data.createdBy !== username) {
        postsData.push({
          pid: doc.id,
          firstMediaURL: data.imgURLs[0],
          typeOfFirstMedia: data.typeOfFirstMedia,
          numberOfLikes: data.likes ? data.likes.length : 0,
          numberOfComments: data.comments ? data.comments.length : 0,
        });
        count++;
      }
      return count >= 30; // This will break the loop when count reaches 30
    });

    return res.status(200).json({ postsData: postsData });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};