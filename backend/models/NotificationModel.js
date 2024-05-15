class Notification {
    constructor(nid, type, sender, receiver, postId, storyId, commentId, createdAt, message) {
      this.nid = nid; // notificationId
      this.type = type; // 'like', 'comment', 'follow', 'storyLike'
      this.sender = sender; // username of the sender
      this.receiver = receiver; // username of the receiver
      this.postId = postId; // postId (if applicable)
      this.storyId = storyId; // storyId (if applicable)
      this.commentId = commentId; // commentId (if applicable)
      this.createdAt = createdAt; // timestamp
      this.message = message; // message to be displayed in the notification
    }
  }

  export default Notification;