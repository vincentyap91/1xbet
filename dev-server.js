/**
 * Local static server + reverse proxy for 1xBet Statistics iframe.
 * Proxies missing paths to https://1xlite-493593.pro and strips
 * X-Frame-Options / CSP frame-ancestors so /en/statisticpopup/... can embed.
 *
 *   node dev-server.js
 *   http://127.0.0.1:4173/mobile/event.html?view=stats
 */
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const UPSTREAM = process.env.XBET_UPSTREAM || "https://1xlite-493593.pro";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
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
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
};

function stripFrameGuards(headers) {
  const out = {};
  Object.keys(headers || {}).forEach(function (key) {
    const lk = key.toLowerCase();
    if (lk === "x-frame-options") return;
    if (lk === "content-security-policy" || lk === "content-security-policy-report-only") {
      const cleaned = String(headers[key])
        .split(";")
        .map(function (p) {
          return p.trim();
        })
        .filter(function (p) {
          return p && !/^frame-ancestors\b/i.test(p);
        })
        .join("; ");
      if (cleaned) out[key] = cleaned;
      return;
    }
    if (lk === "content-encoding" || lk === "content-length" || lk === "transfer-encoding") return;
    out[key] = headers[key];
  });
  return out;
}

function proxyRequest(req, res) {
  const target = new URL(req.url || "/", UPSTREAM);
  const lib = target.protocol === "http:" ? http : https;
  const headers = Object.assign({}, req.headers, {
    host: target.host,
    origin: UPSTREAM,
    referer: UPSTREAM + "/",
  });
  delete headers["accept-encoding"];

  const upstreamReq = lib.request(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (target.protocol === "http:" ? 80 : 443),
      path: target.pathname + target.search,
      method: req.method,
      headers: headers,
    },
    function (upstreamRes) {
      const outHeaders = stripFrameGuards(upstreamRes.headers);
      outHeaders["access-control-allow-origin"] = "*";
      res.writeHead(upstreamRes.statusCode || 502, outHeaders);
      upstreamRes.pipe(res);
    }
  );

  upstreamReq.on("error", function (err) {
    res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Upstream error: " + err.message);
  });

  req.pipe(upstreamReq);
}

function tryLocalFile(urlPath) {
  let u = decodeURIComponent((urlPath || "/").split("?")[0].split("#")[0]);
  if (u === "/") u = "/index.html";
  if (u.endsWith("/")) u += "index.html";
  const fp = path.normalize(path.join(root, u));
  if (!fp.startsWith(root)) return null;
  try {
    if (fs.existsSync(fp) && fs.statSync(fp).isFile()) return fp;
  } catch (e) {
    return null;
  }
  return null;
}

const server = http.createServer(function (req, res) {
  try {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": req.headers["access-control-request-headers"] || "*",
      });
      return res.end();
    }

    const urlPath = (req.url || "/").split("?")[0];
    const local = tryLocalFile(urlPath);

    if (local) {
      const ext = path.extname(local).toLowerCase();
      const type = mime[ext] || "application/octet-stream";
      const data = fs.readFileSync(local);
      res.writeHead(200, {
        "Content-Type": type,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      });
      return res.end(data);
    }

    return proxyRequest(req, res);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(String(e && e.stack ? e.stack : e));
  }
});

server.listen(port, "127.0.0.1", function () {
  console.log("1xBet demo server http://127.0.0.1:" + port);
  console.log("Event + Statistics: http://127.0.0.1:" + port + "/mobile/event.html?view=stats");
  console.log("Upstream proxy: " + UPSTREAM);
});
