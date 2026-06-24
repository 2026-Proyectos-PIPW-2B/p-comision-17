const inputNombre = document.getElementById("inputNombre");
const inputEmail = document.getElementById("inputEmail");
const inputContraseña = document.getElementById("inputContraseña");
const errorNombre = document.getElementById("errorNombre");
const errorEmail = document.getElementById("errorEmail");
const errorContraseña = document.getElementById("errorContraseña");
const formUsuario = document.getElementById("formUsuario");
const formClientes = document.getElementById("formClientes");
const inputBuscarUsuario = document.getElementById("inputBuscarUsuario");
const btnBuscarUsuario = document.getElementById("btnBuscarUsuario");
let adminIdABorrar = null; // a quien voy a eliminar
let idUsuarioSeleccionado = null; // quien edito
let clienteIdABorrar = null; // cliente a borrar

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// validar usuarios no repetidos

function existeUsuarioConNombre(nombre, idExcluido = null) {
  const usuarios = obtenerUsuarios();
  return usuarios.some((usuario) => {
    if (idExcluido && usuario.id === idExcluido) return false;
    return usuario.usuario.toLowerCase() === nombre.toLowerCase();
  });
}

function existeUsuarioConEmail(email, idExcluido = null) {
  const usuarios = obtenerUsuarios();
  return usuarios.some((usuario) => {
    if (idExcluido && usuario.id === idExcluido) return false;
    return usuario.email.toLowerCase() === email.toLowerCase();
  });
}

function validarUnicidad(nombre, email, idExcluido = null) {
  let valido = true;

  if (existeUsuarioConNombre(nombre, idExcluido)) {
    mostrarError(
      inputNombre,
      errorNombre,
      "El nombre de usuario ya está en uso",
    );
    valido = false;
  } else {
    mostrarExito(inputNombre, errorNombre);
  }

  if (existeUsuarioConEmail(email, idExcluido)) {
    mostrarError(inputEmail, errorEmail, "El email ya está en uso");
    valido = false;
  } else {
    mostrarExito(inputEmail, errorEmail);
  }

  return valido;
}

// guardar usuarios nuevos en el localSotorage

function guardarUsuario(rol) {
  // Validar campos antes de guardar (protección extra)
  if (typeof validarNombre === "function" && !validarNombre()) return false;
  if (typeof validarEmail === "function" && !validarEmail()) return false;
  if (typeof validarContraseña === "function" && !validarContraseña()) return false;

  const usuarios = obtenerUsuarios();
  const nombre = inputNombre.value.trim();
  const email = inputEmail.value.trim();

  if (!validarUnicidad(nombre, email)) {
    return false;
  }

  const nuevoUsuario = {
    id: Date.now(),
    usuario: nombre,
    email: email,
    password: inputContraseña.value,
    rol: rol,
    estado: "activo",
  };

  usuarios.push(nuevoUsuario);

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  return true;
}

function borrarUsuario(id) {
  const usuarios = obtenerUsuarios();
  const nuevosUsuarios = usuarios.filter((usuario) => usuario.id !== id);
  localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
}

function limpiarFormulario() {
  if (formUsuario) formUsuario.reset();
  if (formClientes) formClientes.reset();

  if (inputNombre) inputNombre.classList.remove("is-valid", "is-invalid");
  if (inputEmail) inputEmail.classList.remove("is-valid", "is-invalid");
  if (inputContraseña)
    inputContraseña.classList.remove("is-valid", "is-invalid");

  if (errorNombre) errorNombre.textContent = "";
  if (errorEmail) errorEmail.textContent = "";
  if (errorContraseña) errorContraseña.textContent = "";
}

// crear admin
if (formUsuario) {
  formUsuario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreValido = validarNombre();
    const emailValido = validarEmail();
    const contraseñaValida = validarContraseña();

    if (nombreValido && emailValido && contraseñaValida) {
      const guardado = guardarUsuario("admin");
      if (guardado) {
        cargarAdmins();
        alert("Administrador creado exitosamente");
        limpiarFormulario();
      }
    }
  });
}

// crear Cliente

if (formClientes) {
  formClientes.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreValido = validarNombre();
    const emailValido = validarEmail();
    const contraseñaValida = validarContraseña();

    if (nombreValido && emailValido && contraseñaValida) {
      const guardado = guardarUsuario("cliente");
      if (guardado) {
        cargarClientes();
        alert("Cliente añadido exitosamente");
        limpiarFormulario();
      }
    }
  });
}

