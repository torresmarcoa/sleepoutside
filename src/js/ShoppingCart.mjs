import {
  clearLocalStorage,
  getLocalStorage,
  renderCartLength,
  renderListWithTemplate,
  setLocalStorage
} from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
  <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">
    <button class="cart-card__button minusButton" data-removeId="${item.Id}" data-change="minus">
      <img src="/images/minus.svg" alt="Minus Icon" />
    </button>
       <span class="cart-cart-quantity__number">${item.Quantity}</span>
    <button class="cart-card__button addButton" data-removeId="${item.Id}" data-change="add">
      <img src="/images/add.svg" alt="Add Icon" />
    </button></p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="cart-card__delete removeButton" class="removeButton" data-removeId="${item.Id}">
    <img src="/images/delete.svg" alt="Delete Icon" />
  </button>
</li>`;
};

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  init() {
    this.renderCartContents();
    this.addListenerButton();
  }

  renderCartContents() {
    const cartItems = getLocalStorage("so-cart");
    const cartListHTML = document.querySelector(".product-list");
    if (cartItems === null) {
      cartListHTML.innerHTML = "";
    } else {
      renderListWithTemplate(cartItemTemplate, cartListHTML, cartItems);
      this.addListenerButton();
    }
    this.renderTotalCart(cartItems);
  }

  addListenerButton() {
    const listElements = document.getElementsByClassName("cart-card");
    for (const element of listElements) {
      const buttons = element.querySelectorAll("button");
      for (const button of buttons) {
        const productId = button.dataset.removeid;
        const changeType = button.dataset.change || null;
        const buttonType = button.classList;
        button.addEventListener("click", (event) => {
          event.stopImmediatePropagation();
          if (buttonType[1] === "minusButton") {
            this.changeCartItemQuantity(productId, changeType);
          } else if (buttonType[1] === "addButton") {
            this.changeCartItemQuantity(productId, changeType);
          } else if (buttonType[1] === "removeButton") {
            this.removeCartItem(productId);
          }
        });
      }
    }
  }

  changeCartItemQuantity(id, operation) {
    const cartItems = getLocalStorage("so-cart");
    const itemIndex = cartItems.findIndex((cartItem) => cartItem.Id === id);
    if (operation === "minus") {
      cartItems[itemIndex].Quantity -= 1;
      cartItems[itemIndex].Quantity === 0 && cartItems.splice(itemIndex, 1)
    } else if (operation === "add") {
      cartItems[itemIndex].Quantity += 1;
    }
    cartItems.length === 0
      ? localStorage.removeItem("so-cart")
      : setLocalStorage("so-cart", cartItems);
    this.renderCartContents();
    renderCartLength();
  }

  removeCartItem(id) {
    const cartItems = getLocalStorage("so-cart");
    const newCartItems = cartItems.filter((item) => item.Id !== id);
    newCartItems.length === 0
      ? clearLocalStorage("so-cart")
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
    const checkoutBtnHTML = document.querySelector(".checkout-btn");
    if (total === 0) {
      cartTotalHTML.innerHTML = "";
      cartTotalHTML.parentNode.classList.add("hide");
      checkoutBtnHTML.classList.add("hide");
    } else {
      cartTotalHTML.innerHTML = `Total: $${total.toFixed(2)}`;
      cartTotalHTML.parentNode.classList.remove("hide");
      checkoutBtnHTML.classList.remove("hide");
    }
  }
}

