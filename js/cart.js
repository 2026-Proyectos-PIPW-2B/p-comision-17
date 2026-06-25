const shop = JSON.parse(localStorage.getItem("shop"));

let cart = null;

const cartContainer = document.getElementById("cart-items");

const usuarioActivo =
  JSON.parse(localStorage.getItem("UsuarioLoggeado")) || null;

const productos = JSON.parse(localStorage.getItem("librarium_stock"));



//busco el usuario que inició sesión

if (!usuarioActivo) {
  console.log("No hay usuario logueado");
} else {
  const userId = usuarioActivo.id;

  // si el usuario no tiene carrito, se crea uno vacío

  if (!shop.carts[userId]) {
    shop.carts[userId] = {
      items: [],
    };

    localStorage.setItem("shop", JSON.stringify(shop));
  }

  cart = shop.carts[userId];

  if (cart.items.length === 0) {
    cart.items.push({
      productId: productos[0].id,
      quantity: 1,
    });

    localStorage.setItem("shop", JSON.stringify(shop));
  }

  console.log("carrito: ", cart);
  console.log("items: ", cart.items);

  //lo guardo en el localStorage

  localStorage.setItem("shop", JSON.stringify(shop));
}

console.log(cart);

function renderCart() {
  console.log("PRODUCTOS:");
  console.log(productos);

  console.log("CARRITO:");
  console.log(cart);

  cartContainer.innerHTML = ""; // Limpiar el contenedor

  cart.items.forEach((item) => {
    console.log("ITEM:");
    console.log(item);

    const producto = productos.find((p) => p.id == item.productId);

    // crear cards de los items

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
        <div 
           class="product-cant d-inline-flex align-items-center border rounded-pill overflow-hidden" >
           
           <button class="btn btn-sm border-0 btn-minus px-3" data-id=${producto.id}> - </button>
           
           <span class="px-3 fw-semibold"> ${item.quantity} </span>

          <button class="btn btn-sm border-0 btn-plus px-3" data-id=${producto.id}> + </button>
          
          </div>
          
        </div>

        <div class="col-md-2 text-center">
          ${producto.precio}
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

//Botón borrar item

cartContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const productId = Number(e.target.dataset.id);
    console.log(productId);
    cart.items = cart.items.filter((item) => item.productId !== productId);

    localStorage.setItem("shop", JSON.stringify(shop));

    renderCart();
  }
});

// Botones cantidad

cartContainer.addEventListener("click", (e) => {
  // Botón restar

  if (e.target.classList.contains("btn-minus")) {
    const productId = Number(e.target.dataset.id);

    const item = cart.items.find((item) => item.productId === productId);

    if (item.quantity > 1) {
      item.quantity--;
    }

    localStorage.setItem("shop", JSON.stringify(shop));
    renderCart();
    console.log("restando");
  }

  // Botón sumar

  if (e.target.classList.contains("btn-plus")) {
    const productId = Number(e.target.dataset.id);

    const item = cart.items.find((item) => item.productId === productId);

    item.quantity++;

    localStorage.setItem("shop", JSON.stringify(shop));
    renderCart();
    console.log("sumando");
  }
});

//================= Boton Agregar al carrito ===============

const btnAgregar = document.getElementById("modalBtnAgregarCarrito");
const productoActual = productos.id

btnAgregar.addEventListener("click", () => {
  const itemExistente = cart.items.find(
    (item) => item.productId === productoActual,
  );

  if (itemExistente) {
    itemExistente.quantity++;
  } else {
    cart.items.push({
      productId: productoActual,
      quantity: 1,
    });
  }

  localStorage.setItem("shop", JSON.stringify(shop));
  renderCart();
});

renderCart();
