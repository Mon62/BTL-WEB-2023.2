class Story {
    constructor(storyId, caption, mediaURL, likes, createdAt, createdBy, timelive) {
        this.storyId = storyId;
        this.caption = caption;
        this.mediaURL = mediaURL; // media can be a image or video
        this.likes = likes;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.timelive = timelive;
    }
}

export default Story;