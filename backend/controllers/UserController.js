import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, db, storage, admin } from "../firebase.js";
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
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import userModel from "../models/UserModel.js";
import { v4 } from "uuid";

//POST /signup
export const registerUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const fullName = req.body.fullName;

    // check if username already exists
    const docRef = doc(db, "users", username);
    await getDoc(docRef).then((doc) => {
      if (doc.exists())
        res.status(409).json({
          status: "error",
          message: "Tên người dùng đã tồn tại. Vui lòng chọn tên thay thế!",
        });
    });
    if (res.statusCode > 200) {
      return;
    }

    await createUserWithEmailAndPassword(auth, email, password).then(
      async (userCredential) => {
        const user = userCredential.user;

        // set data for new user
        const userData = new userModel(
          user.uid,
          username,
          fullName,
          email,
          "",
          "",
          Date.now(),
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          []
        );
        updateProfile(auth.currentUser, {
          displayName: username,
        });
        await setDoc(doc(db, "users", username), Object.assign({}, userData));
        await sendEmailVerification(auth.currentUser);

        res.status(200).json({
          status: "success",
          message:
            "Bạn đã đăng ký tài khoản thành công. Thư xác nhận đã được gửi đến email của bạn, vui lòng xác nhận tiếp tục. Trân trọng!",
        });
      }
    );
  } catch (error) {
    const errorCode = error.code;
    if (errorCode === "auth/email-already-in-use")
      return res.status(409).json({
        status: "error",
        message: "Email đã được sử dụng",
      });
    if (errorCode === "auth/weak-password") {
      return res.status(403).json({
        status: "failed",
        message: "Mật khẩu cần có ít nhất 6 ký tự",
      });
    }
    if (errorCode === "auth/invalid-email")
      return res.status(403).json({
        status: "failed",
        message: "Email Không hợp lệ",
      });

    res.status(400).json({ message: error.message });
  }
};

