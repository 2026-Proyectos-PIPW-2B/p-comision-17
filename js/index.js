document.addEventListener("DOMContentLoaded", () => {
  // 1. Leer las bases de datos desde LocalStorage
  const stockGeneral = localStorage.getItem("librarium_stock")
    ? JSON.parse(localStorage.getItem("librarium_stock"))
    : [];
  const categoriasTabla = localStorage.getItem("librarium_categorias")
    ? JSON.parse(localStorage.getItem("librarium_categorias"))
    : [];
  const destacadosRaw = localStorage.getItem("librarium_destacados")
    ? JSON.parse(localStorage.getItem("librarium_destacados"))
    : null;

  // 2. Crear una estructura limpia por defecto (vacía)
  let destacados = { recomendados: [], novedades: [], importados: [] };

  // 3. VALIDACIÓN ESTRICTA: Solo cargar libros si la categoría existe en la tabla de administración y está "Activa"
  if (destacadosRaw) {
    // Verificar "Recomendados"
    const existeRecomendados = categoriasTabla.some(
      (c) => c.tipoIndex === "recomendados" || c.nombre === "Recomendados",
    );
    if (existeRecomendados)
      destacados.recomendados = destacadosRaw.recomendados || [];

    // Verificar "Novedades"
    const existeNovedades = categoriasTabla.some(
      (c) => c.tipoIndex === "novedades" || c.nombre === "Novedades",
    );
    if (existeNovedades) destacados.novedades = destacadosRaw.novedades || [];

    // Verificar "Importados más vendidos"
    const existeImportados = categoriasTabla.some(
      (c) =>
        c.tipoIndex === "importados" || c.nombre === "Importados más vendidos",
    );
    if (existeImportados)
      destacados.importados = destacadosRaw.importados || [];
  }

  const contenedorRecomendados = document.getElementById(
    "contenedor-recomendados",
  );
  const contenedorNovedades = document.getElementById("contenedor-novedades");
  const contenedorImportados = document.getElementById("contenedor-importados");

  // Función para inyectar tarjetas adaptadas al Index
  function renderSeccionHome(listaIds, contenedor) {
    if (!contenedor) return;
    contenedor.innerHTML = "";

    // Mensaje de aviso limpio si la sección fue borrada o está vacía
    if (!listaIds || listaIds.length === 0) {
      contenedor.innerHTML = `<p class="text-center text-muted w-100 my-3 small">No hay libros asignados a esta sección actualmente.</p>`;
      return;
    }

    listaIds.forEach((id) => {
      const libro = stockGeneral.find(
        (l) => l.id === parseInt(id) || l.id === String(id),
      );

      if (libro) {
        const col = document.createElement("div");
        col.className = "col";
        col.innerHTML = `
              <div class="card h-100 shadow-sm border-1 catalog-card" 
                   style="cursor: pointer;"
                   data-bs-toggle="modal" 
                   data-bs-target="#modalDetalleLibro" 
                   onclick="verDetalleLibroHome(${libro.id})">
                  <div class="catalog-img-container" style="height: 240px; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #f8f9fa;">
                      <img src="${libro.imagen}" class="catalog-card-img object-fit-contain h-100" alt="Portada de '${libro.titulo}'">
                  </div>
                  <div class="card-body d-flex flex-column p-3">
                      <span class="text-muted small fw-semibold mb-1">${libro.autor}</span>
                      <p class="card-title-book fw-bold mb-1 text-truncate" title="${libro.titulo}">${libro.titulo}</p>
                      <p class="stars-rating text-warning small mb-2">
                          <i class="bi bi-star-fill"></i>
                          <i class="bi bi-star-fill"></i>
                          <i class="bi bi-star-fill"></i>
                          <i class="bi bi-star-fill"></i>
                          <i class="bi bi-star"></i>
                      </p>
                      <p class="price fw-bold text-dark mb-3">$${libro.precio.toLocaleString("es-AR")}</p>
                      <button class="btn btn-primary btn-sm w-100 mt-auto rounded-pill" onclick="event.stopPropagation();">Ver Detalle</button>
                  </div>
              </div>
          `;
        contenedor.appendChild(col);
      }
      
    });
  }

  // Lógica dinámica para abrir el modal de detalles desde el Index
  window.verDetalleLibroHome = function (id) {
    const libro = stockGeneral.find((l) => l.id === id);
    if (!libro) return;

    document.getElementById("modalLibroImagen").src = libro.imagen;
    document.getElementById("modalLibroAutor").textContent = libro.autor;
    document.getElementById("modalLibroTitulo").textContent = libro.titulo;
    document.getElementById("modalLibroPrecio").textContent =
      `$${libro.precio.toLocaleString("es-AR")}`;
    document.getElementById("modalLibroDescripcion").textContent =
      libro.descripcion && libro.descripcion.trim() !== ""
        ? libro.descripcion
        : "Este maravilloso título no cuenta con descripción de momento.";

    const stockBadge = document.getElementById("modalLibroStock");
    const btnCarrito = document.getElementById("modalBtnAgregarCarrito");

    if (libro.stock >= 10) {
      stockBadge.textContent = `${libro.stock} unidades disponibles`;
      stockBadge.className = "badge fw-bold bg-success-subtle text-success";
      if (btnCarrito) btnCarrito.disabled = false;
    } else if (libro.stock >= 5) {
      stockBadge.textContent = `${libro.stock} unidades disponibles`;
      stockBadge.className = "badge fw-bold bg-warning-subtle text-warning";
      if (btnCarrito) btnCarrito.disabled = false;
    } else if (libro.stock >= 1) {
      stockBadge.textContent = `¡Últimas ${libro.stock} unidades!`;
      stockBadge.className = "badge fw-bold bg-danger-subtle text-danger";
      if (btnCarrito) btnCarrito.disabled = false;
    } else {
      stockBadge.textContent = "Agotado temporalmente";
      stockBadge.className = "badge fw-bold bg-secondary-subtle text-secondary";
      if (btnCarrito) btnCarrito.disabled = true;
    }
  };

  // Renderizar las secciones al entrar a la Home de manera controlada
  renderSeccionHome(destacados.recomendados, contenedorRecomendados);
  renderSeccionHome(destacados.novedades, contenedorNovedades);
  renderSeccionHome(destacados.importados, contenedorImportados);
});


// Boton reset
const btnReset = document.getElementById("btnReset");

btnReset?.addEventListener("click", () => {
  const confirmar = confirm(
    "¿Estás seguro de que querés restaurar todos los datos del sistema?",
  );

  if (!confirmar) return;

  restaurarDatos();
  location.reload();
});