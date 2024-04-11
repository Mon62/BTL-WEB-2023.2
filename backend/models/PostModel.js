class Post {
  constructor(pid, caption, imgURL, likes, comments, createdAt, createdBy) {
    this.pid = pid;
    this.caption = caption;
    this.imgURL = imgURL;
    this.likes = likes;
    this.comments = comments;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }
}

export default Post;
