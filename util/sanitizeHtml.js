// Custom HTML sanitiser
const sanitizeHtml = require("sanitize-html");
const custom = input => sanitizeHtml(input, { allowedTags: [], allowedAttributes: {}});

// Export
module.exports = custom;