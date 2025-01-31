import {
  getLocalStorage,
  renderWithTemplate,
  showAlertMessage,
  removeAllAlerts,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function packageItems(items) {
  // convert the list of products from localStorage to the simpler form required for the checkout process. Array.map would be perfect for this.
  let simpleItems = items.map((item) => {
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: item.Quantity,
    };
  });
  return simpleItems;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 10;
    this.tax = 0.06;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    let numItems = 0;
    for (const item of this.list) {
      this.itemTotal += item.FinalPrice * item.Quantity;
      numItems += item.Quantity;
    }

    this.outputSelector.querySelector("#num-items").textContent = numItems;
    this.outputSelector.querySelector("#cartTotal").textContent =
      `$${this.itemTotal}`;
    this.outputSelector.querySelector("#shipping").textContent =
      `$${this.shipping}`;
    this.outputSelector.querySelector("#tax").textContent =
      `$${this.tax * 100}%`;
  }

  calculateOrdertotal() {
    // calculate the shipping and tax amounts. Then use them to along with the cart total to figure out the order total
    this.orderTotal =
      this.shipping + this.itemTotal * this.tax + this.itemTotal;
    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    this.outputSelector.querySelector("#orderTotal").textContent =
      `$${this.orderTotal}`;
  }

  async checkout(form) {
    const formElement = document.forms["checkout"];

    const json = formDataToJSON(formElement);
    // add totals, and item details
    json.orderDate = new Date();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = packageItems(this.list);
    console.log(json);
    try {
      const res = await services.checkout(json);
      console.log(res);
      localStorage.removeItem("so-cart");
      window.location.href = "../checkout/success.html";
    } catch (err) {
      removeAllAlerts();
      for (let message in err.message) {
        showAlertMessage(err.message[message], true);
      }
      console.log(err);
    }
  }
}
