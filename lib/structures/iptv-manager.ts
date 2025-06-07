"use client"
import { IpTvConfig } from "./iptv-config";
import { Profile } from "./profiles/profile";
import { Catalog } from "./viewable/groups/catalog";

export class IptvManager {

    public config: IpTvConfig;
    public catalogMap: Map<number, Catalog> = new Map();
    public profileMap: Map<number, Profile> = new Map();
    private currentCatalog: Catalog | null = null;

    constructor() {
        //load config
        const iptvConfigString = localStorage.getItem("iptvConfig");
        const iptvConfigObject = iptvConfigString ? JSON.parse(iptvConfigString) : {};
        this.config = Object.assign(new IpTvConfig(), iptvConfigObject);

        //load profiles
        const storedProfiles: string | null = localStorage.getItem("profiles");
        if (storedProfiles !== null) {
            const profiles: Profile[] = JSON.parse(storedProfiles);

            for (const profile of profiles) {
                const { url, id, ...otherProperties } = profile;
                const p: Profile = new Profile(url, id, otherProperties);
                this.profileMap.set(p.id, p);
            }
        }
    }

    public save() {
        localStorage.setItem("profiles", JSON.stringify([...this.profileMap.values()]));
        localStorage.setItem("iptvConfig", JSON.stringify(this.config));
    }

    public addProfile(url: string): Profile {
        let maxID = -1;
        for (const profile of this.profileMap.values()) {
            if (profile.url === url)
                return profile;
            if (maxID < profile.id)
                maxID = profile.id;
        }
        maxID++;
        const profile = new Profile(url, maxID);
        this.profileMap.set(profile.id, profile);
        this.save();
        return profile;
    }

    private getCatalog(profile: Profile): Catalog {
        if (this.catalogMap.has(profile.id))
            return this.catalogMap.get(profile.id)!;
        const catalog = new Catalog(profile);
        this.catalogMap.set(profile.id, catalog);
        return catalog;
    }

    public async loadCatalog(profile: Profile, update: boolean,
        pushMessage: ((msg: string) => void) | undefined = undefined): Promise<Catalog> {
        const catalog = this.getCatalog(profile);
        if (await catalog.Load(update, pushMessage)) {
            if (profile.id !== this.config.lastProfileID)
                this.config.lastProfileID = profile.id;
            this.save();
        }
        this.currentCatalog = catalog;
        return catalog;
    }

    public setTheme(dark: boolean) {
        if (dark)
            document.documentElement.classList.add('dark');
        else
            document.documentElement.classList.remove('dark');
        this.config.darkTheme = dark;
        this.save();
    }

    public toggleTheme()
    {
        this.setTheme(!this.config.darkTheme);
    }

    public getCurrentCatalog(): Catalog | null {
        return this.currentCatalog;
    }

    public remProfile(id: number) {
        Catalog.deleteJson(id);
        this.profileMap.delete(id);
        this.save();
    }

    public findProfile(id: number): Profile | undefined {
        return this.profileMap.get(id);
    }

    public lastLoadedProfile(): Profile | undefined {
        if (this.config.loadLastProfile === false)
            return undefined;
        const lastID = this.config.lastProfileID;
        return lastID === -1 ? undefined : this.profileMap.get(lastID);
    }


    private static instance: IptvManager | null = null;
    static getInstance(): IptvManager {
        if (IptvManager.instance == null) {
            IptvManager.instance = new IptvManager();
        }
        return <IptvManager>IptvManager.instance;
    }

}
