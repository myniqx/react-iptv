import { TvShowWatchableObject, WatchableObject } from "../structures/viewable/watchable/watch-object";

export class M3UObject {

    isTvShow(): boolean {
        if (this.tvShowInfo === undefined) {
            this.checkTypeIfTvShow();
        }
        return this.tvShowInfo !== null;
    }

    isLiveStream(): boolean {
        if (this.possibleLiveStream === undefined) {
            const i: number = this.urlTvg.lastIndexOf('/');
            this.possibleLiveStream = i >= 0 ? this.urlTvg.indexOf('.', i) === -1 : false;
        }
        return this.possibleLiveStream === true;
    }

    public toJSON(): any {
        return {
            groupTitle: this.groupTitle,
            tvgName: this.tvgName,
            tvgLogo: this.tvgLogo,
            urlTvg: this.urlTvg,
        };
    }

    public fill(obj: WatchableObject) {
        obj.Name = this.tvgName;
        obj.Group = this.groupTitle;
        obj.Url = this.urlTvg;
        obj.Logo = this.tvgLogo;
        obj.AddedDate = this.date;
        obj.possibleLiveStream = this.isLiveStream();
        if (obj instanceof TvShowWatchableObject) {
            const tvShow: TvShowWatchableObject = obj;
            tvShow.Season = this.tvShowSeason;
            tvShow.Episode = this.tvShowEpisode;
            tvShow.Group = this.tvShowName;
        }
    }
    public groupTitle: string = "";
    public tvgName: string = "";
    public tvgLogo: string = "";
    public urlTvg: string = "";
    public date: Date | undefined = undefined;
    public possibleLiveStream: boolean | undefined = undefined;

    public tvShowInfo: [string, number, number] | null | undefined = undefined;

    get tvShowName(): string {
        if (this.tvShowInfo)
            return this.tvShowInfo[0];
        return this.tvgName;
    }

    get tvShowSeason(): number {
        if (this.tvShowInfo)
            return this.tvShowInfo[1];
        return 0;
    }

    get tvShowEpisode(): number {
        if (this.tvShowInfo)
            return this.tvShowInfo[2];
        return 0;
    }

    public checkTypeIfTvShow(): boolean {
        const name = this.tvgName;
        const len = name.length;
        let s = -1;
        let e = -1;
        let remIndex = -1;
        const isDigit = (ch: string) => '0' <= ch && ch <= '9';
        const isWhiteSpace = (ch: string) => " \n\r\t".includes(ch);

        for (let i = 0; i < len; i++) {
            const ch = name[i];

            if (s === -1 && (ch === 'S' || ch === 's')) {
                try {
                    const s0 = i + 1 < len ? name[i + 1] : '\0';
                    const s1 = i + 2 < len ? name[i + 2] : '\0';

                    if (isDigit(s0) && isDigit(s1)) {
                        s = Number(s0) * 10 + Number(s1);
                    } else if (isDigit(s0)) {
                        s = Number(s0);
                    }

                    if (s !== -1) {
                        for (let j = i - 1; j >= 0; j--) {
                            if (!isWhiteSpace(name[j])) {
                                remIndex = j + 1;
                                break;
                            }
                        }
                    }
                } catch (error) {
                    // TODO : ??
                }
            }

            if (s !== -1 && (ch === 'E' || ch === 'e')) {
                try {
                    const e0 = i + 1 < len ? name[i + 1] : '\0';
                    const e1 = i + 2 < len ? name[i + 2] : '\0';

                    if (isDigit(e0) && isDigit(e1)) {
                        e = Number(e0) * 10 + Number(e1);
                    } else if (isDigit(e0)) {
                        e = Number(e0);
                    }
                } catch (error) {
                    // TODO: ??
                }
            }
        }

        if (s === -1 || e === -1) {
            this.tvShowInfo = null;
            return false;
        }

        //TODO use groupName...
        const groupName = remIndex > 0 ? name.slice(0,remIndex) : name;
        this.tvShowInfo = [groupName, s, e];
        return true;
    }

    public toString(): string {
        return `
            <div>
                <p><strong>Grup Başlığı:</strong> ${this.groupTitle}</p>
                <p><strong>Tvg Adı:</strong> ${this.tvgName}</p>
                <p><strong>Tvg Logo:</strong> ${this.tvgLogo}</p>
                <p><strong>Url Tvg:</strong> ${this.urlTvg}</p>
                <p><strong>Tarih:</strong> ${this.date ? this.date.toDateString() : 'N/A'}</p>
                <p><strong>Olası Canlı Yayın?</strong> ${this.possibleLiveStream !== null ? (this.possibleLiveStream ? 'Evet' : 'Hayır') : 'N/A'}</p>
                ${this.tvShowInfo !== null && this.tvShowInfo !== undefined ? `<p><strong>Dizi Bilgisi:</strong> İsim - ${this.tvShowInfo[0]}, Sezon - ${this.tvShowInfo[1]}, Bölüm - ${this.tvShowInfo[2]}</p>` : ''}
            </div>
        `;
    }
}
