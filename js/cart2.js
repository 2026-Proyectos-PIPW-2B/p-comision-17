const shop = JSON.parse(localStorage.getItem("shop")) || {
  carts: {},
  orders: [],
  usarOrders: {},
};
const productos = JSON.parse(localStorage.getItem("librarium_stock")) || [];
const usuarioActivo =
  JSON.parse(localStorage.getItem("UsuarioLoggeado")) || null;

let cart = null;

function inicializarCart() {
  if (!usuarioActivo) return;

  const userId = usuarioActivo.id;

  // Carrito
  if (!shop.carts[userId]) {
    shop.carts[userId] = {
      items: [],
    };
  }

  // Historial pedidos global
  if (!shop.orders) {
    shop.orders = [];
  }

  // Historial por usuario
  if (!shop.userOrders) {
    shop.userOrders = {};
  }

  if (!shop.userOrders[userId]) {
    shop.userOrders[userId] = [];
  }

  cart = shop.carts[userId];

  guardarShop();
}

function guardarShop() {
  localStorage.setItem("shop", JSON.stringify(shop));
}

//Actualizar el Badge

function actualizarCartBadge() {
  const badge = document.getElementById("cart-badge");

  if (!badge || !cart) return;

  const total = cart.items.reduce((acum, item) => {
    return acum + item.quantity;
  }, 0);

  badge.textContent = total;
}

window.agregarCart = function (productId) {
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

  guardarShop();
  renderCart();
  actualizarCartBadge();
};

function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  let subtotal = 0;

  if (!cartContainer || !cart) {
    return;
  }

  if (cart.items.length === 0) {
    cartContainer.innerHTML = `
      <p class="text-center text-muted">
        Tu carrito está vacío.
      </p>
    `;
    return;
  }

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

function renderResumen() {
  const subtotal = document.getElementById("subtotal");
  const descuentoEfect = document.getElementById("descuentoEfect");
  const total = document.getElementById("total");

  if (!subtotal || !descuentoEfect || !total) {
    return;
  }

  if (!cart) {
    return;
  }

  let subtotalCompra = 0;

  cart.items.forEach((item) => {
    const producto = productos.find(
      (p) => Number(p.id) === Number(item.productId),
    );

    if (!producto) return;

    subtotalCompra += producto.precio * item.quantity;
  });

  const descuento = subtotalCompra * 0.1;
  const totalDescuento = subtotalCompra - descuento;

  subtotal.textContent = `$${subtotalCompra.toLocaleString("es-AR")}`;

  descuentoEfect.textContent = `-$${descuento.toLocaleString("es-AR")}`;

  total.textContent = `$${totalDescuento.toLocaleString("es-AR")}`;

  const btnFinalizar = document.getElementById("btnFinalizar");
  if (cart.items.length === 0) {
    btnFinalizar.disabled = true;
    btnFinalizar.textContent = "Carrito vacío";
  } else {
    btnFinalizar.disabled = false;
    btnFinalizar.textContent = "Finalizar compra";
  }
}

const cartContainer = document.getElementById("cart-items");

cartContainer?.addEventListener("click", (e) => {
  const productId = Number(e.target.dataset.id);

  // Eliminar
  if (e.target.classList.contains("btn-delete")) {
    cart.items = cart.items.filter(
      (item) => Number(item.productId) !== productId,
    );

    guardarShop();
    renderCart();
    renderResumen();
    actualizarCartBadge();
    return;
  }

  // Buscar el producto una sola vez
  const item = cart.items.find((item) => Number(item.productId) === productId);

  if (!item) return;

  // Sumar
  if (e.target.classList.contains("btn-plus")) {
    item.quantity++;

    guardarShop();
    renderCart();
    renderResumen();
    actualizarCartBadge();
    return;
  }

  // Restar
  if (e.target.classList.contains("btn-minus")) {
    if (item.quantity > 1) {
      item.quantity--;
    }

    guardarShop();
    renderCart();
    renderResumen();
    actualizarCartBadge();
  }
});

function finalizarCompra() {
  if (!cart || cart.items.length === 0) {
    return;
  }

  let subtotal = 0;

  cart.items.forEach((item) => {
    const producto = productos.find(
      (p) => Number(p.id) === Number(item.productId),
    );

    if (!producto) return;

    subtotal += producto.precio * item.quantity;
  });

  const descuento = subtotal * 0.1;
  const total = subtotal - descuento;

  const compra = {
    id: Date.now(),
    userId: usuarioActivo.id,
    fecha: new Date().toLocaleDateString("es-AR"),
    items: [...cart.items],
    subtotal,
    descuento,
    total,
    estado: "Pendiente",
  };

  // Historial global
  shop.orders.push(compra);

  // Historial del usuario
  shop.userOrders[usuarioActivo.id].push(compra);

  // Descontar stock
  cart.items.forEach((item) => {
    const producto = productos.find(
      (p) => Number(p.id) === Number(item.productId),
    );

    if (producto) {
      producto.stock -= item.quantity;
    }
  });

  localStorage.setItem("librarium_stock", JSON.stringify(productos));

  // Vaciar carrito
  cart.items = [];

  guardarShop();

  renderCart();
  renderResumen();
  actualizarCartBadge();

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("modalConfirmarCompra"),
  );

  modal.hide();

  const toast = new bootstrap.Toast(document.getElementById("toastCompra"));

  toast.show();
}

inicializarCart();
renderCart();
renderResumen();
actualizarCartBadge();

const btnConfirmarCompra = document.getElementById("btnConfirmarCompra");

btnConfirmarCompra?.addEventListener("click", finalizarCompra);
