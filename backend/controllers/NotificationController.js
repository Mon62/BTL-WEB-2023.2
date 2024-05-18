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
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import Notification from "../models/NotificationModel.js";

export const likePost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const username = req.body.username;

    const postRef = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postRef).catch((err) => next(err));
    const accessToken = req.headers.authorization;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        if (!postSnapshot.exists()) {
          return res.status(404).json({ message: "Post not found" });
        }

        const post = postSnapshot.data();

        if (post.likes.includes(username)) {
          return res.status(400).json({ message: "Post already liked" });
        }

        // Create a new notification
        const notificationId = uuid();
        const notification = new Notification(
          notificationId,
          "post",
          username,
          post.createdBy,
          postId,
          null,
          null,
          Timestamp.now(),
          `${username} đã thích bài viết của bạn`
        );

        const notificationData = {
          nid: notificationId,
          type: notification.type,
          sender: notification.sender,
          receiver: notification.receiver,
          postId: notification.postId,
          storyId: notification.storyId,
          commentId: notification.commentId,
          createdAt: notification.createdAt,
          message: JSON.stringify(notification.message),
        };

        const notificationRef = doc(db, "notifications", notificationId);
        await setDoc(notificationRef, notificationData).catch((err) =>
          next(err)
        );

        // Update the likes array of the post
        await updateDoc(postRef, { likes: arrayUnion(username) }).catch((err) =>
          next(err)
        );

        // Update the notifications array of the receiver
        const userRef = doc(db, "users", post.createdBy);
        await updateDoc(userRef, {
          notifications: arrayUnion(notificationId),
        }).catch((err) => next(err));

        res.status(200).json({ message: "Post liked" });
      })
      .catch((err) => next(err));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const username = req.body.username;

    const postRef = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postRef).catch((err) => next(err));
    const accessToken = req.headers.authorization;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        if (!postSnapshot.exists()) {
          return res.status(404).json({ message: "Post not found" });
        }

        const post = postSnapshot.data();

        if (!post.likes.includes(username)) {
          return res.status(400).json({ message: "Post not already liked" });
        }

        // Remove the like from the post
        await updateDoc(postRef, { likes: arrayRemove(username) }).catch(
          (err) => next(err)
        );

        // Remove the notification for the post like
        const userRef = doc(db, "users", post.createdBy);
        const userSnapshot = await getDoc(userRef).catch((err) => next(err));
        const userData = userSnapshot.data();

        // Find the notificationId for the postId and username
        let notificationId;
        for (const nid of userData.notifications) {
          const notificationSnapshot = await getDoc(
            doc(db, "notifications", nid)
          ).catch((err) => next(err));
          const notificationData = notificationSnapshot.data();
          if (
            notificationData.postId === postId &&
            notificationData.sender === username
          ) {
            notificationId = nid;
            break;
          }
        }

        if (notificationId) {
          // Remove the notificationId from the database
          await deleteDoc(doc(db, "notifications", notificationId)).catch(
            (err) => next(err)
          );

          // Remove the notificationId from the user's notifications array
          const notificationIndex =
            userData.notifications.indexOf(notificationId);
          userData.notifications.splice(notificationIndex, 1);

          // Update the notifications array in the database
          await updateDoc(userRef, {
            notifications: userData.notifications,
          }).catch((err) => next(err));
        }

        res.status(200).json({ message: "Post unliked" });
      })
      .catch((err) => next(err));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const likeStory = async (req, res) => {
  try {
    const storyId = req.body.storyId;
    const username = req.body.username;

    const storyRef = doc(db, "stories", storyId);
    const storySnapshot = await getDoc(storyRef).catch((err) => next(err));
    const accessToken = req.headers.authorization;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        if (!storySnapshot.exists()) {
          return res.status(404).json({ message: "Story not found" });
        }

        const story = storySnapshot.data();

        if (story.likes.includes(username)) {
          return res.status(400).json({ message: "Story already liked" });
        }

        // Create a new notification
        const notificationId = uuid();
        const notification = new Notification(
          notificationId,
          "story",
          username,
          story.createdBy,
          null,
          storyId,
          null,
          Timestamp.now(),
          `${username} đã thích tin của bạn`
        );

        const notificationData = {
          nid: notificationId,
          type: notification.type,
          sender: notification.sender,
          receiver: notification.receiver,
          postId: notification.postId,
          storyId: notification.storyId,
          commentId: notification.commentId,
          createdAt: notification.createdAt,
          message: JSON.stringify(notification.message),
        };

        const notificationRef = doc(db, "notifications", notificationId);
        await setDoc(notificationRef, notificationData).catch((err) =>
          next(err)
        );

        // Update the likes array of the story
        await updateDoc(storyRef, { likes: arrayUnion(username) }).catch(
          (err) => next(err)
        );

        // Update the notifications array of the receiver
        const userRef = doc(db, "users", story.createdBy);
        await updateDoc(userRef, {
          notifications: arrayUnion(notificationId),
        }).catch((err) => next(err));

        res.status(200).json({ message: "Story liked" });
      })
      .catch((err) => next(err));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const unlikeStory = async (req, res) => {
  try {
    const storyId = req.body.storyId;
    const username = req.body.username;

    const storyRef = doc(db, "stories", storyId);
    const storySnapshot = await getDoc(storyRef).catch((err) => next(err));
    const accessToken = req.headers.authorization;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        if (!storySnapshot.exists()) {
          return res.status(404).json({ message: "Story not found" });
        }

        const story = storySnapshot.data();

        if (!story.likes.includes(username)) {
          return res.status(400).json({ message: "Story not already liked" });
        }

        // Remove the like from the story
        await updateDoc(storyRef, { likes: arrayRemove(username) }).catch(
          (err) => next(err)
        );

        // Remove the notification for the story like
        const userRef = doc(db, "users", story.createdBy);
        const userSnapshot = await getDoc(userRef).catch((err) => next(err));
        const userData = userSnapshot.data();

        // Find the notificationId for the storyId and username
        let notificationId;
        for (const nid of userData.notifications) {
          const notificationSnapshot = await getDoc(
            doc(db, "notifications", nid)
          ).catch((err) => next(err));
          const notificationData = notificationSnapshot.data();
          if (
            notificationData.storyId === storyId &&
            notificationData.sender === username
          ) {
            notificationId = nid;
            break;
          }
        }

        if (notificationId) {
          // Remove the notificationId from the database
          await deleteDoc(doc(db, "notifications", notificationId)).catch(
            (err) => next(err)
          );

          // Remove the notificationId from the user's notifications array
          const notificationIndex =
            userData.notifications.indexOf(notificationId);
          userData.notifications.splice(notificationIndex, 1);

          // Update the notifications array in the database
          await updateDoc(userRef, {
            notifications: userData.notifications,
          }).catch((err) => next(err));
        }

        res.status(200).json({ message: "Story unliked" });
      })
      .catch((err) => next(err));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// export const commentOnPost = async (req, res) => {
