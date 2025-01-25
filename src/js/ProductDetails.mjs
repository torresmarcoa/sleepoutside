import {
  setLocalStorage,
  renderCartLength,
  getLocalStorage,
} from "./utils.mjs";

function productDetailsTemplate(product) {
  const percentageDiscount = (
    ((product.SuggestedRetailPrice - product.FinalPrice) /
      product.SuggestedRetailPrice) *
    100
  ).toFixed(2);
  return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.NameWithoutBrand}"
    />
  <p class="product-card__price">Original Price: <span class="original-price">$${product.SuggestedRetailPrice}</span></p>
<p class="product-card__price">Discounted Price: <span class="discounted-price">$${product.FinalPrice}</span> </p>
<p class="product-card__price">Discount: <span>${percentageDiscount}% off!!</span> </p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
 ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
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
    document.getElementById("addToCart").addEventListener("click", () => {
      this.addToCart();
      renderCartLength();
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
