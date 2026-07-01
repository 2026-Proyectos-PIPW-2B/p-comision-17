const shop = JSON.parse(localStorage.getItem("shop")) || {
  orders: [],
  carts: {},
  userOrders: {},
};
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const productos = JSON.parse(localStorage.getItem("librarium_stock")) || [];
let paginaActual = 1;
const pedidosPorPagina = 10;
const inputBuscarPedido = document.getElementById("inputBuscarPedido");
let textoBusqueda = "";
const filtroEstado = document.getElementById("filtroEstado");
let estadoFiltro = "";

function guardarShop() {
  localStorage.setItem("shop", JSON.stringify(shop));
}

//Render pedidos filtrados

function obtenerPedidosFiltrados() {
  const busqueda = textoBusqueda.trim().toLowerCase();

  return shop.orders.filter((pedido) => {
    const usuario = usuarios.find(
      (u) => Number(u.id) === Number(pedido.userId),
    );
    const coincideBusqueda =
      !busqueda ||
      pedido.id.toString().includes(busqueda) ||
      usuario?.usuario?.toLowerCase().includes(busqueda);

    const coincideEstado =
      estadoFiltro === "" || pedido.estado === estadoFiltro;

    return coincideBusqueda && coincideEstado;
  });
}

//Render estadisticas

function renderEstadisticas() {
  const totalVentas = document.getElementById("totalVentas");

  const ingresos = document.getElementById("totalIngresos");

  const clientes = document.getElementById("clientes");

  if (!totalVentas || !ingresos || !clientes) {
    return;
  }

  //Cantidad de ventas

  totalVentas.textContent = shop.orders.length;

  // Ingresos

  const totalIngresos = shop.orders.reduce(
    (acum, pedido) => acum + pedido.total,
    0,
  );

  ingresos.textContent = `$${totalIngresos.toLocaleString("es-AR")}`;

  // Clientes

  const totalClientes = usuarios.filter((u) => u.rol === "cliente").length;

  clientes.textContent = totalClientes;
}

// Render Tabla Ultimos Pedidos