//   try {
//     const postId = req.body.postId;
//     const username = req.body.username;
//     const textComment = req.body.textComment;

//     const commentId = uuid();
//     const createdAt = Timestamp.now();

//     const comment = {
//       commentId,
//       postId,
//       textComment,
//       createdBy: username,
//       createdAt,
//     };

//     // Save the comment to the database
//     const commentRef = doc(db, 'comments', commentId);
//     await setDoc(commentRef, comment);

//     // Add the commentId to the post's comments array
//     const postRef = doc(db, 'posts', postId);
//     await updateDoc(postRef, { comments: arrayUnion(commentRef.id) });

//     // Create a new notification
//     const message = textComment.length > 20 ? `${textComment.substring(0, 20)}...` : textComment;
//     const notification = {
//       type: 'comment',
//       message: `${username} đã bình luận "${message}"`,
//       createdAt: serverTimestamp(),
//     };

//     // Save the notification to the database
//     const notificationRef = doc(db, 'notifications');
//     await setDoc(notificationRef, notification);

//     // Add the notificationId to the post owner's notifications array
//     const postSnapshot = await getDoc(postRef);
//     const postOwner = postSnapshot.data().createdBy;
//     const userRef = doc(db, 'users', postOwner);
//     await updateDoc(userRef, { notifications: arrayUnion(notificationRef.id) });

//     res.status(200).json({ message: 'Comment added successfully' });
//   }
//   catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

