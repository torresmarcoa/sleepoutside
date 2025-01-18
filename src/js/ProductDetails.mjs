import { setLocalStorage, counterItems } from "./utils.mjs";

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

function counterCart(){
  const items = counterItems("so-cart");
  if (items > 0) {
    document.querySelector("#counter-cart").innerText = items;
  }
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = [];
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails("main");
    document
    .getElementById("addToCart")
    .addEventListener("click", () => {
      this.addToCart();
      counterCart();
    });
  }

  addToCart() {
    setLocalStorage("so-cart", this.product);
  }
  
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      "afterBegin",
      productDetailsTemplate(this.product),
    );
  }
  
}

counterCart();
