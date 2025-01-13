import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs";

const productData = new ProductData("tents");
const productListHTML = document.querySelector(".product-list");
const productListing = new ProductListing(
  "tents",
  productData,
  productListHTML,
);

productListing.init();
