class Post {
  constructor(pid, caption, imgURLs, typeOfFirstMedia, typesOfMedia, likes, comments, createdAt, createdBy, savedBy) {
    this.pid = pid;
    this.caption = caption;
    this.imgURLs = imgURLs;
    this.typeOfFirstMedia = typeOfFirstMedia;
    this.typesOfMedia = typesOfMedia;
    this.likes = likes;
    this.comments = comments;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.savedBy = savedBy;
  }
}

export default Post;
