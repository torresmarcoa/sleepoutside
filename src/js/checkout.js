import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const element = document.querySelector(".checkout-summary");
const checkout = new CheckoutProcess("so-cart", element);
checkout.init();

document
  .querySelector("#zip")
  .addEventListener("blur", checkout.calculateOrdertotal.bind(checkout));

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();

  /* testing*/
  const form = document.forms[0];
  const validationResponse = form.checkValidity();
  form.reportValidity();
  if (validationResponse) {
    checkout.checkout();
  }
});
checkout.calculateOrdertotal();
