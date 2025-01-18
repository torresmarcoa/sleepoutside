import { getLocalStorage, counterItems } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  renderTotalCart(cartItems);
  if (cartItems.length > 0) addRemoveButton();
}

function addRemoveButton() {
  const listElements = document.getElementsByClassName("cart-card");
  for (const element of listElements) {
    element.children[5].addEventListener("click", () => {removeCartItem(element.children[5])});
  }
}

function removeCartItem(element) {
  const cartItems = getLocalStorage("so-cart");
  const dataId = element.getAttribute("data-id");
  const newCartItems = cartItems.filter((item) => item.Id !== dataId);
  localStorage.setItem("so-cart", JSON.stringify(newCartItems));
  renderCartContents();
  counterCart();
}

function renderTotalCart(cartItems) {
  if (cartItems.length > 0) {
    const total = cartItems.reduce(
      (totalCart, currentItem) =>
        totalCart + currentItem.FinalPrice * currentItem.quantity,
      0,
    );
    const cartTotalHTML = document.querySelector(".cart-total");
    cartTotalHTML.textContent += total.toFixed(2);
    cartTotalHTML.parentNode.style.display = "unset";
  }
}

function counterCart() {
  const items = counterItems("so-cart");
  if (items > 0) {
    document.querySelector("#counter-cart").innerText = items;
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
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
  <p class="cart-card__quantity">qty: ${item.quantity}</p>
  <p class="cart-card__price">$${(item.FinalPrice * item.quantity).toFixed(2)}</p>
  <span data-id="${item.Id}">X</span>
</li>`;

  return newItem;
}

renderCartContents();
counterCart();
