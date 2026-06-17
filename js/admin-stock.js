// ==================== 1. STOCK INICIAL POR DEFECTO ====================
// Agregamos formato y tipo por defecto a los libros iniciales
const stockInicial = [
    { id: 1, titulo: "Una corte de rosas y espinas", autor: "Sarah J. Maas", categoria: "Juvenil", formato: "Tapa blanda", tipo: "Nuevo", precio: 60000, stock: 5, imagen: "img-portadas/Una corte de rosas y espinas.webp" },
    { id: 2, titulo: "Alchemised", autor: "SenLiYu", categoria: "Romance", formato: "Tapa dura", tipo: "Nuevo", precio: 70000, stock: 8, imagen: "img-portadas/Alchemised.webp" },
    { id: 3, titulo: "Orgullo y prejuicio", autor: "Jane Austen", categoria: "Clásico", formato: "Tapa blanda", tipo: "Usado", precio: 80000, stock: 12, imagen: "img-portadas/Orgullo y prejuicio.webp" },
    { id: 4, titulo: "El brillo de las luciérnagas", autor: "Paul Pen", categoria: "Terror", formato: "Ebook", tipo: "Digital", precio: 40000, stock: 3, imagen: "img-portadas/El brillo de las luciérnagas.webp" }
];

// Variable global para saber qué ID se está editando o borrando
let idProductoSeleccionado = null;

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
    tablaBody.innerHTML = ""; // Limpiar contenido previo

    productos.forEach(prod => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${prod.id}</td>
            <td>${prod.titulo}</td>
            <td>${prod.autor}</td>
            <td><span class="badge bg-secondary-subtle text-dark">${prod.categoria}</span></td>
            <td>$${prod.precio.toLocaleString('es-AR')}</td>
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
document.getElementById("btn-guardar-producto")?.addEventListener("click", () => {
    // Capturamos los datos usando los IDs del modal de NUEVO producto
    const titulo = document.getElementById("tituloStock").value.trim();
    const autor = document.getElementById("autorStock").value.trim();
    const categoria = document.getElementById("categoriaStock").value;
    const formato = document.getElementById("formatoStock").value;
    const tipo = document.getElementById("tipoStock").value;
    const precio = parseFloat(document.getElementById("precioStock").value);
    const stock = parseInt(document.getElementById("cantStock").value);
    const descripcion = document.getElementById("descripcionStock").value.trim();
    const imagenInput = document.getElementById("stockImagen");

    // Validación estricta de todos los campos obligatorios
    if (!titulo || !autor || !categoria || !formato || !tipo || isNaN(precio) || isNaN(stock)) {
        alert("Por favor, completa todos los campos requeridos.");
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

    // Crear el nuevo objeto Libro con toda la información unificada
    const nuevoLibro = {
        id: nuevoId,
        titulo: titulo,
        autor: autor,
        categoria: categoria,
        formato: formato,
        tipo: tipo,
        precio: precio,
        stock: stock,
        descripcion: descripcion,
        imagen: nombreImagen
    };

    // Guardar en el array, actualizar localStorage y refrescar la tabla
    productos.push(nuevoLibro);
    guardarProductos(productos);

    // Resetear el formulario de carga y cerrar el modal de Bootstrap de forma limpia
    document.getElementById("form-nuevo-producto").reset();
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
    modalInstance.hide();

    renderizarTablaStock();
});


// ==================== 4. ACCIÓN: CONFIGURAR ID PARA BORRAR ====================
window.configurarIdBorrar = function(id) {
    idProductoSeleccionado = id;
};

// Evento para el botón "Si, borrar" adentro de tu modalBorrar
document.querySelector("#modalBorrar .btn-outline-info")?.addEventListener("click", () => {
    if (idProductoSeleccionado !== null) {
        let productos = obtenerProductos();
        productos = productos.filter(p => p.id !== idProductoSeleccionado);
        guardarProductos(productos);
        renderizarTablaStock();
        
        // Cerrar modalBorrar automáticamente
        const modalInstance = bootstrap.Modal.getInstance(document.getElementById("modalBorrar"));
        modalInstance.hide();
    }
});


// ==================== 5. ACCIÓN: EDITAR PRODUCTO EXISTENTE ====================

// Cargar los datos viejos en los inputs correspondientes del modalEditar
window.cargarDatosEnModalEditar = function(id) {
    idProductoSeleccionado = id;
    const productos = obtenerProductos();
    const producto = productos.find(p => p.id === id);

    if (producto) {
        // Rellenamos los campos usando los IDs únicos que le pusimos al Modal de Edición
        document.getElementById("tituloEditar").value = producto.titulo;
        document.getElementById("autorEditar").value = producto.autor;
        document.getElementById("categoriaEditar").value = producto.categoria;
        document.getElementById("formatoEditar").value = producto.formato || "Tapa blanda";
        document.getElementById("tipoEditar").value = producto.tipo || "Nuevo";
        document.getElementById("precioEditar").value = producto.precio;
        document.getElementById("cantEditar").value = producto.stock;
        document.getElementById("descripcionEditar").value = producto.descripcion || "";
    }
};

// Guardar los cambios corregidos al hacer clic en el botón de confirmar del modalEditar
document.querySelector("#modalEditar .btn-outline-primary")?.addEventListener("click", () => {
    if (idProductoSeleccionado !== null) {
        let productos = obtenerProductos();
        const index = productos.findIndex(p => p.id === idProductoSeleccionado);

        if (index !== -1) {
            // Reemplazamos los datos del libro viejo por los nuevos que están en el formulario de edición
            productos[index].titulo = document.getElementById("tituloEditar").value.trim();
            productos[index].autor = document.getElementById("autorEditar").value.trim();
            productos[index].categoria = document.getElementById("categoriaEditar").value;
            productos[index].formato = document.getElementById("formatoEditar").value;
            productos[index].tipo = document.getElementById("tipoEditar").value;
            productos[index].precio = parseFloat(document.getElementById("precioEditar").value);
            productos[index].stock = parseInt(document.getElementById("cantEditar").value);
            productos[index].descripcion = document.getElementById("descripcionEditar").value.trim();

            // Guardamos el array modificado en localStorage y redibujamos la tabla
            guardarProductos(productos);
            renderizarTablaStock();

            // Cerrar el modalEditar de forma automática
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById("modalEditar"));
            modalInstance.hide();
        }
    }
});


// Inicializar el script cargando la tabla apenas se procese el documento
document.addEventListener("DOMContentLoaded", renderizarTablaStock);