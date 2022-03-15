// import products from "../assets/models.json" assert { type: "json" };
// import { createApp } from "https://unpkg.com/petite-vue?module";
import { createApp } from "../../petite-vue.js";

function CarouselController() {
  return {
    $template: "#carousel-template",
    products: [],
    current_item: 0,
    async fetch_models(models) {
      const resp = await fetch(models);
      if (!resp.ok) throw new Error("No json file: " + models);
      this.products = await resp.json();
    },
    get total_items() {
      return this.products.length;
    },
    get current_product() {
      return this.products[this.index];
    },
    get webp() {
      return Modernizr?.webp;
    },
    get url_image() {
      const product = this.current_product;
      if (!product) return;
      return `url(${(this.webp ? product.image_webp : product.image_jpg)})`;
    },
    get index() {
      return Math.abs(this.current_item % this.total_items);
    },
  };
}

createApp({ CarouselController, $delimiters: ["${", "}"] }).mount();
