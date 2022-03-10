// import products from "../assets/models.json" assert { type: "json" };
import { createApp } from "https://unpkg.com/petite-vue?module";
const resp = await fetch("./assets/models.json")
if (!resp.ok) throw new Error("json not loaded");

const products = await resp.json()
function CarouselController() {
  return {
    products,
    total_items: products.length,
    current_item: 0,
    get current_product() {
      return this.products[this.display_item];
    },
    get display_item() {
      if (this.current_item > 0) {
        return this.current_item % this.total_items;
      } else {
        return (this.current_item % this.total_items) * -1;
      }
    },
  };
}

createApp({ CarouselController, $delimiters: ["${", "}"] }).mount("#carousel");