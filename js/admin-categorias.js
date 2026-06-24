document.addEventListener("DOMContentLoaded", () => {
  const tablaBody = document.getElementById("tabla-categorias-body");

  const selectLibros = document.getElementById("librosSeleccionados");

  const buscadorModal = document.getElementById("buscadorLibrosModal");

  const btnGuardarNuevo = document.getElementById(
    "btn-guardar-categoria-especial",
  );

  const formCategoria = document.getElementById("form-nueva-categoria");

  let idCategoriaSeleccionada = null;

  const categoriasIniciales = [
    {
      id: 1,

      nombre: "Novela",

      descripcion: "Libros de ficción",

      estado: "Activa",

      tipoIndex: "",
    },

    {
      id: 2,

      nombre: "Infantil",

      descripcion: "Libros para niños",

      estado: "Activa",

      tipoIndex: "",
    },
  ];

  function obtenerCategorias() {
    const datos = localStorage.getItem("librarium_categorias");

    if (!datos) {
      localStorage.setItem(
        "librarium_categorias",

        JSON.stringify(categoriasIniciales),
      );

      return categoriasIniciales;
    }

    return JSON.parse(datos);
  }

  function guardarCategorias(lista) {
    localStorage.setItem("librarium_categorias", JSON.stringify(lista));
  }

  function obtenerLibrosStock() {
    const stock = localStorage.getItem("librarium_stock");

    return stock ? JSON.parse(stock) : [];
  }

  function obtenerDestacados() {
    return localStorage.getItem("librarium_destacados")
      ? JSON.parse(localStorage.getItem("librarium_destacados"))
      : { recomendados: [], novedades: [], importados: [] };
  }

  function cargarLibrosAgrupadosEnSelect(selectElement, idsSeleccionados = []) {
    if (!selectElement) return;

    const libros = obtenerLibrosStock();

    selectElement.innerHTML = "";

    if (libros.length === 0) {
      const option = document.createElement("option");

      option.disabled = true;

      option.text = "No hay libros cargados en el stock.";

      selectElement.appendChild(option);

      return;
    }

    const grupos = {};

    const idsSeleccionadosSet = new Set(idsSeleccionados.map(String));
    const librosYaMostrados = new Set();

    libros.forEach((libro) => {
      if (librosYaMostrados.has(String(libro.id))) return;

      librosYaMostrados.add(String(libro.id));

      const subcategorias = Array.isArray(libro.categoria)
        ? libro.categoria
        : [libro.categoria];

      subcategorias.forEach((subcat) => {
        if (!grupos[subcat]) {
          grupos[subcat] = [];
        }

        grupos[subcat].push(libro);
      });
    });

    Object.keys(grupos)

      .sort()

      .forEach((subcat) => {
        const optgroup = document.createElement("optgroup");

        optgroup.label = `📁 Colección: ${subcat}`;

        grupos[subcat].forEach((libro) => {
          const option = document.createElement("option");

          option.value = libro.id;

          option.text = `${libro.titulo} — ${libro.autor}`;

          option.selected = idsSeleccionadosSet.has(String(libro.id));

          optgroup.appendChild(option);
        });

        selectElement.appendChild(optgroup);
      });
  }

  // --- RENDERIZAR TABLA DE CATEGORÍAS ---

  function renderizarTabla() {
    if (!tablaBody) return;

    const lista = obtenerCategorias();

    tablaBody.innerHTML = "";

    lista.forEach((cat) => {
      const isChecked = cat.estado === "Activa" ? "checked" : "";

      const fila = document.createElement("tr");

      fila.innerHTML = `

  <td>${cat.id}</td>

  <td>${cat.nombre}</td>

  <td>${cat.descripcion || "Sin descripción"}</td>

  <td class="text-center">

    <button class="btn btn-outline-primary btn-sm me-2 bi bi-trash"

            data-bs-toggle="modal"

            data-bs-target="#modalBorrar"

            onclick="configurarIdAccion(${cat.id})">

    </button>

    <button class="btn btn-outline-primary btn-sm bi bi-pencil"

            data-bs-toggle="modal"

            data-bs-target="#modalEditar"

            onclick="cargarDatosEnModalEditar(${cat.id})">

    </button>

  </td>

`;

      tablaBody.appendChild(fila);
    });
  }

  window.configurarIdAccion = function (id) {
    idCategoriaSeleccionada = id;
  };

  window.alternarEstadoCategoria = function (id) {
    let lista = obtenerCategorias();

    const index = lista.findIndex((c) => c.id === id);

    if (index !== -1) {
      lista[index].estado =
        lista[index].estado === "Activa" ? "Inactiva" : "Activa";

      guardarCategorias(lista);
    }
  };

  // --- PROCESAR BORRADO ---

  document

    .querySelector("#modalBorrar .btn-outline-info")

    ?.addEventListener("click", () => {
      if (idCategoriaSeleccionada !== null) {
        let lista = obtenerCategorias();

        const categoriaABorrar = lista.find(
          (c) => c.id === idCategoriaSeleccionada,
        );

        if (categoriaABorrar) {
          const destacados = localStorage.getItem("librarium_destacados")
            ? JSON.parse(localStorage.getItem("librarium_destacados"))
            : { recomendados: [], novedades: [], importados: [] };

          if (categoriaABorrar.tipoIndex) {
            destacados[categoriaABorrar.tipoIndex] = [];
          } else {
            const nombreNormalizado = categoriaABorrar.nombre

              .toLowerCase()

              .normalize("NFD")

              .replace(/[\u0300-\u036f]/g, "");

            if (nombreNormalizado.includes("recomendado"))
              destacados.recomendados = [];

            if (nombreNormalizado.includes("novedad"))
              destacados.novedades = [];

            if (nombreNormalizado.includes("importado"))
              destacados.importados = [];
          }

          localStorage.setItem(
            "librarium_destacados",

            JSON.stringify(destacados),
          );
        }

        lista = lista.filter((c) => c.id !== idCategoriaSeleccionada);

        guardarCategorias(lista);

        renderizarTabla();

        const modalInstance = bootstrap.Modal.getInstance(
          document.getElementById("modalBorrar"),
        );

        if (modalInstance) modalInstance.hide();

        idCategoriaSeleccionada = null;
      }
    });

  // --- RENDERS DINÁMICOS DEL SELECT CON SUBCATEGORÍAS ---

  function cargarLibrosEnSelect() {
    cargarLibrosAgrupadosEnSelect(selectLibros);
  }

  // --- CARGAR DATOS EN MODAL EDITAR ---

  window.cargarDatosEnModalEditar = (id) => {
    idCategoriaSeleccionada = id;

    const lista = obtenerCategorias();

    const cat = lista.find((c) => c.id === id);

    if (cat) {
      document.getElementById("editNombreCategoria").value =
        cat.tipoIndex || "";

      document.getElementById("editDescripcion").value = cat.descripcion || "";

      const selectEdit = document.getElementById("editLibrosSeleccionados");

      selectEdit.innerHTML = "";

      const destacados = obtenerDestacados();

      const idsSeleccionados = destacados[cat.tipoIndex] || [];

      cargarLibrosAgrupadosEnSelect(selectEdit, idsSeleccionados);
    }
  };

  // --- FILTRO EN TIEMPO REAL DEL BUSCADOR DEL MODAL ---

  buscadorModal?.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    const optgroups = selectLibros.getElementsByTagName("optgroup");

    Array.from(optgroups).forEach((group) => {
      const options = group.getElementsByTagName("option");

      let matchesEnGrupo = 0;

      Array.from(options).forEach((option) => {
        const coincide = option.text.toLowerCase().includes(query);

        if (coincide) {
          option.style.display = "";

          matchesEnGrupo++;
        } else {
          option.style.display = "none";
        }
      });

      if (matchesEnGrupo === 0 && query !== "") {
        group.style.display = "none";
      } else {
        group.style.display = "";
      }
    });
  });

  // --- BUSCADOR PARA EL MODAL EDITAR ---

  document.getElementById("editBuscador")?.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    const select = document.getElementById("editLibrosSeleccionados");

    const optgroups = select.getElementsByTagName("optgroup");

    Array.from(optgroups).forEach((group) => {
      let visibles = 0;

      Array.from(group.getElementsByTagName("option")).forEach((opt) => {
        const match = opt.text.toLowerCase().includes(query);

        opt.style.display = match ? "" : "none";

        if (match) visibles++;
      });

      group.style.display = visibles === 0 && query !== "" ? "none" : "";
    });
  });

  // Escuchar cambio en la categoría seleccionada

  document

    .getElementById("nombreCategoria")

    ?.addEventListener("change", (e) => {
      const categoriaSeleccionada = e.target.value;

      const destacados = localStorage.getItem("librarium_destacados")
        ? JSON.parse(localStorage.getItem("librarium_destacados"))
        : { recomendados: [], novedades: [], importados: [] };

      const idsAsignados = destacados[categoriaSeleccionada] || [];

      if (buscadorModal) {
        buscadorModal.value = "";

        buscadorModal.dispatchEvent(new Event("input"));
      }

      const opcionesCompletas = selectLibros.getElementsByTagName("option");

      Array.from(opcionesCompletas).forEach((option) => {
        option.selected = idsAsignados

          .map(String)

          .includes(String(option.value));
      });
    });

  // --- GUARDAR CAMBIOS DE ASIGNACIÓN ---

  btnGuardarNuevo?.addEventListener("click", () => {
    const selectNombre = document.getElementById("nombreCategoria");

    const valorCategoria = selectNombre.value;

    const txtDescripcion = document

      .getElementById("descripcionCategoria")

      .value.trim();

    if (!valorCategoria) {
      alert("Por favor, selecciona una categoría del Index.");

      return;
    }

    const librosElegidos = Array.from(selectLibros.selectedOptions).map((opt) =>
      parseInt(opt.value),
    );

    if (librosElegidos.length === 0) {
      alert("Debes seleccionar al menos un libro.");

      return;
    }

    const destacados = localStorage.getItem("librarium_destacados")
      ? JSON.parse(localStorage.getItem("librarium_destacados"))
      : { recomendados: [], novedades: [], importados: [] };

    destacados[valorCategoria] = librosElegidos;

    localStorage.setItem("librarium_destacados", JSON.stringify(destacados));

    const lista = obtenerCategorias();

    let idMasAlto = 0;

    for (let i = 0; i < lista.length; i++) {
      if (lista[i].id > idMasAlto) idMasAlto = lista[i].id;
    }

    const textoEstetico = selectNombre.options[selectNombre.selectedIndex].text;

    const nuevaFilaCat = {
      id: idMasAlto + 1,

      nombre: textoEstetico,

      descripcion:
        txtDescripcion || `Libros asignados a la sección ${textoEstetico}`,

      estado: document.getElementById("estado").value,

      tipoIndex: valorCategoria,
    };

    lista.push(nuevaFilaCat);

    guardarCategorias(lista);

    renderizarTabla();

    if (formCategoria) formCategoria.reset();

    if (buscadorModal) buscadorModal.value = "";

    const modalInstance = bootstrap.Modal.getInstance(
      document.getElementById("exampleModal"),
    );

    if (modalInstance) modalInstance.hide();
  });

  // --- PROCESAR EDICIÓN CONFIRMADA ---

  document
    .getElementById("btn-guardar-edicion")
    ?.addEventListener("click", () => {
      let lista = obtenerCategorias();
      let destacados = obtenerDestacados();
      const index = lista.findIndex((c) => c.id === idCategoriaSeleccionada);

      if (index !== -1) {
        const selectNombre = document.getElementById("editNombreCategoria");
        const nuevoTipo = selectNombre.value;
        const tipoAnterior = lista[index].tipoIndex;

        const selectEdit = document.getElementById("editLibrosSeleccionados");
        const librosElegidos = [
          ...new Set(
            Array.from(selectEdit.selectedOptions).map((o) =>
              parseInt(o.value),
            ),
          ),
        ];

        if (tipoAnterior && tipoAnterior !== nuevoTipo) {
          destacados[tipoAnterior] = [];
        }

        destacados[nuevoTipo] = librosElegidos;

        lista[index].nombre =
          selectNombre.options[selectNombre.selectedIndex].text;
        lista[index].descripcion =
          document.getElementById("editDescripcion").value;
        lista[index].tipoIndex = nuevoTipo;

        guardarCategorias(lista);
        localStorage.setItem(
          "librarium_destacados",
          JSON.stringify(destacados),
        );

        renderizarTabla();
        bootstrap.Modal.getInstance(
          document.getElementById("modalEditar"),
        )?.hide();
      }
    });

  document

    .getElementById("exampleModal")

    ?.addEventListener("show.bs.modal", () => {
      cargarLibrosEnSelect();

      if (buscadorModal) {
        buscadorModal.value = "";

        buscadorModal.dispatchEvent(new Event("input"));
      }
    });

  renderizarTabla();

  cargarLibrosEnSelect();
});
