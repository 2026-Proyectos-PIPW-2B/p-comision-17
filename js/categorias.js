let libroActual = null;

document.addEventListener("DOMContentLoaded", () => {
  const catalogContainer = document.getElementById("catalog-container");
  const searchInput = document.getElementById("search-input");

  // Agrupar los elementos de control (Checkboxes del Sidebar)
  const checkboxesCategoria = document.querySelectorAll(".checkbox-categoria");
  const checkboxesFormato = document.querySelectorAll(".checkbox-formato");
  const checkboxesTipo = document.querySelectorAll(".checkbox-tipo");

  // Traer datos de stock desde localStorage
  function obtenerProductos() {
    const productos = localStorage.getItem("librarium_stock");
    return productos ? JSON.parse(productos) : [];
  }

  // Dibujar las tarjetas dinámicas
  function renderizarCatalogo() {
    if (!catalogContainer) return;

    const productos = obtenerProductos();
    catalogContainer.innerHTML = "";

    if (productos.length === 0) {
      catalogContainer.innerHTML = `<p class="text-center text-muted w-100 my-4">No hay libros cargados en el stock actualmente.</p>`;
      return;
    }

    productos.forEach((libro) => {
      const categoriasArray = Array.isArray(libro.categoria)
        ? libro.categoria
        : [libro.categoria];
      const formatosArray = Array.isArray(libro.formato)
        ? libro.formato
        : [libro.formato];

      const col = document.createElement("div");
      col.className = "col book-item";

      col.setAttribute("data-category", categoriasArray.join(","));
      col.setAttribute("data-format", formatosArray.join(","));
      col.setAttribute("data-type", libro.tipo || "Nuevo");

      // Modificamos el diseño de la card agregándole interacción con el Modal
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
  }

  // ==================== FUNCIÓN DINÁMICA DE RELLENO DEL MODAL ====================
  window.verDetalleLibro = function (id) {
    const productos = obtenerProductos();
    const libro = productos.find((p) => p.id === id);
    console.log("Entró a verDetalleLibro", id);
    console.log(window.verDetalleLibro);

    if (libro) {
      libroActual = libro;
      // Mapear elementos del modal
      document.getElementById("modalLibroImagen").src = libro.imagen;
      document.getElementById("modalLibroImagen").alt =
        `Portada de ${libro.titulo}`;
      document.getElementById("modalLibroAutor").textContent = libro.autor;
      document.getElementById("modalLibroTitulo").textContent = libro.titulo;
      document.getElementById("modalLibroPrecio").textContent =
        `$${libro.precio.toLocaleString("es-AR")}`;

      // Carga condicional de la descripción
      document.getElementById("modalLibroDescripcion").textContent =
        libro.descripcion && libro.descripcion.trim() !== ""
          ? libro.descripcion
          : "Este maravilloso título no cuenta con descripción de momento.";

      // Control dinámico de las insignias de Stock
      const stockBadge = document.getElementById("modalLibroStock");
      const btnCarrito = document.getElementById("modalBtnAgregarCarrito");

      console.log("Libro:", libro.id);

      btnCarrito.dataset.id = libro.id;

      console.log("dataset:", btnCarrito.dataset.id);

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

  // Procesar filtros simultáneos
  function filtrarLibros() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const categoriesMarcadas = Array.from(checkboxesCategoria)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value.trim());
    const formatosMarcados = Array.from(checkboxesFormato)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value.trim());
    const tiposMarcados = Array.from(checkboxesTipo)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value.trim());

    const bookItems = document.querySelectorAll(".book-item");

    bookItems.forEach((item) => {
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

  // Vincular escuchadores
  searchInput?.addEventListener("input", filtrarLibros);
  checkboxesCategoria.forEach((cb) =>
    cb.addEventListener("change", filtrarLibros),
  );
  checkboxesFormato.forEach((cb) =>
    cb.addEventListener("change", filtrarLibros),
  );
  checkboxesTipo.forEach((cb) => cb.addEventListener("change", filtrarLibros));

  // Render inicial
  renderizarCatalogo();

  // Interceptar parámetros URL
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
        filtrarLibros();
      }
    }, 100);
  }
});

const btnCarrito =
  document.getElementById("modalBtnAgregarCarrito");

console.log(btnCarrito);

btnCarrito?.addEventListener("click", () => {

  console.log("CLICK");
  console.log(libroActual);

  if (!libroActual) return;

  window.addToCart(libroActual.id);

});
