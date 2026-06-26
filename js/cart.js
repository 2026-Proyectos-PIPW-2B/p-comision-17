const shop = JSON.parse(localStorage.getItem("shop"));

let cart = null;

const cartContainer = document.getElementById("cart-items");

const usuarioActivo = JSON.parse(localStorage.getItem("UsuarioLoggeado")) || null;

  //busco el usuario que inició sesión

if (!usuarioActivo) {
  console.log("No hay usuario logueado");
} else {
  const userId = usuarioActivo.id;

  // si el usuario no tiene carrito, se crea uno vacío

  if (!shop.carts[userId]) {
    shop.carts[userId] = {
        items: []
    };

    localStorage.setItem("shop", JSON.stringify(shop));
  }

  cart = shop.carts[userId];

  console.log("carrito: ", cart);
  console.log("items: ", cart.items);

//lo guardo en el localStorage 

localStorage.setItem("shop", JSON.stringify(shop));
}

console.log(cart);

function renderCart() {
  
  console.log("holaa", cart.items);

  if (!cartContainer || !cart) return;

  cartContainer.innerHTML = "";

  cart.items.forEach((item) => {
    console.log(item);
  });

  
}

window.addToCart = function (productId) {

  console.log("Agregando:", productId);

  const item = cart.items.find(
    item => item.productId == productId
  );

  if (item) {
    item.quantity++;
  } else {
    cart.items.push({
      productId: Number(productId),
      quantity: 1
    });
  }

  console.log(cart.items);

  localStorage.setItem("shop", JSON.stringify(shop));

  renderCart();
};