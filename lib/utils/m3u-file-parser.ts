import { M3UObject } from "./m3u-object"; // M3UObject sınıfının import edildiğini varsayalım.

export class M3UFileParser {
    private _fileSize: number;
    private _source: string;
    private _fileCursor: number;
    private _lastPercent: number;

    constructor(source: string) {
        this._fileSize = source.length;
        this._source = source;
        this._lastPercent = 0;
        this._fileCursor = 0;
    }

    private key: [number, number] = [0, 0];
    private value: [number, number]= [0,0];

    private line1st: string = "";
    private line2nd: string = "";

    readLine(): string | null
    {
        const src = this._source;
        const len = this._fileSize;
        let i = this._fileCursor;
        if (i >= len) return null;
        let end = i;
        for ( ; i < len; i++)
        {
            const ch = src[i]
            if (ch == '\r' || ch == '\n')
            {
                end = i;
                i++;
                if (ch == '\r' && i < len)
                {
                    if (src[i] == '\n') i++;
                }
                break;
            }
        }
        const line = src.substring(this._fileCursor, end);
        this._fileCursor = i;
        return line;
    }

    private readElement(): boolean {
        const line: string | null = this.readLine();
        if (line === null) {
            return false;
        }
        this.line1st = line;
        const line2: string | null = this.readLine();
        if (line2 === null) {
            return false;
        }
        this.line2nd = line2;
        const percent: number = (this._fileCursor / this._fileSize) * 100.0;
        if (percent - this._lastPercent > 1.123) {
            this._lastPercent = percent;
        }
        return true;
    }

    private readHeader(): boolean {
        const head: string | null = this.readLine();
        if (head === null) {
            return false;
        }
        return head.startsWith("#EXTM3U");
    }

    private lineStop: number = 0;
    private lineCursor: number = 0;
    private name: string = "";

    private skipWhitespace(): void {
        for (; this.lineCursor < this.lineStop; this.lineCursor++) {
            const ch: string = this.line1st[this.lineCursor];
            if (!" \t\n\r".includes(ch)) {
                return;
            }
        }
    }

    private getString(): boolean {
        let prev: string = this.line1st[this.lineCursor++];
        const begin = this.lineCursor;
        while (this.lineCursor < this.lineStop)
        {
            const ch: string = this.line1st[this.lineCursor++];
            if (ch == '"' && prev != '\\')
            {
                const end = this.lineCursor - 1;
                this.value = [begin, end];
                return true;
            }
            prev = ch;
        }
        return true;
    }

    private getToken(): boolean {
        this.skipWhitespace();
        if (this.lineCursor === this.lineStop) {
            return false;
        }
        const begin = this.lineCursor;

        while (this.lineCursor < this.lineStop) {
            const ch = this.line1st[this.lineCursor];
            if (ch === '=') {
                const end = this.lineCursor++;
                this.key = [begin, end];
                return this.getString();
            }
            if (" \t\n\r".indexOf(ch) >= 0) {
                break;
            }
            this.lineCursor++;
        }
        this.key = [begin, this.lineCursor];
        return true;
    }

    private beginLine(): boolean {
        let inqu: boolean = false;
        for (this.lineStop = 0; this.lineStop < this.line1st.length; this.lineStop++) {
            const c: string = this.line1st[this.lineStop];
            if (c === '"') {
                inqu = !inqu;
                continue;
            }
            if (inqu) {
                continue;
            }
            if (c === ',') {
                break;
            }
        }
        if (this.lineStop === -1 || !this.line1st.startsWith("#EXTINF")) {
            return false;
        }
        this.name = this.line1st.substring(this.lineStop + 1);
        for (this.lineCursor = 7; this.lineCursor < this.lineStop; this.lineCursor++) {
            if (" \t\n\r".indexOf(this.line1st[this.lineCursor])) {
                break;
            }
        }
        return true;
    }

    getKey(): string
    {
        return this.line1st.substring(this.key[0], this.key[1]).toLocaleLowerCase();
    }

    getValue(): string
    {
        return this.line1st.substring(this.value[0], this.value[1]);
    }

    public async loadM3U(): Promise<M3UObject[] | null> {
        
        try {

            if (!(this.readHeader())) {
                return null;
            }
            const objects: M3UObject[] = [];
            let o: M3UObject | null = null;
            while (this.readElement()) {
                if (!this.beginLine()) {
                    console.log(`Error parsing with;\n${this.line1st}\n${this.line2nd}`);
                    continue;
                }
                o = new M3UObject();
                o.tvgName = this.name;
                o.urlTvg = this.line2nd;
                while (this.getToken()) {
                    const token: string = this.getKey();
                    switch (token) {
                        case "tvg-logo":
                            o.tvgLogo = this.getValue();
                            break;
                        case "group-title":
                            o.groupTitle = this.getValue();
                            break;
                    }
                }
                objects.push(o);
            }
            return objects;
        } catch (e)
        {
            console.log(`Parsing error : ${e}`);
        }
        return null;
    }
}
