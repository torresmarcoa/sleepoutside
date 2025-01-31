import {   getLocalStorage,
    renderCartLength,
    renderListWithTemplate,
    setLocalStorage,
    alertCart } from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
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
    <span class="cart-card__button minusButton" data-removeId="${item.Id}" data-change="minus">-</span>
      Quantity: ${item.Quantity}
    <span class="cart-card__button addButton" data-removeId="${item.Id}" data-change="add">+</span></p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <span class="cart-card__button removeButton" data-removeId="${item.Id}">X</span>
</li>`;
};

export default class ShoppingCart {
    constructor(key, parentSelector) {
      this.key = key;
      this.parentSelector = parentSelector;
    }

    init () {
        this.renderCartContents();
        this.addListenerButton();
    }

    renderCartContents() {
        const cartItems = getLocalStorage("so-cart");
        const cartListHTML = document.querySelector(".product-list");
        if (cartItems === null) {
          cartListHTML.innerHTML = "";
          renderCartLength();
        } else {
          renderListWithTemplate(cartItemTemplate, cartListHTML, cartItems);
          this.addListenerButton();
        }
        this.renderTotalCart(cartItems);
      }

    addListenerButton() {
      const listElements = document.getElementsByClassName("cart-card");
      for (const element of listElements) {
        const buttons = element.querySelectorAll("span");
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
            alertCart();
          });
        }
      }
    }

    changeCartItemQuantity(id, operation) {
      setTimeout(()=>{}, 1000);
      const cartItems = getLocalStorage("so-cart");
      const itemIndex = cartItems.findIndex((cartItem) => cartItem.Id === id);
      if (operation === "minus" && cartItems[itemIndex].Quantity > 1) {
        cartItems[itemIndex].Quantity -= 1;
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

