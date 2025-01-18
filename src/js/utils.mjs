// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  const cart = localStorage.getItem(key);
  return cart ? JSON.parse(cart) : [];
}
// save data to local storage
export function setLocalStorage(key, data) {
  const existingData = JSON.parse(localStorage.getItem(key)) || [];
  const updatedData = Array.isArray(existingData)
    ? existingData
    : [existingData];
  updatedData.push(data);
  localStorage.setItem(key, JSON.stringify(updatedData));
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

export function counterItems(key) {
  const items = JSON.parse(localStorage.getItem(key)) || [];
  return Array.isArray(items) ? items.length : 0;
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear,
) {
  const elements = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, elements.join(""));
}
