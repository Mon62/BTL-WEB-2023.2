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
    following,
    posts,
    stories
  ) {
    this.uid = uid;
    this.username = username;
    this.fullName = fullName;
    this.email = email;
    this.profilePicURL = profilePicURL;
    this.biography = biography;
    this.createdAt = createdAt;
    this.followers = followers;
    this.following = following;
    this.posts = posts;
    this.stories = stories;
  }
}

export default User;
