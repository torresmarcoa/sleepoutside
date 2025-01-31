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
    <button class="view-details" data-id="${product.Id}">View Details</button>
  </li>`;
}

export default class ProductListing {
  constructor(category, dataSource, listElement) {
    this.dataSource = dataSource;
    this.category = category;
    this.listElement = listElement;
    this.sortOption = "name";
  }

  sortList = (list) => this.sortOption === "name" ? list.sort((a, b) => a.Name.localeCompare(b.Name)) : list.sort((a, b) => a.FinalPrice - b.FinalPrice);

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
    document.querySelectorAll(".view-details").forEach(button => {
      button.addEventListener("click", async (event) => {
        const productId = event.target.dataset.id;
        const product = list.find(p => p.Id == productId);
        this.showModal(product)
      })
    })
  }

  showModal(product) {
    document.getElementById("modal-image").src = product.Images.PrimaryMedium;
    document.getElementById("modal-image").alt = `Image of ${product.Name}`;
    document.getElementById("modal-brand").textContent = product.Brand.Name;
    document.getElementById("modal-name").textContent = product.Name;
    document.getElementById("modal-price").textContent = `$${product.FinalPrice}`;
    document.getElementById("modal-description").innerHTML = product.DescriptionHtmlSimple || "No description available";
    document.getElementById("product-modal").style.display = "block";
    document.querySelector(".close").addEventListener("click", () => document.getElementById("product-modal").style.display = "none"});
  
    window.addEventListener("click", (event) => {
      if (event.target === document.getElementById("product-modal")) {
        document.getElementById("product-modal").style.display = "none";
      }
    });
  }
}
