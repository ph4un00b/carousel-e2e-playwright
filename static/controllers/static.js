import { createApp } from "https://unpkg.com/petite-vue?module";

function CarouselController() {
  return {
    total_items: 0,
    current_item: 0,
    get display_item() {
      if (this.current_item > 0) {
        return this.current_item % this.total_items;
      } else {
        return (this.current_item % this.total_items) * -1;
      }
    },
  };
}

createApp({ CarouselController }).mount("#carousel");
