// Elements
const btn__cart = document.querySelector("nav button");
const flotante = document.querySelector(".flotante");
const cart__items = document.querySelector(".cart__items");
const container = document.querySelector(".container");
const url = "https://academlo-api-production.up.railway.app/api/products";
let items__in__cart = [];

document.addEventListener("DOMContentLoaded", () => {
  if (JSON.parse(localStorage.getItem("products"))) {
    items__in__cart = JSON.parse(localStorage.getItem("products"));
  }
  renderCart(items__in__cart);
});
//Cart animation
btn__cart.addEventListener("click", () => {
  flotante.classList.toggle("flotante__visible");
});

//Fetch and render products
getInfoBackend();
async function getInfoBackend() {
  const response = await fetch(url);
  const products = await response.json();
  render(products);
}
const render = (products) => {
  let html = "";
  for (const product of products) {
    html += `<div class="card" data-id=${product.id}>
          <div class="card__image">
            <img
              src="${product.images.image1}"
              alt=""
            />
          </div>
          <div class="card__name">${product.name}</div>
          <div class="card__price">${product.price.toFixed(2)}</div>
          <button class="add__to__cart">Add to card</button>
        </div>`;
  }
  container.innerHTML = html;
};

//Cart Funcionallity
const addProduct = (e) => {
  if (e.target.classList.contains("add__to__cart")) {
    const card = e.target.parentElement;
    const image = card.querySelector("img").src;
    const name = card.querySelector(".card__name").textContent;
    const price = card.querySelector(".card__price").textContent;
    const id = card.dataset.id;
    let product__to__add = {
      id: id,
      image: image,
      name: name,
      price: price,
      quantity: 1,
    };
    if (
      items__in__cart.some((product) => {
        return product.id == product__to__add.id;
      })
    ) {
      items__in__cart.some((item) => {
        item.id == product__to__add.id ? item.quantity++ : null;
      });
    } else {
      items__in__cart.unshift(product__to__add);
    }
    renderCart(items__in__cart);
  }
};
container.addEventListener("click", addProduct);

//Render cart
function renderCart(itemsInCart) {
  let html = "";
  for (const item of itemsInCart) {
    html += `<div class="card__cart">
    <div class="card__cart--product">
      <img src="${item.image}" alt="" />
    </div>
    <div class="card__cart--name">${item.name}</div>
    <div class="card__cart--price">${item.price}</div>
    <div class="card__cart--quantity">${item.quantity}</div>
    <button data-id=${item.id}><i class="fa-solid fa-trash"></i></button>
  </div>`;
  }
  cart__items.innerHTML = html;
  getTotal();
  localStorage.setItem("products", JSON.stringify(itemsInCart));
}

const getTotal = function () {
  let total = 0;
  const total__to__pay = document.querySelector(".cart__total");
  for (const item of items__in__cart) {
    total += Number(item.price * item.quantity);
  }
  total__to__pay.textContent = `Total $ ${total}`;
};

//Delete a product
flotante.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash")) {
    let id = e.target.parentElement.dataset.id;
    deleteProduct(id);
    renderCart(items__in__cart);
  }
});

function deleteProduct(id) {
  items__in__cart = items__in__cart.filter((item) => item.id != id);
}

//Empty Cart
document.querySelector(".cart__delete").addEventListener("click", () => {
  items__in__cart = [];
  renderCart(items__in__cart);
});
