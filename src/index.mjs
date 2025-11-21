import {Server} from "http";
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import * as http from 'http';

const viewsPath = 'src/views/';
const publicDir = path.join(process.cwd(), 'public');
const routes =  [
    {'path': '/', 'template': 'index.ejs'},

]
const MIME_TYPES = {
    '.html': 'text/html',
    '.htm': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
};

const originalEmit = http.Server.prototype.emit;

http.Server.prototype.emit = function (event, ...args) {
    if (event === 'request') {
        const req = args[0];
        const res = args[1];

        try {
            const rawPath = decodeURIComponent((req.url || '').split('?')[0]);
            const safeRequested = path.normalize(rawPath).replace(/^(\.\.[\/\\])+/, '');
            const filePath = path.join(publicDir, safeRequested);

            if (filePath.startsWith(publicDir)) {
                const stat = fs.existsSync(filePath) && fs.statSync(filePath);
                if (stat && stat.isFile()) {
                    const ext = path.extname(filePath).toLowerCase();
                    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
                    const stream = fs.createReadStream(filePath);
                    res.writeHead(200, { 'Content-Type': contentType });
                    stream.pipe(res);
                    stream.on('error', () => {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    });
                    return true; 
                }
            }
        } catch (err) {
            console.error('error serving static file:', err);}
    }

    return originalEmit.apply(this, [event, ...args]);
};

const server = new Server((req, res) => {

    const route = routes.find(r => r.path === req.url);
    if (route) {
        ejs.renderFile(`${viewsPath}${route.template}`, {}, (err, str) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(str);
            }
        });
    } else {
        ejs.renderFile(`${viewsPath}404.ejs`, {}, (err, str) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end(str);
            }
        });
    }
    
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});