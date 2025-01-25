import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
    <img
      src="${product.Images.PrimaryMedium}"
      alt="Image of ${product.Name}"
    />
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 class="card__name">${product.Name}</h2>
    <p class="product-card__price">$${product.FinalPrice}</p></a>
  </li>`;
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
      return list.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (this.sortOption === "price") {
      return list.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }
    return list;
  }


  async init() {
    const list = await this.dataSource.getData(this.category);
  
    this.renderList(list);
    document.getElementById("sort-option").addEventListener("change", (e) => {
      this.sortOption = e.target.value; 
      const sortedList = this.sortList([...list]); 
      this.renderList(sortedList);
    });

    document.querySelector(".title").innerHTML = this.category;
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
