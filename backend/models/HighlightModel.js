class Highlight {
    constructor(hlid, hlname, username, hlimgURL, stories) {
        this.hlid = hlid;//highlight id
        this.hlname = hlname;//highlight name
        this.hlimgURL = hlimgURL;//highlight image url (cover image)
        this.username = username;//username of the owner of the highlight
        this.stories = stories;//array of story ids
    }
}

export default Highlight;