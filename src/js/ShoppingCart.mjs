import {
  getLocalStorage,
  renderCartLength,
  renderListWithTemplate,
  setLocalStorage,
} from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">Quantity: ${item.Quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <span class="cart-card__removeButton" data-removeId="${item.Id}">X</span>
</li>`;
}

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  init() {
    this.renderCartContents();
    this.addListenerRemoveButton();
  }

  renderCartContents() {
    const cartItems = getLocalStorage("so-cart");
    const cartListHTML = document.querySelector(".product-list");
    if (cartItems === null) {
      cartListHTML.innerHTML = "";
      renderCartLength();
    } else {
      renderListWithTemplate(cartItemTemplate, cartListHTML, cartItems);
      this.addListenerRemoveButton();
    }
    this.renderTotalCart(cartItems);
  }

  addListenerRemoveButton() {
    const listElements = document.getElementsByClassName("cart-card");
    for (const element of listElements) {
      const removeButtonHTML = element.children[5];
      removeButtonHTML.addEventListener("click", () => {
        const productId = removeButtonHTML.dataset.removeid;
        this.removeCartItem(productId);
      });
    }
  }

  removeCartItem(id) {
    const cartItems = getLocalStorage("so-cart");
    const newCartItems = cartItems.filter((item) => item.Id !== id);
    newCartItems.length === 0
      ? localStorage.removeItem("so-cart")
      : setLocalStorage("so-cart", newCartItems);
    this.renderCartContents();
    renderCartLength();
  }

  renderTotalCart(cartItems) {
    const total =
      cartItems?.reduce(
        (totalCart, currentItem) =>
          totalCart + currentItem.FinalPrice * currentItem.Quantity,
        0,
      ) ?? 0;
    const cartTotalHTML = document.querySelector(".cart-total");
    if (total === 0) {
      cartTotalHTML.innerHTML = "";
      cartTotalHTML.parentNode.classList.add("hide");
    } else {
      cartTotalHTML.innerHTML = `Total: $${total.toFixed(2)}`;
      cartTotalHTML.parentNode.classList.remove("hide");
    }
  }
}
