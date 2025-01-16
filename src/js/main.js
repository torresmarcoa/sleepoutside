import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs";

const dataSource = new ProductData("tents");

const listItem = new ProductListing("tents", dataSource, "product-list");
listItem.init();