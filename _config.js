import lume from "lume/mod.ts";
import imagick from "https://raw.githubusercontent.com/lumeland/experimental-plugins/main/imagick/imagick.ts";
import postcss from "lume/plugins/postcss.ts";
import parcelcss, { version } from "lume/plugins/parcel_css.ts";
import esbuild from "lume/plugins/esbuild.ts";

const nunjucks = {
  extensions: [".html"],
  includes: "views",
  options: {
    throwOnUndefined: true,
  },
};

const site = lume({}, { nunjucks });

site
  .ignore("e2e")
  .ignore("regression")
  .ignore("node_modules")
  .ignore("windi.config.js")
  .ignore("playwright-report")
  .ignore("playwright.config.js")
  .ignore("regression.config.js")
  .ignore("unlighthouse.config.js")
  .use(imagick())
  .use(postcss());

site.use(esbuild({
  extensions: [".js"],
}));

site.copy("dynamic/assets/models.json");
// site.copy("dynamic/controllers/dynamic.js");

site.use(parcelcss({
  extensions: [".css"],
  sourceMap: false,
  options: {
    minify: true,
    drafts: {
      nesting: true,
      customMedia: true,
    },
    targets: {
      android: version(98),
      chrome: version(98),
      edge: version(98),
      firefox: version(97),
      ios_saf: version(12),
      safari: version(15),
      opera: version(83),
      samsung: version(16),
    },
  },
}));

export default site;
