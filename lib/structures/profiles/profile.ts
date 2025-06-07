export class Profile {
    public groupCount: number = 0;
    public totalCount: number = 0;
    public tvShowSeasonCount: number = 0;
    public tvShowEpisodeCount: number = 0;
    public liveStreamCount: number = 0;
    public movieCount: number = 0;
    public tvShowCount: number = 0;

    public name: string;
    public createdDate: number;
    public updatedDate: number;
    public url: string;
    public id: number;

    /**
     * Returns the last updated date as a string.
     *
     * @return {string} The last updated date in the format "X days ago."
     */
    get lastUpdated(): string {
        if (this.updatedDate === 0) return "none";
        const now = new Date();
        const timeDiff = Math.floor((now.getTime() - this.updatedDate) / (1000 * 60 * 60 * 24));
        return `${timeDiff} days ago.`;
    }
    
    /**
     * Constructor for the Profile class.
     *
     * @param {string} url - The URL of the profile.
     * @param {number} id - The ID of the profile.
     * @param {Partial<Profile>} otherProperties - Other properties to assign to the profile.
     */
    constructor(url: string = "", id: number = 0, otherProperties: Partial<Profile> = {}) {
        this.url = url;
        this.id = id;
        this.name = `profile#${id}`;
        this.createdDate = Date.now();
        this.updatedDate = 0;
        Object.assign(this, otherProperties);
    }

}
