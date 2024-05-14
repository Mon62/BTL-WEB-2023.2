class Notification {
    constructor(type, sender, receiver, postId, storyId, createdAt, message) {
      this.type = type; // 'like', 'comment', 'follow', 'storyLike'
      this.sender = sender; // username of the sender
      this.receiver = receiver; // username of the receiver
      this.postId = postId; // postId (if applicable)
      this.storyId = storyId; // storyId (if applicable)
      this.createdAt = createdAt; // timestamp
      this.message = message; // message to be displayed in the notification
    }
  }