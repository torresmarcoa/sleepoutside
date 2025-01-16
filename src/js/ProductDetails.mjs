import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
  const {
    Brand: { Name },
    NameWithoutBrand,
    Image,
    FinalPrice,
    Colors: [{ ColorName }],
    DescriptionHtmlSimple,
    Id,
  } = product;
  return `<section class="product-detail"> <h3>${Name}</h3>
    <h2 class="divider">${NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${Image}"
      alt="${NameWithoutBrand}"
    />
    <p class="product-card__price">$${FinalPrice}</p>
    <p class="product__color">${ColorName}</p>
    <p class="product__description">
    ${DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${Id}">Add to Cart</button>
    </div></section>`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails("main");
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }
  addToCart() {
    const cart = getLocalStorage("so-cart");
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
  }
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      "afterBegin",
      productDetailsTemplate(this.product),
    );
  }
}