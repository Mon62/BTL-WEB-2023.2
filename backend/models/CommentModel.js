class Comment {
  constructor(postId, comment, createdBy, createdAt) {
    this.postId = postId;
    this.comment = comment;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }
}

export default Comment;