// carga dinámica tabla de admins

function cargarAdmins(busqueda = "") {
  const tablaAdmin = document.getElementById("tablaAdmin");
  if (!tablaAdmin) return;
  const usuarios = obtenerUsuarios();
  const textoBusqueda = busqueda.toLowerCase().trim();
  const admins = usuarios.filter((usuario) => {
    if (usuario.rol !== "admin") return false;
    if (!textoBusqueda) return true;
    return (
      usuario.usuario.toLowerCase().includes(textoBusqueda) ||
      usuario.email.toLowerCase().includes(textoBusqueda)
    );
  });

  tablaAdmin.innerHTML = "";

  if (admins.length === 0) {
    tablaAdmin.innerHTML = `
      <tr>
        <td colspan="4" class="text-center">No hay administradores registrados</td>
      </tr>
    `;
    return;
  }

  // render filas

  admins.forEach((admin) => {
    tablaAdmin.innerHTML += `
        <tr>
          <td>${admin.id}</td>
          <td>${admin.usuario}</td>
          <td>${admin.email}</td>
          <td class="text-center">
            <button
              class="btn btn-outline-primary btn-sm me-2 bi bi-trash btn-borrar"
              data-id="${admin.id}"
              data-rol="admin"
              data-bs-toggle="modal"
              data-bs-target="#modalBorrar"
            ></button>
            <button
              class="btn btn-outline-primary btn-sm bi bi-pencil btn-editar"
              data-id="${admin.id}"
              data-rol="admin"
              data-bs-toggle="modal"
              data-bs-target="#modalEditar"
            ></button>
          </td>
        </tr>
      `;
  });
}

if (document.getElementById("tablaAdmin")) {
  cargarAdmins();
}

// carga dinámica tabla de clientes

function cargarClientes(busqueda = "") {
  const tablaClientes = document.getElementById("tablaClientes");
  if (!tablaClientes) return;
  const usuarios = obtenerUsuarios();
  const textoBusqueda = busqueda.toLowerCase().trim();
  const clientes = usuarios.filter((usuario) => {
    if (usuario.rol !== "cliente") return false;
    if (!textoBusqueda) return true;
    return (
      usuario.usuario.toLowerCase().includes(textoBusqueda) ||
      usuario.email.toLowerCase().includes(textoBusqueda)
    );
  });

  tablaClientes.innerHTML = "";

  if (clientes.length === 0) {
    tablaClientes.innerHTML = `
            <tr>
              <td colspan= "7" class="text-center"> No hay clientes registrados </td>
            </tr>
        `;

    return;
  }

  // render filas

  clientes.forEach((cliente) => {
    tablaClientes.innerHTML += `
        <tr>
            <td>${cliente.id}</td>
            <td>${cliente.usuario}</td>
            <td>${cliente.email}</td>
            <td>0</td>
            <td>-</td>
            <td>
              <div class="form-check form-switch m-0">
              <label class="form-check-label">
              <input type="checkbox" class="form-check-input" data-id="${cliente.id}" ${cliente.estado === "activo" ? "checked" : ""}>
              </label>
            </td>
            <td class="text-center">
            <button
              class="btn btn-outline-primary btn-sm me-2 bi bi-trash btn-borrar"
              data-id="${cliente.id}"
              data-rol="cliente"
              data-bs-toggle="modal"
              data-bs-target="#modalBorrar"
            ></button>
            <button
              class="btn btn-outline-primary btn-sm bi bi-pencil btn-editar"
              data-id="${cliente.id}"
              data-rol="cliente"
              data-bs-toggle="modal"
              data-bs-target="#modalEditar"
            ></button>
          </td>
        </tr>
        `;
  });
}

if (document.getElementById("tablaClientes")) {
  cargarClientes();
}

//estadoUsuario

const tablaClientesEl = document.getElementById("tablaClientes");
if (tablaClientesEl) {
  tablaClientesEl.addEventListener("change", (e) => {
    const target = e.target;
    if (!target) return;
    if (
      target.tagName === "INPUT" &&
      target.type === "checkbox" &&
      target.classList.contains("form-check-input")
    ) {
      const id = Number(target.dataset.id);
      const isChecked = !!target.checked;
      estadoUsuario(id, isChecked);
    }
  });
}

