// Variable global para saber qué ID se está editando o borrando
let idProductoSeleccionado = null;
let filtroEstadoActual = ""; // Variable global para el filtro de estado

function obtenerTerminoBusqueda() {
  const buscador = document.getElementById("buscador-stock");
  return buscador ? buscador.value.toLowerCase().trim() : "";
}

function obtenerFiltroEstado() {
  return filtroEstadoActual;
}

function cambiarFiltroEstado(nuevoEstado) {
  filtroEstadoActual = nuevoEstado;
  renderizarTablaStock();
}

function determinarEstadoStock(stock) {
  if (stock === 0) return "sinstock";
  if (stock > 0 && stock <= 5) return "critico";
  if (stock > 5 && stock < 10) return "alerta";
  return "normal";
}

// Obtener productos de localStorage o inicializar con los datos por defecto
function obtenerProductos() {
  let productos = localStorage.getItem("librarium_stock");
  if (!productos) {
    localStorage.setItem("librarium_stock", JSON.stringify(stockInicial));
    return stockInicial;
  }
  return JSON.parse(productos);
}

// Guardar lista actualizada en localStorage
function guardarProductos(productos) {
  localStorage.setItem("librarium_stock", JSON.stringify(productos));
}

// ==================== 2. RENDERIZAR LA TABLA DE STOCK ====================
function renderizarTablaStock() {
  const tablaBody = document.getElementById("tabla-stock-body");
  if (!tablaBody) return; // Evita errores si no estamos en la página de stock

  const productos = obtenerProductos();
  const terminoBusqueda = obtenerTerminoBusqueda();
  const filtroEstado = obtenerFiltroEstado();
  tablaBody.innerHTML = ""; // Limpiar contenido previo

  const productosFiltrados = productos.filter((prod) => {
    const titulo = (prod.titulo || "").toLowerCase();
    const autor = (prod.autor || "").toLowerCase();
    const coincideTermino =
      terminoBusqueda === "" ||
      titulo.includes(terminoBusqueda) ||
      autor.includes(terminoBusqueda);

    const estadoProducto = determinarEstadoStock(prod.stock);
    const coincideEstado =
      filtroEstado === "" || estadoProducto === filtroEstado;

    return coincideTermino && coincideEstado;
  });

  if (productosFiltrados.length === 0) {
    tablaBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-4">
          No se encontraron libros con ese criterio de búsqueda o filtro.
        </td>
      </tr>
    `;
    return;
  }

  productosFiltrados.forEach((prod) => {
    // Asegurar que formato y categoria siempre sean tratados como arrays para evitar errores de ejecución
    const categoriasArray = Array.isArray(prod.categoria)
      ? prod.categoria
      : [prod.categoria];
    const formatosArray = Array.isArray(prod.formato)
      ? prod.formato
      : [prod.formato];

    const fila = document.createElement("tr");
    fila.innerHTML = `
            <td>${prod.id}</td>
            <td>${prod.titulo}</td>
            <td>${prod.autor}</td>
            <td>
                <span class="badge bg-secondary-subtle text-dark">${categoriasArray.join(", ")}</span>
                <br>
                <small class="text-muted">(${formatosArray.join(", ")})</small>
            </td>
            <td>$${prod.precio.toLocaleString("es-AR")}</td>
            <td>${prod.stock}</td>
            <td>
                <button 
                  class="btn btn-outline-primary btn-sm me-2 bi bi-trash" 
                  data-bs-toggle="modal" 
                  data-bs-target="#modalBorrar"
                  onclick="configurarIdBorrar(${prod.id})">
                </button>

                <button 
                  class="btn btn-outline-primary btn-sm bi bi-pencil"
                  data-bs-toggle="modal" 
                  data-bs-target="#modalEditar"
                  onclick="cargarDatosEnModalEditar(${prod.id})">
                </button>
            </td>
        `;
    tablaBody.appendChild(fila);
  });
}

// ==================== 3. ACCIÓN: CREAR NUEVO PRODUCTO ====================
document
  .getElementById("btn-guardar-producto")
  ?.addEventListener("click", () => {
    // Capturamos los datos usando los IDs del modal de NUEVO producto
    const titulo = document.getElementById("tituloStock").value.trim();
    const autor = document.getElementById("autorStock").value.trim();

    // Captura de select multiple: transforma las opciones elegidas en un Array real
    const categoriaSelect = document.getElementById("categoriaStock");
    const categoria = Array.from(categoriaSelect.selectedOptions).map(
      (opt) => opt.value,
    );

    const formatoSelect = document.getElementById("formatoStock");
    const formato = Array.from(formatoSelect.selectedOptions).map(
      (opt) => opt.value,
    );

    const tipo = document.getElementById("tipoStock").value;
    const precio = parseFloat(document.getElementById("precioStock").value);
    const stock = parseInt(document.getElementById("cantStock").value);
    const descripcion = document
      .getElementById("descripcionStock")
      .value.trim();
    const imagenInput = document.getElementById("stockImagen");

    // Validación estricta incluyendo el tamaño de los arreglos múltiples
    if (
      !titulo ||
      !autor ||
      categoria.length === 0 ||
      formato.length === 0 ||
      !tipo ||
      isNaN(precio) ||
      isNaN(stock)
    ) {
      alert(
        "Por favor, completa todos los campos requeridos y selecciona al menos una categoría y formato.",
      );
      return;
    }

    let productos = obtenerProductos();

    // Cálculo de ID Autoincremental Académico (Bucle For)
    let idMasAlto = 0;
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].id > idMasAlto) {
        idMasAlto = productos[i].id;
      }
    }
    const nuevoId = idMasAlto + 1;

    // Manejo de la ruta de la imagen
    let nombreImagen = "img-portadas/default-book.webp";
    if (imagenInput.files && imagenInput.files[0]) {
      nombreImagen = "img-portadas/" + imagenInput.files[0].name;
    }

    // Crear el nuevo objeto Libro con arreglos dinámicos
    const nuevoLibro = {
      id: nuevoId,
      titulo: titulo,
      autor: autor,
      categoria: categoria, // Array []
      formato: formato, // Array []
      tipo: tipo,
      precio: precio,
      stock: stock,
      descripcion: descripcion,
      imagen: nombreImagen,
    };

    // Guardar en el array, actualizar localStorage y refrescar la tabla
    productos.push(nuevoLibro);
    guardarProductos(productos);

    // Resetear el formulario de carga y cerrar el modal de Bootstrap de forma limpia
    document.getElementById("form-nuevo-producto").reset();
    const modalInstance = bootstrap.Modal.getInstance(
      document.getElementById("exampleModal"),
    );
    modalInstance.hide();

    renderizarTablaStock();
  });

// ==================== 4. ACCIÓN: CONFIGURAR ID PARA BORRAR ====================

const buscadorStock = document.getElementById("buscador-stock");
if (buscadorStock) {
  buscadorStock.addEventListener("input", renderizarTablaStock);
}
window.configurarIdBorrar = function (id) {
  idProductoSeleccionado = id;
};

// Evento para el botón "Si, borrar" adentro de tu modalBorrar
document
  .querySelector("#modalBorrar .btn-outline-info")
  ?.addEventListener("click", () => {
    if (idProductoSeleccionado !== null) {
      let productos = obtenerProductos();
      productos = productos.filter((p) => p.id !== idProductoSeleccionado);
      guardarProductos(productos);
      renderizarTablaStock();

      // Cerrar modalBorrar automáticamente
      const modalInstance = bootstrap.Modal.getInstance(
        document.getElementById("modalBorrar"),
      );
      modalInstance.hide();
    }
  });

// ==================== 5. ACCIÓN: EDITAR PRODUCTO EXISTENTE ====================

// Cargar los datos viejos en los inputs correspondientes del modalEditar
window.cargarDatosEnModalEditar = function (id) {
  idProductoSeleccionado = id;
  const productos = obtenerProductos();
  const producto = productos.find((p) => p.id === id);

  if (producto) {
    // Rellenamos los campos textuales usando los IDs únicos del modal de edición
    document.getElementById("tituloEditar").value = producto.titulo;
    document.getElementById("autorEditar").value = producto.autor;
    document.getElementById("tipoEditar").value = producto.tipo || "Nuevo";
    document.getElementById("precioEditar").value = producto.precio;
    document.getElementById("cantEditar").value = producto.stock;
    document.getElementById("descripcionEditar").value =
      producto.descripcion || "";

    // Asegurar que los datos recuperados sean tratados como arrays
    const categoriasGuardadas = Array.isArray(producto.categoria)
      ? producto.categoria
      : [producto.categoria];
    const formatosGuardados = Array.isArray(producto.formato)
      ? producto.formato
      : [producto.formato];

    // Pre-selección en elementos Múltiples de Categoría
    const selectCategoria = document.getElementById("categoriaEditar");
    Array.from(selectCategoria.options).forEach((option) => {
      option.selected = categoriasGuardadas.includes(option.value);
    });

    // Pre-selección en elementos Múltiples de Formato
    const selectFormato = document.getElementById("formatoEditar");
    Array.from(selectFormato.options).forEach((option) => {
      option.selected = formatosGuardados.includes(option.value);
    });
  }
};

// Guardar los cambios corregidos al hacer clic en el botón de confirmar del modalEditar
document
  .getElementById("btn-confirmar-editar")
  ?.addEventListener("click", () => {
    if (idProductoSeleccionado !== null) {
      let productos = obtenerProductos();
      const index = productos.findIndex((p) => p.id === idProductoSeleccionado);

      if (index !== -1) {
        // Volvemos a capturar las selecciones múltiples como arreglos actualizados
        const categoriaSelect = document.getElementById("categoriaEditar");
        const categoriasActualizadas = Array.from(
          categoriaSelect.selectedOptions,
        ).map((opt) => opt.value);

        const formatoSelect = document.getElementById("formatoEditar");
        const formatosActualizados = Array.from(
          formatoSelect.selectedOptions,
        ).map((opt) => opt.value);

        // Validación mínima para evitar enviar arreglos vacíos al editar
        if (
          categoriasActualizadas.length === 0 ||
          formatosActualizados.length === 0
        ) {
          alert("Debes seleccionar al menos una categoría y un formato.");
          return;
        }

        // Reemplazamos los datos del objeto viejo por las modificaciones del formulario
        productos[index].titulo = document
          .getElementById("tituloEditar")
          .value.trim();
        productos[index].autor = document
          .getElementById("autorEditar")
          .value.trim();
        productos[index].categoria = categoriasActualizadas;
        productos[index].formato = formatosActualizados;
        productos[index].tipo = document.getElementById("tipoEditar").value;
        productos[index].precio = parseFloat(
          document.getElementById("precioEditar").value,
        );
        productos[index].stock = parseInt(
          document.getElementById("cantEditar").value,
        );
        productos[index].descripcion = document
          .getElementById("descripcionEditar")
          .value.trim();

        // Guardamos el array modificado en localStorage y redibujamos la tabla
        guardarProductos(productos);
        renderizarTablaStock();

        // Cerrar el modalEditar de forma automática
        const modalInstance = bootstrap.Modal.getInstance(
          document.getElementById("modalEditar"),
        );
        modalInstance.hide();
      }
    }
  });

// Inicializar el script cargando la tabla apenas se procese el documento
document.addEventListener("DOMContentLoaded", () => {
  // Listeners para el filtro de estado
  const filtroItems = document.querySelectorAll(
    ".dropdown-menu .dropdown-item",
  );
  filtroItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const estado = item.getAttribute("data-estado");
      cambiarFiltroEstado(estado);

      // Actualizar el texto del botón
      const btnFiltro = document.getElementById("btnFiltroEstadoStock");
      btnFiltro.textContent = item.textContent;
    });
  });

  renderizarTablaStock();
});
