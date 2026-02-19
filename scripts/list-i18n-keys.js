/**
 * Lists all translation keys from messages/en.json (dot notation).
 * Usage: node scripts/list-i18n-keys.js
 * Use for: diff with other locales, export to CAT tools, or verify key existence.
 */

const fs = require("fs");
const path = require("path");

const enPath = path.join(__dirname, "..", "messages", "en.json");
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

function collectKeys(obj, prefix = "") {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      keys.push(full);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...collectKeys(value, full));
    }
  }
  return keys.sort();
}

const keys = collectKeys(en);
keys.forEach((k) => console.log(k));
