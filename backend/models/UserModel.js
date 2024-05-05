class User {
  constructor(
    uid,
    username,
    fullName,
    email,
    profilePicURL,
    biography,
    createdAt,
    followers,
    followingUsers,
    posts,
    newPosts,
    stories,
    newStories,
    highlights
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
    this.stories = stories;
    this.newStories = newStories;
    this.highlights = highlights;
  }
}

export default User;
