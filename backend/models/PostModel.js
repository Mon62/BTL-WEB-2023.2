class Post {
  constructor(pid, caption, imgURLs, likes, comments, createdAt, createdBy) {
    this.pid = pid;
    this.caption = caption;
    this.imgURLs = imgURLs;
    this.likes = likes;
    this.comments = comments;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }
}

export default Post;
