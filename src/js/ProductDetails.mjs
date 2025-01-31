import {
  setLocalStorage,
  renderCartLength,
  getLocalStorage,
  calculateDiscount,
  alertCart
} from "./utils.mjs";

function productDetailsTemplate(product) {
  let discount = calculateDiscount(product.SuggestedRetailPrice, product.FinalPrice);
  return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
  <h2 class="divider">${product.NameWithoutBrand}</h2>
  <div>
    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.NameWithoutBrand}"
    />
    <div class="discount"><span>-${discount}%</span></div>
  </div>
  <p class="product-card__price">$${product.FinalPrice}</p>
  <p class="product__color">${product.Colors[0].ColorName}</p>
  <p class="product__description">
  ${product.DescriptionHtmlSimple}
  </p>
  <div class="product-detail__add">
    <button id="addToCart" class="button" data-id="${product.Id}">Add to Cart</button>
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
    const addCartButton = document.querySelector("#addToCart");
    addCartButton.addEventListener("click", () => {
      this.addToCart();
      renderCartLength();
      addCartButton.innerHTML = `Product added &#10003`;
      alertCart();
      setTimeout(() => addCartButton.innerHTML = `Add to Cart`, 1000);
    });
  }

  addToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    if (cartItems.length === 0) {
      cartItems.push({ ...this.product, Quantity: 1 });
    } else {
      const itemIndex = cartItems.findIndex(
        (cartItem) => cartItem.Id === this.product.Id,
      );
      if (itemIndex !== -1) {
        cartItems[itemIndex].Quantity += 1;
      } else {
        cartItems.push({ ...this.product, Quantity: 1 });
      }
    }
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      "afterBegin",
      productDetailsTemplate(this.product),
    );
  }
}
