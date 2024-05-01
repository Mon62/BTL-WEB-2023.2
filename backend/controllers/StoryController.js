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
import storyModel from "../models/StoryModel.js";

export const createStory = async (req, res, next) => {
    const username = req.body.username; //createdBy
    const caption = req.body.caption;
    // const imageURL = req.body.imageURL;
    // const musicURL = req.body.musicURL;
    const media = req.file;
    const createdAt = Timestamp.now();
    const storyId = uuid();

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
        timelive: 24, //hours
    };
    // await setDoc(
    //     doc(db, "stories", storyId),
    //     Object.assign({}, storyData))
    //     .then(() => {
    //         res.status(200).json({
    //             status: "success",
    //             message: "Đăng story thành công!",
    //         });
    //     })
    //     .catch((error) => {
    //         next(error);
    //     });
    // console.log(storyData);
    
    try {
        await setDoc(doc(db, "stories", storyId), storyData);
        await updateDoc(doc(db, "users", username), {
            stories: arrayUnion(storyId),
        });
        res.status(200).json({
            status: "success",
            message: "Đăng bài viết thành công!",
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
        console.log(storyData);
    }
// }