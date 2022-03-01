import lume from "https:/deno.land/x/lume@v1.5.1/mod.ts";

const nunjucks = {
  extensions: [".html"],
  includes: "views",
  options: {
    throwOnUndefined: true,
  },
};

const site = lume({}, { nunjucks });

site.copy("index.html");
site.copy("main.js");
site.copy("styles.css");

export default site;
