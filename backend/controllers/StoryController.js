import { v4 as uuid } from 'uuid';
import { db } from "../firebase.js";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import storyModel from "../models/StoryModel.js";

export const createStory = async (req, res, next) => {
    const userId = req.body.userId; //createdBy
    const caption = req.body.caption;
    const imageURL = req.body.imageURL;
    const musicURL = req.body.musicURL;
    
    const createdAt = Timestamp.now();
    const storyId = uuid();

    const storyData = {
        storyId: storyId,
        caption: caption,
        imgURL: imageURL,
        musicURL: musicURL,
        likes: [],
        createdAt: createdAt,
        createdBy: userId,
    };
    await setDoc(
        doc(db, "stories", storyId),
        Object.assign({}, storyData))
        .then(() => {
            res.status(200).json({
                status: "success",
                message: "Đăng story thành công!",
            });
        })
        .catch((error) => {
            next(error);
        });
    console.log(storyData);
}