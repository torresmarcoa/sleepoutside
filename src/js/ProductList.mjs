import { renderListWithTemplate } from "./utils.mjs";

function listElements(values) {
    const excludedIds = ["989CG", "880RT"];
    const filteredValues = values.filter(value => !excludedIds.includes(value.Id));

    return filteredValues.map((value) =>`
          <li class="product-card">
            <a href="product_pages/?product=${value.Id}">
              <img src="${value.Image}" alt="${value.NameWithoutBrand}" />
              <h3 class="card__brand">${value.Brand.Name}</h3>
              <h2 class="card__name">${value.Name}</h2>
              <p class="product-card__price">$${value.FinalPrice}</p>
            </a>
          </li>
        `).join("");
}
  
export default class ProductListing {
    constructor(category, dataSource, listElement) {
      this.category = category;
      this.dataSource = dataSource;
      this.listElement = listElement;
      this.list = {};
    }
  
    async init() {
        this.list = await this.dataSource.getData();
        this.renderProductList(this.listElement);
    }
  
    renderProductList(parentElement) {
      renderListWithTemplate(listElements, parentElement, this.list);
    }
  }
  