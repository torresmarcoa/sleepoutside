import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { renderCartLength, loadHeaderFooter, getParams } from "./utils.mjs";

const category = getParams("category");
const dataSource = new ProductData(category);
const element = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, element);

const title = document.getElementById("category-title");
const renderTitle = () => {
  console.log("dataSource", listing);
  const categoryIs = listing.category.toUpperCase();
  title.innerHTML = `<h2>Top Products: ${categoryIs}</h2>`;
};
renderTitle();
listing.init();
loadHeaderFooter();
