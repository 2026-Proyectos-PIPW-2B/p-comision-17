document.addEventListener("DOMContentLoaded", () => {
  const catalogContainer = document.getElementById("catalog-container");
  const searchInput = document.getElementById("search-input");

  // Agrupar los elementos de control
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
      const col = document.createElement("div");
      col.className = "col book-item";

      // Inyectamos las tres variables como metadatos data-* en el HTML
      col.setAttribute("data-category", libro.categoria);
      col.setAttribute("data-format", libro.formato || "Tapa blanda");
      col.setAttribute("data-type", libro.tipo || "Nuevo");

      col.innerHTML = `
                <div class="card h-100 shadow-sm border-1 catalog-card">
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
                        <button class="btn btn-primary btn-sm w-100 mt-auto rounded-pill">Agregar al carrito</button>
                    </div>
                </div>
            `;
      catalogContainer.appendChild(col);
    });
  }

  // Procesar filtros simultáneos
  function filtrarLibros() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const categoriasMarcadas = Array.from(checkboxesCategoria)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    const formatosMarcados = Array.from(checkboxesFormato)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    const tiposMarcados = Array.from(checkboxesTipo)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const bookItems = document.querySelectorAll(".book-item");

    bookItems.forEach((item) => {
      const title = item
        .querySelector(".card-title-book")
        .textContent.toLowerCase();
      const author = item
        .querySelector(".book-author")
        .textContent.toLowerCase();

      const catLibro = item.getAttribute("data-category");
      const formLibro = item.getAttribute("data-format");
      const tipoLibro = item.getAttribute("data-type");

      const pasaBuscador = title.includes(query) || author.includes(query);
      const pasaCategoria =
        categoriasMarcadas.length === 0 ||
        categoriasMarcadas.includes(catLibro);
      const pasaFormato =
        formatosMarcados.length === 0 || formatosMarcados.includes(formLibro);
      const pasaTipo =
        tiposMarcados.length === 0 || tiposMarcados.includes(tipoLibro);

      if (pasaBuscador && pasaCategoria && pasaFormato && pasaTipo) {
        item.style.setProperty("display", "block", "important");
      } else {
        item.style.setProperty("display", "none", "important");
      }
    });
  }

  // Vincular escuchadores a todos los elementos del panel
  searchInput?.addEventListener("input", filtrarLibros);
  checkboxesCategoria.forEach((cb) =>
    cb.addEventListener("change", filtrarLibros),
  );
  checkboxesFormato.forEach((cb) =>
    cb.addEventListener("change", filtrarLibros),
  );
  checkboxesTipo.forEach((cb) => cb.addEventListener("change", filtrarLibros));

  renderizarCatalogo();
});
