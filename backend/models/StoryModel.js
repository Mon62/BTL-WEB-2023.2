class Story {
    constructor(storyId, caption, mediaURL, typeOfMedia, musicURL, likes, createdAt, createdBy, endAt) {
        this.storyId = storyId;
        this.caption = caption;
        this.mediaURL = mediaURL; // media can be a image or video
        this.typeOfMedia = typeOfMedia; // 'image' or 'video'
        this.likes = likes;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.endAt = endAt;
        this.musicURL = musicURL;
    }
}

export default Story;