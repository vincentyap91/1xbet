const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4173);
const CAP =
  '<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>';

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
};

const server = http.createServer((req, res) => {
  try {
    let u = decodeURIComponent((req.url || "/").split("?")[0].split("#")[0]);
    if (u.endsWith("/")) u += "index.html";
    const fp = path.normalize(path.join(root, u));
    if (!fp.startsWith(root)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    fs.readFile(fp, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("Not found " + u);
      }
      const ext = path.extname(fp).toLowerCase();
      let body = data;
      const type = mime[ext] || "application/octet-stream";
      if (ext === ".html") {
        let html = data.toString("utf8");
        if (!html.includes("html-to-design/capture.js")) {
          if (html.includes("</head>")) {
            html = html.replace("</head>", CAP + "</head>");
          } else {
            html = CAP + html;
          }
        }
        body = Buffer.from(html, "utf8");
      }
      res.writeHead(200, {
        "Content-Type": type,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      });
      res.end(body);
    });
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log("Serving+capture http://127.0.0.1:" + port);
});
