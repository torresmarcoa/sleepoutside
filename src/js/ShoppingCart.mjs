import {
  getLocalStorage,
  renderCartLength,
  setLocalStorage,
} from "./utils.mjs";

function cartItemTemplate(item) {
  const {
    Id,
    Name,
    Images: { PrimarySmall },
    Colors: [{ ColorName }],
    Quantity,
    FinalPrice,
  } = item;
  return `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${PrimarySmall}"
      alt="${Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${Name}</h2>
  </a>
  <p class="cart-card__color">${ColorName}</p>
  <p class="cart-card__quantity">Quantity: ${Quantity}</p>
  <p class="cart-card__price">$${FinalPrice}</p>
  <span class="cart-card__removeButton" data-removeId="${Id}">X</span>
</li>`;
}

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  renderCartContents() {
    const cartItems = getLocalStorage(this.key);
    if (cartItems === null) {
      document.querySelector(this.parentSelector).innerHTML = "";
    } else {
      const htmlItems = cartItems.map(cartItemTemplate);
      document.querySelector(this.parentSelector).innerHTML =
        htmlItems.join("");
      this.addListenerRemoveButton();
    }
    this.renderTotalCart(cartItems);
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

  removeCartItem(id) {
    const cartItems = getLocalStorage("so-cart");
    const newCartItems = cartItems.filter((item) => item.Id !== id);
    newCartItems.length === 0
      ? localStorage.removeItem("so-cart")
      : setLocalStorage("so-cart", newCartItems);
    this.renderCartContents();
    renderCartLength();
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
}
