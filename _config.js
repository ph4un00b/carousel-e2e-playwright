import lume from "lume/mod.ts";
import imagick from "https://raw.githubusercontent.com/lumeland/experimental-plugins/main/imagick/imagick.ts";

const nunjucks = {
  extensions: [".html"],
  includes: "views",
  options: {
    throwOnUndefined: true,
  },
};

const site = lume({}, { nunjucks });

site
  .ignore("playwright-report")
  .ignore("regression")
  .use(imagick())

site.copy("main.js");
site.copy("styles.css");
site.copy("static/controllers");
site.copy("static/assets");
site.copy("dynamic/controllers");
site.copy("dynamic/assets");
export default site;
