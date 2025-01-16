import { counterItems } from "./utils.mjs";

function counterCart(){
    const items = counterItems("so-cart");
    if (items > 0) {
      document.querySelector("#counter-cart").innerText = items;
    }
}

counterCart();