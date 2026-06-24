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

function renderCart () {
    cartContainer.innerHTML = "";

    cart.items.forEach((item) =>{
        console.log(item);
    });
}

renderCart()