function renderUltimosPedidos() {
  const tbody = document.getElementById("ultimosPedidos");

  if (!tbody) return;

  tbody.innerHTML = "";

  const utlimosPedidos = [...shop.orders].reverse().slice(0, 5);

  utlimosPedidos.forEach((pedido) => {
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

      </tr>
    `;
  });
}

function renderPedidos() {
  const tbody = document.getElementById("tablaPedidosBody");

  if (!tbody || !shop) return;

  tbody.innerHTML = "";

  if (!shop.orders?.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">No hay pedidos registrados.</td>
      </tr>
    `;
    return;
  }

  const pedidosFiltrados = obtenerPedidosFiltrados();

  if (pedidosFiltrados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">No hay pedidos que coincidan con los filtros.</td>
      </tr>
    `;
    return;
  }

  const inicio = (paginaActual - 1) * pedidosPorPagina;
  const fin = inicio + pedidosPorPagina;
  const pedidosPagina = pedidosFiltrados.slice(inicio, fin);

  pedidosPagina.forEach((pedido) => {
    const usuario = usuarios.find(
      (u) => Number(u.id) === Number(pedido.userId),
    );

    tbody.innerHTML += `
      <tr>
        <td>${pedido.id}</td>
        <td>${usuario?.usuario || "Usuario"}</td>
        <td>${pedido.fecha}</td>
        <td>${pedido.items?.length || 0}</td>
        <td>$${pedido.total?.toLocaleString("es-AR") || 0}</td>
        <td>
          <select class="form-select form-select-sm estado-pedido" data-id="${pedido.id}">
            <option value="Pendiente" ${pedido.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
            <option value="Preparando" ${pedido.estado === "Preparando" ? "selected" : ""}>Preparando</option>
            <option value="Entregado" ${pedido.estado === "Entregado" ? "selected" : ""}>Entregado</option>
          </select>
        </td>
        <td>
          <button class="btn btn-link btn-detalle text-info p-0" data-id="${pedido.id}">Ver detalle</button>
        </td>
      </tr>
    `;
  });
}

//Paginación
function renderPaginacion() {
  const paginacion = document.getElementById("paginacionPedidos");
  const pedidosFiltrados = obtenerPedidosFiltrados();

  if (!paginacion) return;

  paginacion.innerHTML = "";

  const totalPaginas = Math.max(
    1,
    Math.ceil(pedidosFiltrados.length / pedidosPorPagina),
  );

  if (paginaActual > totalPaginas) {
    paginaActual = totalPaginas;
  }

  for (let i = 1; i <= totalPaginas; i++) {
    paginacion.innerHTML += `
      <li class="page-item ${i === paginaActual ? "active" : ""}">
        <button class="page-link btn-pagina" data-page="${i}">
          ${i}
        </button>
      </li>
    `;
  }
}

function mostrarDetallePedido(idPedido) {
  const pedido = shop.orders.find((p) => Number(p.id) === Number(idPedido));

  if (!pedido) return;

  const usuario = usuarios.find((u) => Number(u.id) === Number(pedido.userId));
  document.getElementById("detallePedidoId").textContent = pedido.id;

  document.getElementById("detallePedidoCliente").textContent =
    usuario?.usuario;

  document.getElementById("detallePedidoFecha").textContent = pedido.fecha;

  document.getElementById("detallePedidoSubtotal").textContent =
    `$${pedido.subtotal.toLocaleString("es-AR")}`;

  document.getElementById("detallePedidoDescuento").textContent =
    `-$${pedido.descuento.toLocaleString("es-AR")}`;

  document.getElementById("detallePedidoTotal").textContent =
    `$${pedido.total.toLocaleString("es-AR")}`;

  const contenedor = document.getElementById("detallePedidoProductos");

  //Estado del pedido

  const badgeEstado = document.getElementById("detallePedidoEstado");

  badgeEstado.textContent = pedido.estado;

  if (pedido.estado === "Pendiente") {
    badgeEstado.className = "badge bg-warning text-dark fs-6";
  }

  if (pedido.estado === "Preparando") {
    badgeEstado.className = "badge bg-info fs-6";
  }

  if (pedido.estado === "Entregado") {
    badgeEstado.className = "badge bg-success fs-6";
  }

  contenedor.innerHTML = "";

  pedido.items.forEach((item) => {
    const producto = productos.find(
      (p) => Number(p.id) === Number(item.productId),
    );

    if (!producto) return;

    contenedor.innerHTML += `
  <div class="d-flex justify-content-between align-items-center border rounded-3 p-3 mb-2">

    <div>
      <h6 class="mb-1">
        ${producto.titulo}
      </h6>

      <small class="text-muted">
        ${producto.autor}
      </small>
    </div>

    <span class="badge bg-primary rounded-pill">
      x${item.quantity}
    </span>

  </div>
`;
  });

  const modal = new bootstrap.Modal(
    document.getElementById("modalDetallePedido"),
  );

  modal.show();
}

//Modal Ver Detalle

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-detalle")) {
    mostrarDetallePedido(Number(e.target.dataset.id));
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-pagina")) {
    paginaActual = Number(e.target.dataset.page);

    renderPedidos();
    renderPaginacion();
  }
});

//Filtro de Búsqueda
inputBuscarPedido?.addEventListener("input", (e) => {
  textoBusqueda = e.target.value;
  paginaActual = 1;
  renderPedidos();
  renderPaginacion();
});

//Filtrar por estado
filtroEstado?.addEventListener("click", (e) => {
  const item = e.target.closest(".dropdown-item");

  if (!item) return;

  e.preventDefault();

  const valorTexto = item.textContent.trim();

  estadoFiltro = valorTexto === "Todos" ? "" : valorTexto;

  filtroEstado.textContent = valorTexto;
  paginaActual = 1;
  renderPedidos();
  renderPaginacion();
});

document.addEventListener("change", (e) => {
  if (e.target.classList.contains("estado-pedido")) {
    const idPedido = Number(e.target.dataset.id);
    const pedido = shop.orders.find((p) => Number(p.id) === idPedido);

    if (!pedido) return;

    pedido.estado = e.target.value;
    guardarShop();
    renderPedidos();
    renderUltimosPedidos();
    renderEstadisticas();
    renderPaginacion();
  }
});

renderEstadisticas();
renderUltimosPedidos();
renderPedidos();
renderPaginacion();
