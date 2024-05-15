class Comment {
  constructor(commentId, postId, textComment, createdBy, createdAt) {
    this.commentId = commentId;
    this.postId = postId;
    this.textComment = textComment;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }
}

export default Comment;
