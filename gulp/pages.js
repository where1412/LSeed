const fs = require('fs');
const srcDir = require('./conf.js').sourceDir
const path = require('path')
const ROOT = path.resolve(__dirname, '../' + srcDir)

var pages = []
pages = fs.readdirSync(ROOT + '/page')

module.exports = pages
