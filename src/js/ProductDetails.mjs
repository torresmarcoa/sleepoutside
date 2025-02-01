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
    <div class="product__colors"></div>
    <p class="product__description">
    ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" class="button" data-id="${product.Id}">Add to Cart</button>
    </div>
  </section>`;
}

function colorSwatchesTemplate(product) {
  let colors = ``;

  for (const color of product.Colors) {
    colors += `<div class="color-swatch" id="${color.ColorCode}"><img src="${color.ColorChipImageSrc}" alt="${color.ColorName}"/></div>`;
  }
  colors += `<p class="color-text">${product.Colors[0].ColorName}</p><div class="color-prev"><img src="${product.Colors[0].ColorPreviewImageSrc}"/></div>`;
  return colors;
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
    this.addClickEventListener(addCartButton, this.addToCart, renderCartLength);
    if (this.product.Colors.length > 1) {
      this.renderColorSwatchs(".product__colors");
      const colorSwatchElements = document.querySelectorAll(".color-swatch");
      colorSwatchElements.forEach(element => {
        this.addClickEventListener(element, this.renderSelectedColor, undefined, element.id);
      });
      colorSwatchElements[0].classList.add("active");
    } else {
      document.querySelector(".product__colors").textContent = this.product.Colors[0].ColorName;
    }
    this.setupCarousel();
  }

  addClickEventListener(element, fn, callback, extraData) {
    element.addEventListener("click", () => {
      fn(this.product, extraData);
      if (callback) {
        callback();
        element.innerHTML = `Product added &#10003`;
        alertCart();
        setTimeout(() => (element.innerHTML = `Add to Cart`), 1000);
      }
    });
  }

  addToCart(product) {
    const cartItems = getLocalStorage("so-cart") || [];
    const selectedColorCode = document.querySelector(".active").id;
    if (cartItems.length === 0) {
      cartItems.push({ ...product, Quantity: 1, SelectedColorCode: selectedColorCode });
    } else {
      const itemIndex = cartItems.findIndex(
        (cartItem) => cartItem.Id === product.Id,
      );
      if (itemIndex !== -1) {
        cartItems[itemIndex].Quantity += 1;
      } else {
        cartItems.push({ ...product, Quantity: 1, SelectedColorCode: selectedColorCode });
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

  renderColorSwatchs(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      "afterBegin",
      colorSwatchesTemplate(this.product),
    );
  }

  renderSelectedColor(product, id) {
    document.querySelectorAll(".color-swatch").forEach((element) => {
      if (element.id === id) {
        element.classList.add("active");
      } else {
        element.classList.remove("active");
      }
    });
    document.querySelector(".color-text").textContent = product.Colors.find(Color => Color.ColorCode === id).ColorName;
    document.querySelector(".color-prev").querySelector("img").src = product.Colors.find(Color => Color.ColorCode === id).ColorPreviewImageSrc;
  }
}
