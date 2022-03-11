const shortcuts = require("./views/shortcuts.json");
module.exports = {
  shortcuts,
  extract: {
    include: ["index.html", "views/**"],
    exclude: ["node_modules", ".git"],
  },
};