function estadoUsuario(id, isChecked) {
  const usuarios = obtenerUsuarios();
  const nuevosUsuarios = usuarios.map((cliente) => {
    if (cliente.id === id) {
      return {
        ...cliente,
        estado: isChecked ? "activo" : "inactivo",
      };
    }
    return cliente;
  });

  localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
  cargarClientes();
}

// buscar usuario

if (btnBuscarUsuario) {
  btnBuscarUsuario.addEventListener("click", () => {
    cargarAdmins(inputBuscarUsuario ? inputBuscarUsuario.value : "");
  });
}

if (inputBuscarUsuario) {
  inputBuscarUsuario.addEventListener("input", () => {
    cargarAdmins(inputBuscarUsuario.value);
  });
}

// buscar cliente

if (btnBuscarUsuario) {
  btnBuscarUsuario.addEventListener("click", () => {
    cargarClientes(inputBuscarUsuario ? inputBuscarUsuario.value : "");
  });
}

if (inputBuscarUsuario) {
  inputBuscarUsuario.addEventListener("input", () => {
    cargarClientes(inputBuscarUsuario.value);
  });
}

// modals tabla

document.addEventListener("click", (e) => {
  const boton = e.target.closest("button");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  if (!id) return;

  const rol = boton.dataset.rol;

  if (boton.classList.contains("btn-borrar")) {
    if (rol === "admin") {
      adminIdABorrar = id;
      clienteIdABorrar = null;
    } else if (rol === "cliente") {
      clienteIdABorrar = id;
      adminIdABorrar = null;
    } else {
      // si no se especifica rol, asignamos a ambos por compatibilidad
      adminIdABorrar = id;
      clienteIdABorrar = id;
    }
    const modalBorrar = document.getElementById("modalBorrar");
    if (modalBorrar) {
      modalBorrar.dataset.id = id;
      modalBorrar.dataset.rol = rol || "";
    }
  }

  if (boton.classList.contains("btn-editar")) {
    idUsuarioSeleccionado = id;
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find((u) => u.id === idUsuarioSeleccionado);
    if (!usuario) return;
    document.getElementById("editarNombre").value = usuario.usuario;
    document.getElementById("editarEmail").value = usuario.email;
    const modalEditar = document.getElementById("modalEditar");
    if (modalEditar) {
      modalEditar.dataset.id = id;
    }
  }
});

const confirmarBorrarBtn = document.getElementById("confirmarBorrarBtn");
if (confirmarBorrarBtn) {
  confirmarBorrarBtn.addEventListener("click", () => {
    if (!adminIdABorrar && !clienteIdABorrar) return;
    if (adminIdABorrar) borrarUsuario(adminIdABorrar);
    else if (clienteIdABorrar) borrarUsuario(clienteIdABorrar);
    cargarAdmins();
    cargarClientes();
    const modalInstance = bootstrap.Modal.getInstance(
      document.getElementById("modalBorrar"),
    );
    if (modalInstance) {
      modalInstance.hide();
    }
    adminIdABorrar = null;
    clienteIdABorrar = null;
  });
}

// Limpiar IDs si se cierra el modal sin confirmar
const modalBorrarEl = document.getElementById("modalBorrar");
if (modalBorrarEl) {
  modalBorrarEl.addEventListener("hidden.bs.modal", () => {
    adminIdABorrar = null;
    clienteIdABorrar = null;
  });
}

function editarUsuario(id, cambios) {
  const usuarios = obtenerUsuarios();
  const nuevosUsuarios = usuarios.map((usuario) => {
    if (usuario.id !== id) return usuario;
    return {
      ...usuario,
      ...cambios,
    };
  });
  localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
}

const confirmarEditarBtn = document.getElementById("confirmarEditarBtn");
if (confirmarEditarBtn) {
  confirmarEditarBtn.addEventListener("click", () => {
    if (!idUsuarioSeleccionado) return;
    const nombreEditado = document.getElementById("editarNombre").value.trim();
    const emailEditado = document.getElementById("editarEmail").value.trim();

    if (!nombreEditado || !emailEditado) return;
    if (!validarUnicidad(nombreEditado, emailEditado, idUsuarioSeleccionado))
      return;

    editarUsuario(idUsuarioSeleccionado, {
      usuario: nombreEditado,
      email: emailEditado,
    });
    cargarAdmins();
    cargarClientes();

    const modalInstance = bootstrap.Modal.getInstance(
      document.getElementById("modalEditar"),
    );
    if (modalInstance) {
      modalInstance.hide();
    }

    idUsuarioSeleccionado = null;
  });
}
