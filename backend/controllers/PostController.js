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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import multer from "multer";

import PostModel from "../models/PostModel.js";
import UserModel from "../models/UserModel.js";

export const createPost = async (req, res, next) => {
    const username = req.body.username; //createdBy
    const caption = req.body.caption;
    const files = req.files;

    const createdAt = Timestamp.now();
    const pid = uuid();
    let imgURLs = [];

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

try {
    await setDoc(doc(db, "posts", pid), postData);
    await updateDoc(doc(db, "users", username), {
        posts: arrayUnion(pid),
    });
    res.status(200).json({
        status: "success",
        message: "Đăng bài viết thành công!",
    });
} catch (error) {
    console.error(error);
    return next(error);
}
    console.log(postData);
}


// export const getPostsOfUser = async (req, res, next) => {
//     const username = req.params.username;
//     const userSnapshot = await getDoc(doc(db, "users", username));
//     if (!userSnapshot.exists()) {
//         return res.status(404).json({
//             status: "error",
//             message: "Người dùng không tồn tại!",
//         });
//     }
//     const user = userSnapshot.data();
//     const posts = [];
//     for (let i = 0; i < user.posts.length; i++) {
//         const postSnapshot = await getDoc(doc(db, "posts", user.posts[i]));
//         if (postSnapshot.exists()) {
//             posts.push(postSnapshot.data());
//         }
//     }
//     res.status(200).json({
//         status: "success",
//         message: "Lấy bài viết thành công!",
//         data: posts,
//     });
// }  