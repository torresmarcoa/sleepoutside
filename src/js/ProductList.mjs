import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const {
    Id,
    Image,
    Name,
    Brand: { Name: BrandName },
    FinalPrice,
  } = product;
  return `<li class="product-card">
  <a href="product_pages/index.html?product=${Id}">
  <img
    src="${Image}"
    alt="Image of ${Name}"
  />
  <h3 class="card__brand">${BrandName}</h3>
  <h2 class="card__name">${Name}</h2>
  <p class="product-card__price">$${FinalPrice}</p></a>
</li>`;
}

export default class ProductListing {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }
  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
  filterList(list) {
    return list.splice(0, 4);
  }
  async init() {
    const list = this.filterList(await this.dataSource.getData());
    this.renderList(list);
  }
}