export const commentOnPost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const username = req.body.username;
    const textComment = req.body.textComment;

    const commentId = uuid();
    const createdAt = Timestamp.now();
    const accessToken = req.headers.authorization;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        const commentData = {
          commentId: commentId,
          postId: postId,
          textComment: JSON.stringify(textComment),
          createdAt: createdAt,
          createdBy: username,
        };

        await setDoc(doc(db, "comments", commentId), commentData).catch((err) =>
          next(err)
        );

        //add comment to post
        const postRef = doc(db, "posts", postId);
        const postSnapshot = await getDoc(postRef).catch((err) => next(err));
        const postData = postSnapshot.data();
        const comments = postData.comments;
        comments.push(commentId);
        await updateDoc(postRef, { comments: comments }).catch((err) =>
          next(err)
        );

        //create notification
        const message =
          textComment.length > 20
            ? `${textComment.substring(0, 20)}...`
            : textComment;
        const nid = uuid();

        const notificationData = {
          nid: nid,
          type: "comment",
          sender: username,
          receiver: postData.createdBy,
          postId: postId,
          storyId: null,
          commentId: commentId,
          createdAt: Timestamp.now(),
          message: `${username} đã bình luận "${message}"`,
        };

        await setDoc(doc(db, "notifications", nid), notificationData).catch(
          (err) => next(err)
        );

        //add notification to user
        const userRef = doc(db, "users", postData.createdBy);
        const userSnapshot = await getDoc(userRef).catch((err) => next(err));
        const userData = userSnapshot.data();
        const notifications = userData.notifications;
        notifications.push(nid);
        await updateDoc(userRef, { notifications: notifications }).catch(
          (err) => next(err)
        );

        res.status(200).json({ message: "Comment added successfully" });
      })
      .catch((err) => next(err));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.body.commentId;
    const username = req.body.username;

    const commentRef = doc(db, "comments", commentId);
    const commentSnapshot = await getDoc(commentRef).catch((err) => next(err));
    const commentData = commentSnapshot.data();
    const accessToken = req.headers.authorization;
    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        if (commentData.createdBy !== username) {
          return res.status(403).json({ message: "Unauthorized" });
        }

        //remove comment from post
        const postRef = doc(db, "posts", commentData.postId);
        await updateDoc(postRef, { comments: arrayRemove(commentId) }).catch(
          (err) => next(err)
        );

        // remove the notification for the comment
        const userRef = doc(
          db,
          "users",
          (await getDoc(postRef)).data().createdBy
        );
        const userSnapshot = await getDoc(userRef).catch((err) => next(err));
        const userData = userSnapshot.data();

        // Find the notificationId for the commentId and username
        let notificationId;
        console.log("userData.notifications: ", userData.notifications);
        for (const nid of userData.notifications) {
          const notificationSnapshot = await getDoc(
            doc(db, "notifications", nid)
          ).catch((err) => next(err));
          const notificationData = notificationSnapshot.data();
          console.log(
            "notificationData.commentId: ",
            notificationData.commentId
          );
          console.log("commentId: ", commentId);
          if (
            notificationData.commentId === commentId &&
            notificationData.sender === username
          ) {
            notificationId = nid;
            break;
          }
        }
        console.log("notificationId: ", notificationId);
        if (notificationId) {
          // Remove the notificationId from the database
          await deleteDoc(doc(db, "notifications", notificationId)).catch(
            (err) => next(err)
          );

          // Remove the notificationId from the user's notifications array
          const notificationIndex =
            userData.notifications.indexOf(notificationId);
          userData.notifications.splice(notificationIndex, 1);

          // Update the notifications array in the database
          await updateDoc(userRef, {
            notifications: userData.notifications,
          }).catch((err) => next(err));
        }

        //remove comment
        await deleteDoc(commentRef).catch((err) => next(err));

        res.status(200).json({ message: "Comment deleted successfully" });
      })
      .catch((err) => next(err));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const getNotificationsByUsername = async (req, res) => {
  try {
    const username = req.params.username;

    const userRef = doc(db, "users", username);
    const userSnapshot = await getDoc(userRef).catch((err) => next(err));
    const userData = userSnapshot.data();
    const accessToken = req.headers.authorization;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        const notifications = [];
        for (const nid of userData.notifications) {
          const notificationSnapshot = await getDoc(
            doc(db, "notifications", nid)
          ).catch((err) => next(err));
          const notificationData = notificationSnapshot.data();
          notifications.unshift(notificationData);
        }
        res.status(200).json(notifications);
      })
      .catch((err) => next(err));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;

    const postRef = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postRef).catch((err) => next(err));
    const postData = postSnapshot.data();

    const comments = [];
    for (const cid of postData.comments) {
      const commentSnapshot = await getDoc(doc(db, "comments", cid)).catch(
        (err) => next(err)
      );
      const commentData = commentSnapshot.data();
      comments.unshift(commentData);
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const commentRef = doc(db, "comments", commentId);
    const commentSnapshot = await getDoc(commentRef).catch((err) => next(err));
    const commentData = commentSnapshot.data();

    res.status(200).json(commentData);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
