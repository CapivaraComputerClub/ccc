import { Server } from "http";
import fs from "fs";
import path from "path";
import * as http from "http";

const viewsPath = path.join(process.cwd(), "src/views/");
const publicDir = path.join(process.cwd(), "public");

const routes = [
  { path: "/", template: "pages/index.html", useLayout: true },
  { path: "/about", template: "pages/about.html", useLayout: true },
  { path: "/code-of-conduct", template: "pages/code-of-conduct.html", useLayout: true },


];

const MIME_TYPES = {
  ".html": "text/html",
  ".htm": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
};

const originalEmit = http.Server.prototype.emit;

http.Server.prototype.emit = function (event, ...args) {
  if (event === "request") {
    const req = args[0];
    const res = args[1];

    try {
      const rawPath = decodeURIComponent((req.url || "").split("?")[0]);
      const safeRequested = path
        .normalize(rawPath)
        .replace(/^(\.\.[\/\\])+/, "");
      const filePath = path.join(publicDir, safeRequested);

      if (filePath.startsWith(publicDir)) {
        const stat = fs.existsSync(filePath) && fs.statSync(filePath);
        if (stat && stat.isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || "application/octet-stream";

          const stream = fs.createReadStream(filePath);
          res.writeHead(200, { "Content-Type": contentType });
          stream.pipe(res);

          stream.on("error", () => {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          });

          return true;
        }
      }
    } catch (err) {
      console.error("error serving static file:", err);
    }
  }

  return originalEmit.apply(this, [event, ...args]);
};

const server = new Server((req, res) => {
  const route = routes.find((r) => r.path === req.url);

  const serveHTML = (file, extendFrom = undefined) => {
    let extendedFile = null;
    if (extendFrom) {
      file = "layout.html";
      extendedFile = fs.readFileSync(path.join(viewsPath, extendFrom), "utf8");
    }

    const fullPath = path.join(viewsPath, file);

    fs.readFile(fullPath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Internal Server Error");
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data.replace("{{{body}}}", extendedFile || ""));
    });
  };

  if (route) {
    if (route.useLayout) {
      serveHTML("layout.html", route.template);
      return;
    }

    serveHTML(route.template);
  } else {
    serveHTML("404.html");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`running at http://0.0.0.0:${PORT}/`);
});
