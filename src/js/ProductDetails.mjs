import {
  setLocalStorage,
  renderCartLength,
  getLocalStorage,
  calculateDiscount,
  alertCart,
} from "./utils.mjs";

function productDetailsTemplate(product) {
  let discount = calculateDiscount(product.SuggestedRetailPrice, product.FinalPrice);
  return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <div class="product-detail__images">
      <img
        class="divider"
        src="${product.Images.PrimaryLarge}"
        alt="${product.NameWithoutBrand}"
      />
      <span class="product-detail__discount">-${discount}%</span>
    </div>
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
    ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" class="button" data-id="${product.Id}">Add to Cart</button>
    </div>
  </section>`;
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
      setTimeout(() => (addCartButton.innerHTML = `Add to Cart`), 1000);
    });
    this.setupCarousel();
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

  setupCarousel() {
    const track = document.querySelector(".carousel-track");
    const items = document.querySelectorAll(".carousel-item");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    if (!track || items.length === 0 || !prevButton || !nextButton) return;

    let currentIndex = 0;

    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevButton.addEventListener("click", () => {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      updateCarousel();
    });

    nextButton.addEventListener("click", () => {
      currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      updateCarousel();
    });
  }
}
