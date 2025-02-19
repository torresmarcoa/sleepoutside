// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function clearLocalStorage(key) {
  localStorage.removeItem(key);
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParams(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = true,
) {
  const elements = list.map(templateFn);
  if (clear) parentElement.innerHTML = "";
  parentElement.insertAdjacentHTML(position, elements.join(""));
}

export function renderWithTemplate(
  templateFn,
  parentElement,
  callback,
) {
  parentElement.insertAdjacentHTML("afterbegin", templateFn);
  if (callback) {
    callback()
  }
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const headerElement = document.getElementById("header");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  const footerElement = document.getElementById("footer");

  renderWithTemplate(headerTemplate, headerElement, renderCartLength);
  renderWithTemplate(footerTemplate, footerElement);
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  return await response.text();
}

export const counterCartLength = (cartItems) =>
  cartItems?.reduce(
    (cartLength, currentItem) => cartLength + currentItem.Quantity,
    0,
  ) ?? 0;

export const renderCartLength = () => {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartLength = counterCartLength(cartItems);
  const counterCartHTML = document.querySelector("#counter-cart");
  if (cartLength > 0) {
    counterCartHTML.textContent = cartLength;
    counterCartHTML.classList.add("show");
  } else {
    counterCartHTML.classList.remove("show");
  }
};

export const calculateDiscount = (originalPrice, finalPrice) => 100 - (Math.round((finalPrice * 100) / originalPrice))

export function alertMessage(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `${message} <span class="close">X</span>`;
  alert.addEventListener('click', function (e) {
    e.target.tagName === 'SPAN' && main.removeChild(this);
  })
  const main = document.querySelector('main');
  main.prepend(alert);
  if (scroll) window.scrollTo(0, 0);
}

export function alertCart(){
  const cartIcon = document.querySelector("#cart-icon");
  cartIcon.classList.add("shake");
  setTimeout(() => cartIcon.classList.remove("shake"), 1000);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}
