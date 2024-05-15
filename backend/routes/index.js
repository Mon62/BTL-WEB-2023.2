import userRoutes from "./UserRoutes.js";
import postRoutes from "./PostRoutes.js";
import storyRoutes from "./StoryRoutes.js";
import highlightRoutes from "./HighlightRoutes.js";

export default function router(app) {
  app.use("/", userRoutes);
  app.use("/", postRoutes);
  app.use("/", storyRoutes);
  app.use("/", highlightRoutes);
  app.use("/", (req, res, next) => {
    res.status(400).json({ message: "Invalid endpoint" });
  });
  app.use(function (error, req, res, next) {
    console.log(error);
    const errorCode = error.code;
    // signup
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

    // login
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

    
    res.status(400).json({ message: error.message });
  });
}
