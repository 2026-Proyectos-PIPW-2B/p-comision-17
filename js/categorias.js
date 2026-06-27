let libroActual = null;

document.addEventListener("DOMContentLoaded", () => {
  const catalogContainer = document.getElementById("catalog-container");
  const searchInput = document.getElementById("search-input");
  // Capturar el nuevo selector de ordenamiento creado en el HTML
  const sortSelect = document.getElementById("sort-select");

  // Agrupar los elementos de control (Checkboxes del Sidebar)
  const checkboxesCategoria = document.querySelectorAll(".checkbox-categoria");
  const checkboxesFormato = document.querySelectorAll(".checkbox-formato");
  const checkboxesTipo = document.querySelectorAll(".checkbox-tipo");

  // Variables globales para recordar el estado del filtro ebook
  let filtroEbookActivo = false;

  // Traer datos de stock desde localStorage
  function obtenerProductos() {
    const productos = localStorage.getItem("librarium_stock");
    return productos ? JSON.parse(productos) : [];
  }

  // Dibujar las tarjetas dinámicas (con ordenamiento y descuentos integrados)
  function renderizarCatalogo() {
    if (!catalogContainer) return;

    let productos = obtenerProductos();
    catalogContainer.innerHTML = "";

    if (productos.length === 0) {
      catalogContainer.innerHTML = `<p class="text-center text-muted w-100 my-4">No hay libros cargados en el stock actualmente.</p>`;
      return;
    }

    // ==================== LÓGICA DE ORDENAMIENTO ====================
    // Si sortSelect no existe o el valor es "predeterminado", no aplica ningún .sort() (mantiene el orden original)
    const criterio = sortSelect ? sortSelect.value : "predeterminado";

    if (criterio !== "predeterminado") {
      productos.sort((a, b) => {
        if (criterio === "az") {
          return a.titulo.localeCompare(b.titulo); // Orden alfabético A-Z
        }
        if (criterio === "za") {
          return b.titulo.localeCompare(a.titulo); // Orden alfabético Z-A
        }
        if (criterio === "precio-desc") {
          return b.precio - a.precio; // Mayor a Menor precio
        }
        if (criterio === "precio-asc") {
          return a.precio - b.precio; // Menor a Mayor precio
        }
        return 0;
      });
    }
    // ================================================================

    // Verificar si el filtro "Ebook" está activo
    const checkboxEbook = Array.from(checkboxesFormato).find(
      (cb) => cb.value.toLowerCase().trim() === "ebook",
    );
    filtroEbookActivo = checkboxEbook ? checkboxEbook.checked : false;

    productos.forEach((libro) => {
      const categoriasArray = Array.isArray(libro.categoria)
        ? libro.categoria
        : [libro.categoria];
      const formatosArray = Array.isArray(libro.formato)
        ? libro.formato
        : [libro.formato];

      // ==================== LÓGICA DE DESCUENTOS ====================
      // Evaluamos si entre sus formatos se encuentra "Ebook"
      const esEbook = formatosArray.some(
        (f) => f.toLowerCase().trim() === "ebook",
      );
      // El descuento ebook se aplica si es Ebook Y el filtro Ebook está activo
      const aplicarDescuentoEbook = esEbook && filtroEbookActivo;

      // Evaluamos si el libro es Usado
      const esUsado = libro.tipo === "Usado";

      // Determinamos el descuento a aplicar
      let descuentoPorcentaje = 0;
      let precioFinal = libro.precio;

      if (aplicarDescuentoEbook) {
        descuentoPorcentaje = 40; // 40% descuento para ebooks
        precioFinal = libro.precio * 0.6;
      } else if (esUsado) {
        descuentoPorcentaje = 50; // 50% descuento para libros usados
        precioFinal = libro.precio * 0.5;
      }

      const tieneDescuento = descuentoPorcentaje > 0;
      // =========================================================================

      const col = document.createElement("div");
      col.className = "col book-item";

      col.setAttribute("data-category", categoriasArray.join(","));
      col.setAttribute("data-format", formatosArray.join(","));
      col.setAttribute("data-type", libro.tipo || "Nuevo");

      col.innerHTML = `
                <div class="card h-100 shadow-sm border-1 catalog-card" 
                     style="cursor: pointer;" 
                     data-bs-toggle="modal" 
                     data-bs-target="#modalDetalleLibro" 
                     onclick="verDetalleLibro(${libro.id})">
                    <div class="catalog-img-container">
                        <img src="${libro.imagen}" class="catalog-card-img" alt="Portada de '${libro.titulo}'">
                    </div>
                    <div class="card-body d-flex flex-column p-3">
                        <span class="book-author text-muted small fw-semibold mb-1">${libro.autor}</span>
                        <p class="card-title-book fw-bold mb-1">${libro.titulo}</p>
                        <p class="stars-rating text-warning small mb-2">
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star"></i>
                        </p>
                        <p class="price fw-bold text-dark mb-3">$${libro.precio.toLocaleString("es-AR")}</p>
                        <button class="btn btn-primary btn-sm w-100 mt-auto rounded-pill" >Ver Detalles</button>
                    </div>
                </div>
            `;
      catalogContainer.appendChild(col);
    });

    // Ejecutar el filtrado del buscador y los checkboxes sobre la lista ya ordenada
    filtrarLibros();
  }

  // ==================== FUNCIÓN DINÁMICA DE RELLENO DEL MODAL ====================
  window.verDetalleLibro = function (id) {
    const productos = obtenerProductos();
    const libro = productos.find((p) => p.id === id);

    if (libro) {
      libroActual = libro;
      // Mapear elementos del modal
      document.getElementById("modalLibroImagen").src = libro.imagen;
      document.getElementById("modalLibroImagen").alt =
        `Portada de ${libro.titulo}`;
      document.getElementById("modalLibroAutor").textContent = libro.autor;
      document.getElementById("modalLibroTitulo").textContent = libro.titulo;

      // Mostrar precio con tachado si tiene descuento
      document.getElementById("modalLibroPrecio").innerHTML =
        aplicarDescuentoEbook
          ? `$${precioFinal.toLocaleString("es-AR")}`
          : tieneDescuento
            ? `<span style="text-decoration: line-through; color: #999;">$${libro.precio.toLocaleString("es-AR")}</span> $${precioFinal.toLocaleString("es-AR")}`
            : `$${precioFinal.toLocaleString("es-AR")}`;

      document.getElementById("modalLibroDescripcion").textContent =
        libro.descripcion || "No hay descripción disponible para este libro.";

      const stockBadge = document.getElementById("modalLibroStock");
      const btnCarrito = document.getElementById("modalBtnAgregarCarrito");


      btnCarrito.dataset.id = libro.id;

      if (libro.stock >= 10) {
        stockBadge.textContent = `${libro.stock} unidades disponibles`;
        stockBadge.className = "badge fw-bold stock-alto";
        btnCarrito.disabled = false;
      } else if (libro.stock >= 5) {
        stockBadge.textContent = `${libro.stock} unidades disponibles`;
        stockBadge.className = "badge fw-bold stock-medio";
        btnCarrito.disabled = false;
      } else if (libro.stock >= 1) {
        stockBadge.textContent = `¡Últimas ${libro.stock} unidades!`;
        stockBadge.className = "badge fw-bold stock-bajo";
        btnCarrito.disabled = false;
      } else {
        stockBadge.textContent = "Agotado temporalmente";
        stockBadge.className = "badge fw-bold stock-agotado";
        btnCarrito.disabled = true; // Deshabilita el botón si no hay stock
      }
    }
  };

  // ==================== LÓGICA DE FILTRADO (CHECKBOXES Y BUSCADOR) ====================
  function filtrarLibros() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const categoriesMarcadas = Array.from(checkboxesCategoria)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    const formatosMarcados = Array.from(checkboxesFormato)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    const tiposMarcados = Array.from(checkboxesTipo)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const cards = document.querySelectorAll(".book-item");

    cards.forEach((item) => {
      const title = item
        .querySelector(".card-title-book")
        .textContent.toLowerCase();
      const author = item
        .querySelector(".book-author")
        .textContent.toLowerCase();

      const catLibroStr = item.getAttribute("data-category") || "";
      const catLibroArray = catLibroStr
        ? catLibroStr.split(",").map((c) => c.trim())
        : [];

      const formLibroStr = item.getAttribute("data-format") || "";
      const formLibroArray = formLibroStr
        ? formLibroStr.split(",").map((f) => f.trim())
        : [];

      const tipoLibro = (item.getAttribute("data-type") || "").trim();

      const pasaBuscador = title.includes(query) || author.includes(query);

      const pasaCategoria =
        categoriesMarcadas.length === 0 ||
        categoriesMarcadas.some((c) => catLibroArray.includes(c));

      const pasaFormato =
        formatosMarcados.length === 0 ||
        formatosMarcados.some((f) => formLibroArray.includes(f));

      const pasaTipo =
        tiposMarcados.length === 0 || tiposMarcados.includes(tipoLibro);

      if (pasaBuscador && pasaCategoria && pasaFormato && pasaTipo) {
        item.style.setProperty("display", "block", "important");
      } else {
        item.style.setProperty("display", "none", "important");
      }
    });
  }

  // ==================== EVENT LISTENERS ====================
  // Escuchar el cambio de ordenamiento para redibujar la grilla físicamente
  if (sortSelect) {
    sortSelect.addEventListener("change", renderizarCatalogo);
  }

  if (searchInput) {
    searchInput.addEventListener("input", filtrarLibros);
  }

  checkboxesCategoria.forEach((cb) =>
    cb.addEventListener("change", filtrarLibros),
  );
  checkboxesFormato.forEach((cb) =>
    cb.addEventListener("change", renderizarCatalogo),
  );
  checkboxesTipo.forEach((cb) => cb.addEventListener("change", filtrarLibros));

  // Carga inicial del catálogo
  renderizarCatalogo();

  // Lógica para procesar los parámetros automáticos que llegan desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const filtroURL = urlParams.get("filtro");

  if (filtroURL) {
    setTimeout(() => {
      const todosLosInputs = document.querySelectorAll("#sidebar input");
      let checkboxEncontrado = null;

      todosLosInputs.forEach((input) => {
        if (
          input.value &&
          input.value.toLowerCase().trim() === filtroURL.toLowerCase().trim()
        ) {
          checkboxEncontrado = input;
        }
      });

      if (checkboxEncontrado) {
        todosLosInputs.forEach((cb) => (cb.checked = false));
        checkboxEncontrado.checked = true;
        renderizarCatalogo();
      }
    }, 100);
  }
});

const btnCarrito = document.getElementById("modalBtnAgregarCarrito");

btnCarrito?.addEventListener("click", () => {

  if (!libroActual) return;

  window.agregarCart(libroActual.id);
  const toastBody = document.querySelector("#toastCarrito .toast-body");

toastBody.innerHTML = `
  <i class="bi bi-check-circle-fill me-2"></i>
  <strong>¡${libroActual.titulo}</strong> agregado al carrito!
`;

const toast = new bootstrap.Toast(
  document.getElementById("toastCarrito"),
);

toast.show();
});
