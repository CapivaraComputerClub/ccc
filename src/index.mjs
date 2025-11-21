import {Server} from "http";
import ejs from 'ejs';

const viewsPath = 'src/views/';
const routes =  [
    {'path': '/', 'template': 'index.ejs'},

]

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