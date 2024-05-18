class User {
  constructor(
    uid,
    username,
    fullName,
    email,
    profilePicURL,
    biography,
    createdAt, // TimeStamp
    followers, //username string
    followingUsers, // username string
    posts, // array of postID
    newPosts, // array of postID
    savedPosts, // array of postID be saved
    stories, // array of storyID
    newStories, // map key (username) - value (array of storyID) xem mẫu newStories trong username nam03nd trên firebase 
    myNewStories, // newStories from me
    highlights, // array of highlightIDs
    notifications // array of notificationID
  ) {
    this.uid = uid;
    this.username = username;
    this.fullName = fullName;
    this.email = email;
    this.profilePicURL = profilePicURL;
    this.biography = biography;
    this.createdAt = createdAt;
    this.followers = followers;
    this.followingUsers = followingUsers;
    this.posts = posts;
    this.newPosts = newPosts;
    this.savedPosts = savedPosts;
    this.stories = stories;
    this.newStories = newStories;
    this.myNewStories = myNewStories;
    this.highlights = highlights;
    this.notifications = notifications;
  }
}

export default User;
