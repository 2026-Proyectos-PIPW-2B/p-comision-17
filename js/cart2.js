const shop = JSON.parse(localStorage.getItem("shop"));
const productos = JSON.parse(localStorage.getItem("librarium_stock")) || [];
const usuarioActivo = JSON.parse(localStorage.getItem("UsuarioLoggeado"));

let cart = null;

function initializeCart() {
  if (!usuarioActivo) return;

  const userId = usuarioActivo.id;

  if (!shop.carts[userId]) {
    shop.carts[userId] = {
      items: [],
    };

    localStorage.setItem("shop", JSON.stringify(shop));
  }

  cart = shop.carts[userId];
}

function saveShop() {
  localStorage.setItem("shop", JSON.stringify(shop));
}

window.addToCart = function (productId) {
      console.log("AGREGANDO");
  console.log("Entró", productId);
  console.log(cart);
  if (!cart) return;

  const item = cart.items.find((item) => item.productId == productId);

  if (item) {
    item.quantity++;
  } else {
    cart.items.push({
      productId: Number(productId),
      quantity: 1,
    });
  }

  saveShop();

  renderCart();
};

function renderCart() {
     console.log("RENDER");
  const cartContainer = document.getElementById("cart-items");

  console.log("cartContainer:", cartContainer);
  console.log("cart:", cart);

  if (!cartContainer || !cart) {
    console.log("Salió por el primer if");
    return;
  }

  console.log("items:", cart.items);

  if (cart.items.length === 0) {
    console.log("Entró al carrito vacío");
    cartContainer.innerHTML = `
      <p class="text-center text-muted">
        Tu carrito está vacío.
      </p>
    `;
    return;
  }

  console.log("Tiene productos");

  cartContainer.innerHTML = "";

  cart.items.forEach((item) => {
    const producto = productos.find(
      (p) => Number(p.id) === Number(item.productId),
    );

    if (!producto) return;

    cartContainer.innerHTML += `
<div class="border-bottom pb-3 mb-3">
  <div class="row align-items-center">

    <div class="col-md-6">
      <div class="d-flex align-items-center gap-3">

        <img
          src="${producto.imagen}"
          alt="${producto.titulo}"
          class="cart-product-img"
        >

        <div>
          <h5>${producto.titulo}</h5>
          <h6 class="text-muted">${producto.autor}</h6>
        </div>

      </div>
    </div>

    <div class="col-md-2 text-center">
  <div class="product-cant d-inline-flex align-items-center border rounded-pill overflow-hidden">

    <button
      class="btn btn-sm border-0 btn-minus px-3"
      data-id="${producto.id}">
      -
    </button>

    <span class="px-3 fw-semibold">
      ${item.quantity}
    </span>

    <button
      class="btn btn-sm border-0 btn-plus px-3"
      data-id="${producto.id}">
      +
    </button>

  </div>
</div>

    <div class="col-md-2 text-center">
      $${producto.precio.toLocaleString("es-AR")}
    </div>

    <div class="col-md-2 text-center">
      <button
        class="btn bi bi-trash btn-delete"
        data-id="${producto.id}">
      </button>
    </div>

  </div>
</div>
`;
  });
}

const cartContainer = document.getElementById("cart-items");

cartContainer?.addEventListener("click", (e) => {
  const productId = Number(e.target.dataset.id);

  // Eliminar
  if (e.target.classList.contains("btn-delete")) {
    cart.items = cart.items.filter(
      (item) => Number(item.productId) !== productId,
    );

    saveShop();
    renderCart();
    return;
  }

  // Buscar el producto una sola vez
  const item = cart.items.find((item) => Number(item.productId) === productId);

  if (!item) return;

  // Sumar
  if (e.target.classList.contains("btn-plus")) {
    item.quantity++;

    saveShop();
    renderCart();
    return;
  }

  // Restar
  if (e.target.classList.contains("btn-minus")) {
    if (item.quantity > 1) {
      item.quantity--;
    }

    saveShop();
    renderCart();
  }
});

initializeCart();
renderCart();
