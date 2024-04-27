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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import multer from "multer";

import postModel from "../models/PostModel.js";

export const createPost = async (req, res, next) => {
    const username = req.body.username; //createdBy
    const caption = req.body.caption;
    // const imgURLs = req.body.imgURLs;
    // const imgPic =  req.file;
    const files = req.files;

    const createdAt = Timestamp.now();
    const pid = uuid();
    let imgURLs = [];
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

    // const imgRef = ref(
    //     storage,
    //     `post/${pid}/${imgPic.originalname + uuid()}`
    //   );
    //   const metaData = {
    //     contentType: imgPic.mimetype,
    //   };
    // await uploadBytes(imgRef, imgPic.buffer, metaData)
    //     .then((snapshot) => {
    //         console.log("Uploaded a blob or file!");
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //         next(error);
    //     });

    // await getDownloadURL(imgRef)
    //     .then((url) => {
    //         console.log("File available at", url);
    //         imgURLs.push(url);
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //         next(error);
    //     });

    //const postData = new postModel(username, caption, imgURL, createdAt);
    const postData = {
        pid: pid,
        caption: req.body.caption, // change this line
        //imgURLs: req.body.imgURLs, // change this line
        imgURLs: imgURLs,
        likes: [],
        comments: [],
        createdAt: createdAt,
        createdBy: username,
    };
    await setDoc(
        doc(db, "posts", pid),
        Object.assign({}, postData))
        .then(() => {
            res.status(200).json({
                status: "success",
                message: "Đăng bài viết thành công!",
            });
        })
        .catch((error) => {
            next(error);
        });
    console.log(postData);
}