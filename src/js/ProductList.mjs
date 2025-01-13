import { renderListWithTemplate } from "./utils.mjs";

const filterList = (list) => list.slice(0, 4);

function productCardTemplate({ Id, Image, Brand: { Name }, FinalPrice }) {
  return `<li class="product-card">
  <a href="product_pages/index.html?product=${Id}">
  <img
    src="${Image}"
    alt="Image of ${Name}"
  />
  <h3 class="card__brand">${Name}</h3>
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
  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }
  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      filterList(list),
    );
  }
}
