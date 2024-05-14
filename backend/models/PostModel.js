class Post {
  constructor(pid, caption, imgURLs, typeOfFirstMedia, likes, comments, createdAt, createdBy) {
    this.pid = pid;
    this.caption = caption;
    this.imgURLs = imgURLs;
    this.typeOfFirstMedia = typeOfFirstMedia;
    this.likes = likes;
    this.comments = comments;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }
}

export default Post;
