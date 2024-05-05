import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db, storage } from "../firebase.js";
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
          "https://bit.ly/broken-link",
          "",
          Date.now(),
          [],
          [],
          [],
          [],
          [],
          []
        );
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

//POST /login
export const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    await signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        // console.log(userCredential.user);
        // console.log(auth.currentUser);
        const user = userCredential.user;
        console.log(user);
        if (!user.emailVerified) {
          throw new Error("Vui lòng xác thực email trước khi đăng nhập!");
          next();
        }
        res.status(200).json({
          status: "success",
          message: "Bạn đã đăng nhập thành công",
        });
      }
    );
  } catch (error) {
    const errorCode = error.code;
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
  await signOut(auth)
    .then(() => {
      res.status(200).json({
        status: "success",
        message: "Bạn đã đăng xuất tài khoản!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
};

//POST /account/edit
export const editProfile = async (req, res, next) => {
  try {
    const profilePic = req.files["profilePic"]
      ? req.files["profilePic"][0]
      : null;
    const fullName = req.body.fullName;
    const biography = req.body.biography;
    const username = req.body.username;
    let profilePicURL;

    //update profilePic in storage
    if (profilePic != null) {
      // Delete old profilePic
      // const deleteRef = ref(storage, `profilePic/${username}`);
      // deleteObject(deleteRef).catch((err) => next(err));

      // Update new profilePic
      const imageRef = ref(
        storage,
        `profilePic/${username}/${profilePic.originalname + v4()}`
      );
      const metaData = {
        contentType: profilePic.mimetype,
      };
      await uploadBytes(imageRef, profilePic.buffer, metaData).catch((err) => {
        next(err);
      });

      // Get URL of new profilePic
      await getDownloadURL(imageRef)
        .then((url) => {
          profilePicURL = url;
        })
        .catch((err) => next(err));
    } else {
      const userRef = doc(db, "users", username);
      await getDoc(userRef)
        .then((doc) => {
          profilePicURL = doc.data().profilePicURL;
        })
        .catch((err) => next(err));
    }

    //update fullName, biography, profilePicURL in firestore
    await updateDoc(doc(db, "users", username), {
      fullName: fullName,
      biography: biography,
      profilePicURL: profilePicURL,
    }).catch((err) => {
      next(err);
    });

    res.status(200).json({
      message: "Chỉnh sửa trang cá nhân thành công!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

//GET /profile/:username
export const getProfileByUsername = async (req, res, next) => {
  try {
    const username = req.params.username;
    const q = query(collection(db, "users"), where("username", "==", username));
    // console.log(q);
    const querySnapshot = await getDocs(q).catch((err) => next(err));
    if (querySnapshot.empty) {
      return res
        .status(400)
        .json({ message: "Không tồn tại người dùng " + username });
    }
    querySnapshot.forEach((doc) => {
      return res.status(200).json({ message: "success", data: doc.data() });
      // console.log(doc.data());
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//POST /follow
export const followUser = (req, res, next) => {
  try {
    const username = req.body.username;
    const followingUsername = req.body.followingUsername;
    const usernameRef = doc(db, "users", username);
    const followingUsernameRef = doc(db, "users", followingUsername);

    // update followers of username in firestore
    getDoc(usernameRef)
      .then((user) => {
        let followingUsers = user.data().followingUsers;
        let newFollowingUsers = [...followingUsers, followingUsername];
        updateDoc(usernameRef, { followingUsers: newFollowingUsers }).catch(
          (err) => next(err)
        );
      })
      .catch((error) => next(error));

    // update followingUsers of followingUsername in firestore
    getDoc(followingUsernameRef)
      .then((user) => {
        let followers = user.data().followers;
        let newFollowers = [...followers, username];
        updateDoc(followingUsernameRef, { followers: newFollowers }).catch(
          (err) => next(err)
        );
      })
      .catch((error) => next(error));

    res.status(200).json({
      message: "Theo dõi người dùng " + followingUsername + " thành công.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//POST /unfollow
export const unfollowUser = (req, res, next) => {
  try {
    const username = req.body.username;
    const followingUsername = req.body.followingUsername;
    const usernameRef = doc(db, "users", username);
    const followingUsernameRef = doc(db, "users", followingUsername);

    // update followers of username in firestore
    getDoc(usernameRef)
      .then((user) => {
        let followingUsers = user.data().followingUsers;
        let newFollowingUsers = followingUsers.filter(
          (user) => user != followingUsername
        );
        updateDoc(usernameRef, { followingUsers: newFollowingUsers }).catch(
          (err) => next(err)
        );
      })
      .catch((error) => next(error));

    // update followingUsers of followingUsername in firestore
    getDoc(followingUsernameRef)
      .then((user) => {
        let followers = user.data().followers;
        let newFollowers = followers.filter((user) => user != username);
        updateDoc(followingUsernameRef, { followers: newFollowers }).catch(
          (err) => next(err)
        );
      })
      .catch((error) => next(error));

    res.status(200).json({
      message: "Hủy theo dõi người dùng " + followingUsername + " thành công.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};















