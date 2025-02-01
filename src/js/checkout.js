import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const element = document.querySelector(".checkout-summary");
const checkout = new CheckoutProcess("so-cart", element);
checkout.init();

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  const formElement = document.forms["checkout"];
  const formValid = formElement.checkValidity();
  formElement.reportValidity();
  if (formValid) checkout.checkout();
});
