import lume from "lume/mod.ts";

const nunjucks = {
  extensions: [".html"],
  includes: "views",
  options: {
    throwOnUndefined: true,
  },
};

const site = lume({}, { nunjucks });

site.copy("main.js");
site.copy("styles.css");

export default site;
