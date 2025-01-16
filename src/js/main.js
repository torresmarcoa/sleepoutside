import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs";

const element = document.querySelector(".product-list");

const listing = new ProductListing("tents", ProductData, element);
listing.init();