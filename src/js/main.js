import { counterItems } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

function counterCart(){
    const items = counterItems("so-cart");
    if (items > 0) {
      document.querySelector("#counter-cart").innerText = items;
    }
}

counterCart();

const dataSource = new ProductData("tents")
const element = document.querySelector(".product-list");
const listing = new ProductList("Tents", dataSource, element);
listing.init();
