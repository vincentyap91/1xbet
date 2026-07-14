const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const snippet = fs.readFileSync(path.join(__dirname, "header-lang-snippet.html"), "utf8").trim();
const re =
  /<div class="header-meta-group">\s*(?:<div class="header-lang" id="header-lang">[\s\S]*?<\/div>|<a[^>]*class="header-meta header-lang-btn"[\s\S]*?<\/a>)\s*<\/div>/g;

let count = 0;
for (const file of fs.readdirSync(root)) {
  if (!file.endsWith(".html")) continue;
  const filePath = path.join(root, file);
  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes("header-meta-group")) continue;
  const next = content.replace(re, snippet);
  if (next !== content) {
    fs.writeFileSync(filePath, next);
    count += 1;
  }
}

console.log("updated " + count + " files");
