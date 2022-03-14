const shortcuts = require("./views/shortcuts.json");
const { defineConfig } = require("windicss/helpers");

module.exports = defineConfig({
  shortcuts,
  theme: {
    extend: {
      fontFamily: {
        sans: ["Karla", "sans-serif"]
      },
    },
  },
  extract: {
    include: ["index.html", "views/**"],
    exclude: ["node_modules", ".git"],
  },
});
