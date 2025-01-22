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
            <a href="product_pages/?product=${Id}">
                <img src="${Image}"
                alt="${NameWithoutBrand}" />
                <h3 class="card__brand">${Name}</h3>
                <h2 class="card__name">${NameWithoutBrand}</h2>
                <p class="product-card__price">$${FinalPrice}</p>
            </a>
            </li>
    `;
}

export default class ProductListing {
  constructor(category, dataSource, listElement) {
    this.dataSource = dataSource;
    this.category = category;
    this.listElement = listElement;
    this.sortOption = "name";
  }

  sortList(list) {
    if (this.sortOption === "name") {
      return list.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
    } else if (this.sortOption === "price") {
      return list.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }
    return list;
  }

  filterList(list) {
    const tentsID = ["880RR", "985RF", "985PR", "344YJ"];
    return list.filter((product) => tentsID.includes(product.Id));
  }

  async init() {
    const list = await this.dataSource.getData();

    const filteredList = this.filterList(list);
    this.renderList(filteredList);

    document.getElementById("sort-option").addEventListener("change", (e) => {
      this.sortOption = e.target.value; 
      const sortedList = this.sortList([...filteredList]); 
      this.renderList(sortedList);
    });
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
