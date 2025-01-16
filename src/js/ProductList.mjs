import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const {
    Brand: { Name },
    NameWithoutBrand,
    Image,
    FinalPrice,
    Id,
  } = product;
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${Id}">
      <img src="${Image}" alt="Image of ${NameWithoutBrand}">
      <h3 class="card__brand">${Name}</h3>
      <h2 class="card__name">${NameWithoutBrand}</h2>
      <p class="product-card__price">${FinalPrice}</p>
    </a>
    </li>`
}

export default class ProductListing {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = new dataSource(this.category);
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    const filteredList = this.filterList(list);
    this.renderList(filteredList);
  }

  filterList(list) {
    const newList = list.filter((product) => product.Id !== "989CG" && product.Id !== "880RT");
    return newList;
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}