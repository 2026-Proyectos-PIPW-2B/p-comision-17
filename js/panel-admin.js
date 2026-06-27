const shop = JSON.parse(localStorage.getItem("shop"));
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

let paginaActual = 1;
const pedidosPorPagina = 10;

function renderPedidos() {
  const tbody = document.getElementById("tablaPedidosBody");

  if (!tbody || !shop) return;

  tbody.innerHTML = "";

  if (shop.orders.length === 0) {
    tbody.innerHTML = `
    <tr>
      <td colspan="7">
        No hay pedidos registrados.
      </td>
    </tr>
  `;
    return;
  }

  const inicio = (paginaActual - 1) * pedidosPorPagina;
  const fin = inicio + pedidosPorPagina;

  const pedidosPagina = shop.orders.slice(inicio, fin);

  pedidosPagina.forEach((pedido) => {
    const usuario = usuarios.find(
      (u) => Number(u.id) === Number(pedido.userId),
    );

    tbody.innerHTML += `
      <tr>

        <td>
          ${pedido.id}
        </td>

        <td>
          ${usuario?.usuario || "Usuario"}
        </td>

        <td>
          ${pedido.fecha}
        </td>

        <td>
          ${pedido.items.length}
        </td>

        <td>
          $${pedido.total.toLocaleString("es-AR")}
        </td>

        <td>
          <span class="badge bg-warning text-dark">
            ${pedido.estado}
          </span>
        </td>

        <td>
          <button
            class="btn btn-link text-info p-0"
            data-id="${pedido.id}">
            Ver detalle
          </button>
        </td>

      </tr>
    `;
  });
}

function renderPaginacion() {
  const paginacion = document.getElementById("paginacionPedidos");

  if (!paginacion) return;

  paginacion.innerHTML = "";

  const totalPaginas = Math.ceil(shop.orders.length / pedidosPorPagina);

  for (let i = 1; i <= totalPaginas; i++) {
    paginacion.innerHTML += `
      <li class="page-item ${i === paginaActual ? "active" : ""}">

        <button
          class="page-link btn-pagina"
          data-page="${i}">
          ${i}
        </button>

      </li>
    `;
  }
}

document.addEventListener("click", (e) =>{

    if (e.target.classList.contains("btn-pagina")) {
        paginaActual = Number(
            e.target.dataset.page
        );

        renderPedidos();
        renderPaginacion();
    }
})

renderPedidos();
renderPaginacion();
