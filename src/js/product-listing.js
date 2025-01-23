import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs";
import { getParams, qs } from "./utils.mjs";

const category = getParams("category");
const dataSource = new ProductData();
const parentElement = qs(".product-list");

const renderContent = new ProductListing(category, dataSource, parentElement);
renderContent.init();
