class Story {
    constructor(storyId, caption, imgURL, musicURL, likes, createdAt, createdBy) {
        this.storyId = storyId;
        this.caption = caption;
        this.imgURL = imgURL;
        this.musicURL = musicURL;
        this.likes = likes;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
    }
}

export default Story;