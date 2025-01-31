import { loadHeaderFooter, clearLocalStorage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
const BASE_URL = window.location.origin;

loadHeaderFooter();

const element = document.querySelector(".checkout-summary");
const checkout = new CheckoutProcess("so-cart", element);
checkout.init();

document.querySelector("#zip").addEventListener("blur", checkout.calculateOrdertotal.bind(checkout));

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  const form = document.forms[0];
  const statusForm = form.checkValidity();
  form.reportValidity();
  if (statusForm) {
    checkout.checkout();
    window.location.href = `${BASE_URL}/checkout/success.html`;
    clearLocalStorage("so-cart");
  }
});
checkout.calculateOrdertotal();
