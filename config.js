const toml = require('toml');
const fs = require('fs');
const path = require('path');

const config = toml.parse(fs.readFileSync(path.join(__dirname, 'config.toml'), 'utf-8'));
config.sources = new Set(config.sources);

module.exports = config;