import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img
        class="product-card__image"
        src="${product.Images.PrimaryMedium}"
        alt="Image of ${product.Name}"
      />
      <h3 class="product-card__brand">${product.Brand.Name}</h3>
      <h2 class="product-card__name">${product.Name}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
    <button class="product-card__view-details button" data-id="${product.Id}">View Details</button>
  </li>`;
}

function renderProductDetails(product) {
  return `<div id="product-modal" class="product-modal">
      <div class="product-modal__content">
        <p class="product-modal__close">X</p>
        <img id="product-modal__image" src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}" />
        <h3 id="product-modal__brand">${product.Brand.Name}</h3>
        <h2 id="product-modal__name">${product.Name}</h2>
        <p id="product-modal__price">$${product.FinalPrice}</p>
        <p id="product-modal__description">${product.DescriptionHtmlSimple || "No description available"}</p>
        <a class="button product-modal__buyBtn" href="/product_pages/index.html?product=${product.Id}">Buy Product</a>
      </div>
    </div>`
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
    document.querySelectorAll(".product-card__view-details").forEach(button => {
      button.addEventListener("click", event => {
        const productId = event.target.dataset.id;
        const product = list.find(product => product.Id == productId);
        this.viewDetails(product)
      })
    })
  }

  viewDetails(product) {
    document.body.insertAdjacentHTML("beforebegin", renderProductDetails(product));
    document.addEventListener("click", e => {
      if (e.target.classList.contains("product-modal__close") || e.target.classList.contains("product-modal")) {
        e.stopImmediatePropagation();
        document.getElementById("product-modal").remove();
      }
    });
  }
}