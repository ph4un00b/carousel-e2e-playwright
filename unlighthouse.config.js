import { defineConfig } from "unlighthouse";

export default defineConfig({
  lighthouseOptions: {
    throttlingMethod: "simulate",
  },
  // site: "http://localhost:3000",
  site: "https://carousel-opal.vercel.app",
  urls: ["/static/", "/dynamic/"],
  scanner: {
    // exclude specific routes
    exclude: [
      "/.*?pdf",
      ".*/amp",
      "en-*",
    ],
    // run lighthouse for each URL 3 times
    samples: 1,
    // use desktop to scan
    device: "mobile",
    // enable the throttling mode
    throttle: true,
  },
  debug: true,
});