//POST /login
export const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    await signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        if (!user.emailVerified) {
          throw new Error("Vui lòng xác thực email trước khi đăng nhập!");
          next();
        }
        res.status(200).json({
          username: user.displayName,
          accessToken: user.accessToken,
          message: "Bạn đã đăng nhập thành công",
        });
      }
    );
  } catch (error) {
    const errorCode = error.code;
    console.log(error.code);
    if (errorCode === "auth/invalid-credential") {
      return res.status(403).json({
        status: "failed",
        message: "Email hoặc mật khẩu không chính xác!",
      });
    }
    if (errorCode === "auth/invalid-email") {
      return res.status(403).json({
        status: "failed",
        message: "Email không hợp lệ!",
      });
    }
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

//GET /logout
export const logout = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(() => {
        signOut(auth)
          .then(() => {
            res.status(200).json({
              status: "success",
              message: "Bạn đã đăng xuất tài khoản!",
            });
          })
          .catch((error) => {
            next(error);
          });
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

//POST /password/reset
export const resetPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    await sendPasswordResetEmail(auth, email).then(() => {
      res.status(200).json({
        status: "success",
        message:
          "Thư hướng dẫn cách reset lại mật khẩu đã được gửi đến email của bạn!",
      });
    });
  } catch (error) {
    const errorCode = error.code;
    if (errorCode === "auth/invalid-email") {
      return res.status(400).json({
        status: "error",
        message: "Email không hợp lệ.",
      });
    }
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

//PUT /account/edit
export const editProfile = async (req, res, next) => {
  try {
    const profilePic = req.files["profilePic"]
      ? req.files["profilePic"][0]
      : null;
    const fullName = req.body.fullName;
    const biography = req.body.biography;
    const username = req.body.username;
    const accessToken = req.headers.authorization;
    let profilePicURL;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(async () => {
        //update profilePic in storage
        if (profilePic != null) {
          // Update new profilePic
          const newProfilePicPath = `profilePic/${username}/${
            profilePic.originalname + v4()
          }`;
          const imageRef = ref(storage, newProfilePicPath);
          const metaData = {
            contentType: profilePic.mimetype,
          };
          await uploadBytes(imageRef, profilePic.buffer, metaData);

          // Get URL of new profilePic
          await getDownloadURL(imageRef).then((url) => {
            profilePicURL = url;
          });

          // Delete old profilePic
          const profilePicRef = ref(storage, `profilePic/${username}`);
          listAll(profilePicRef).then((res) => {
            res.items.forEach((item) => {
              let path = item._location.path_;
              if (path != newProfilePicPath) {
                let deleteRef = ref(storage, path);
                deleteObject(deleteRef);
              }
            });
          });
        } else {
          const userRef = doc(db, "users", username);
          await getDoc(userRef).then((doc) => {
            profilePicURL = doc.data().profilePicURL;
          });
        }

        //update fullName, biography, profilePicURL in firestore
        await updateDoc(doc(db, "users", username), {
          fullName: fullName,
          biography: biography,
          profilePicURL: profilePicURL,
        });

        res.status(200).json({
          message: "Chỉnh sửa trang cá nhân thành công!",
        });
      })
      .catch((err) => next(err));
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

//GET /profile/:username
export const getProfileByUsername = async (req, res, next) => {
  try {
    const username = req.params.username;
    const accessToken = req.headers.authorization;

    // console.log(accessToken);
    admin
      .auth()
      .verifyIdToken(accessToken)
      .then((decodedToken) => {
        // console.log(decodedToken);

        const docRef = doc(db, "users", username);

        setTimeout(async () => {
          await getDoc(docRef)
            .then((doc) => {
              if (!doc.exists()) {
                return res
                  .status(400)
                  .json({ message: "Không tồn tại người dùng " + username });
              }
              const userData = doc.data();
              return res.status(200).json({
                biography: userData.biography,
                followers: userData.followers,
                followingUsers: userData.followingUsers,
                fullName: userData.fullName,
                highlights: userData.highlights,
                posts: userData.posts,
                profilePicURL: userData.profilePicURL,
                stories: userData.stories,
                myNewStories: userData.myNewStories,
              });
            })
            .catch((err) => next(err));
        }, 500);
      })
      .catch((err) => next(err));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//POST /follow
export const followUser = (req, res, next) => {
  try {
    const currentUser = req.body.currentUser;
    const targetUser = req.body.targetUser;
    const currentUserRef = doc(db, "users", currentUser);
    const targetUserRef = doc(db, "users", targetUser);
    const accessToken = req.headers.accessToken;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(() => {
        // update followers of username in firestore
        getDoc(currentUserRef)
          .then((user) => {
            let followingUsers = user.data().followingUsers;
            let newFollowingUsers = [...followingUsers, targetUser];
            updateDoc(currentUserRef, {
              followingUsers: newFollowingUsers,
            }).catch((err) => next(err));
          })
          .catch((err) => next(err));

        // update followingUsers of targetUser in firestore
        getDoc(targetUserRef)
          .then((user) => {
            let followers = user.data().followers;
            let newFollowers = [...followers, currentUser];
            updateDoc(targetUserRef, { followers: newFollowers }).catch((err) =>
              next(err)
            );
          })
          .catch((err) => next(err));

        res.status(200).json({
          message: "Theo dõi người dùng " + targetUser + " thành công.",
        });
      })
      .catch((err) => next(err));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//POST /unFollow
export const unfollowUser = (req, res, next) => {
  try {
    const currentUser = req.body.currentUser;
    const targetUser = req.body.targetUser;
    const currentUserRef = doc(db, "users", currentUser);
    const targetUserRef = doc(db, "users", targetUser);
    const accessToken = req.headers.accessToken;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(() => {
        // update followers of username in firestore
        getDoc(currentUserRef)
          .then((user) => {
            let followingUsers = user.data().followingUsers;
            let newFollowingUsers = followingUsers.filter(
              (user) => user != targetUser
            );
            updateDoc(currentUserRef, {
              followingUsers: newFollowingUsers,
            }).catch((err) => next(err));
          })
          .catch((err) => next(err));

        // update followingUsers of targetUser in firestore
        getDoc(targetUserRef)
          .then((user) => {
            let followers = user.data().followers;
            let newFollowers = followers.filter((user) => user != currentUser);
            updateDoc(targetUserRef, { followers: newFollowers }).catch((err) =>
              next(err)
            );
          })
          .catch((err) => next(err));

        res.status(200).json({
          message: "Hủy theo dõi người dùng " + targetUser + " thành công.",
        });
      })
      .catch((err) => next(err));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//POST /checkIfFollowing
export const checkFollowStatus = (req, res, next) => {
  try {
    const currentUser = req.body.currentUser;
    const targetUser = req.body.targetUser;
    const userRef = doc(db, "users", currentUser);
    const accessToken = req.headers.accessToken;

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then(() => {
        setTimeout(function () {
          getDoc(userRef)
            .then((doc) => {
              const followingUsers = doc.data().followingUsers;
              followingUsers.forEach((username) => {
                if (username === targetUser)
                  res.status(201).json({ followStatus: "Following" });
              });
              if (res.statusCode == 200)
                res.status(200).json({ followStatus: "Follow" });
            })
            .catch((err) => next(err));
        }, 500);
      })
      .catch((err) => next(err));
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};
