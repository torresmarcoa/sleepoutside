import { clearLocalStorage, getLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
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
  return items.map((item) => {
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: item.Quantity,
    };
  });
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
    this.calculateOrdertotal();
  }

  calculateItemSummary() {
    let numItems = 0;
    for (const item of this.list) {
      this.itemTotal += item.FinalPrice * item.Quantity;
      numItems += item.Quantity;
    }

    this.outputSelector.querySelector("#num-items").textContent = numItems;
    this.outputSelector.querySelector("#cartTotal").textContent = `$${this.itemTotal.toFixed(2)}`;
    this.outputSelector.querySelector("#shipping").textContent = `$${this.shipping}`;
    this.outputSelector.querySelector("#tax").textContent = `$${this.tax * 100}%`;
  }

  calculateOrdertotal() {
    this.orderTotal = this.shipping + (this.itemTotal * this.tax) + this.itemTotal;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    this.outputSelector.querySelector("#orderTotal").textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout() {
    const formElement = document.forms["checkout"];
    const json = formDataToJSON(formElement);
    json.orderDate = new Date();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = packageItems(this.list);
    try {
      await services.checkout(json);
      clearLocalStorage(this.key);
      window.location.href = "success.html";
    } catch (err) {
      removeAllAlerts();
      for (let message in err.message) {
        alertMessage(err.message[message]);
      }
    }
  }
}