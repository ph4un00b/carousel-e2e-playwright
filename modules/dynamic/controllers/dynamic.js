// import products from "../assets/models.json" assert { type: "json" };
// import { createApp } from "https://unpkg.com/petite-vue?module";
import { createApp } from "../../petite-vue.js";

fetch("./assets/models.json")
  .then((resp) => resp.json())
  .then((products) => {
    function CarouselController() {
      return {
        products,
        current_item: 0,
        total_items: products.length,
        get current_product() {
          return this.products[this.index];
        },
        get webp() {
          return Modernizr?.webp;
        },
        get url_image() {
          const product = this.current_product;
          return `url(${(this.webp ? product.image_webp : product.image_jpg)})`;
        },
        get index() {
          return Math.abs(this.current_item % this.total_items);
        },
      };
    }

    createApp({ CarouselController, $delimiters: ["${", "}"] }).mount(
      "#carousel",
    );
  })
  .catch(console.error);
