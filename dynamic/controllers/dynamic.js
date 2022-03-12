// import products from "../assets/models.json" assert { type: "json" };
// import { createApp } from "https://unpkg.com/petite-vue?module";
import { createApp } from "./petite-vue.es.js";
const resp = await fetch("./assets/models.json");
if (!resp.ok) throw new Error("json not loaded");

const products = await resp.json();
function CarouselController() {
  return {
    products,
    total_items: products.length,
    current_item: 0,
    get current_product() {
      return this.products[this.index];
    },
    get index() {
      return Math.abs(this.current_item % this.total_items);
    },
  };
}

createApp({ CarouselController, $delimiters: ["${", "}"] }).mount("#carousel");
