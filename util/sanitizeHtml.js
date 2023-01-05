const sanitizeHtml = require("sanitize-html");
const custom = input => sanitizeHtml(input, { allowedTags: [], allowedAttributes: {}});

module.exports = custom;