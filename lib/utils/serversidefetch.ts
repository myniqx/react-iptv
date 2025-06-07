import { IncomingMessage, ServerResponse } from 'http';

export default async function serversidefech(
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void
): Promise<void> {
    let url = req.url as string;

    if (!url) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid Url');
        return;
    }

    try {
        url = decodeURIComponent(url.substring(1));
        console.log("check-m3u url: ", url);
        let body = '';
        await (async () => {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch(url);
            body = await response.text();
        })();

        if (body.startsWith('#EXTM3U')) {
            res.writeHead(200, { 'Content-Type': 'application/vnd.apple.mpegurl' });
            res.end(body);
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Url is not a M3U file');
        }
    } catch (error) {
        console.log("check-m3u failed: ", error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('An error occurred');
    }
}
