import { v4 as uuid } from 'uuid';
import { db } from "../firebase.js";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import postModel from "../models/PostModel.js";

export const createPost = async (req, res, next) => {
    const userId = req.body.userId; //createdBy
    const caption = req.body.caption;
    const imageURL = req.body.imageURL;

    const createdAt = Timestamp.now();
    const pid = uuid();

    //const postData = new postModel(userId, caption, imageURL, createdAt);
    const postData = {
        pid: pid,
        caption: caption,
        imgURL: imageURL,
        likes: [],
        comments: [],
        createdAt: createdAt,
        createdBy: userId,
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