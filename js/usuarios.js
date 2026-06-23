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
let adminIdABorrar = null;  // a quien voy a eliminar
let idUsuarioSeleccionado = null; // quien edito


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
  formUsuario.reset();

  inputNombre.classList.remove("is-valid", "is-invalid");
  inputEmail.classList.remove("is-valid", "is-invalid");
  inputContraseña.classList.remove("is-valid", "is-invalid");

  errorNombre.textContent = "";
  errorEmail.textContent = "";
  errorContraseña.textContent = "";
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

// carga dinámica tabla de admins

function cargarAdmins(busqueda = "") {
  const tablaAdmin = document.getElementById("tablaAdmin");
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

  console.log("admins:", admins);
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
              data-bs-toggle="modal"
              data-bs-target="#modalBorrar"
            ></button>
            <button
              class="btn btn-outline-primary btn-sm bi bi-pencil btn-editar"
              data-id="${admin.id}"
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

// modals tabla

document.addEventListener("click", (e) => {
  const boton = e.target.closest("button");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  if (!id) return;

  if (boton.classList.contains("btn-borrar")) {
    adminIdABorrar = id;
    const modalBorrar = document.getElementById("modalBorrar");
    if (modalBorrar) {
      modalBorrar.dataset.id = id;
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
    if (!adminIdABorrar) return;
    borrarUsuario(adminIdABorrar);
    cargarAdmins();
    const modalInstance = bootstrap.Modal.getInstance(
      document.getElementById("modalBorrar"),
    );
    if (modalInstance) {
      modalInstance.hide();
    }
    adminIdABorrar = null;
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

    const modalInstance = bootstrap.Modal.getInstance(
      document.getElementById("modalEditar"),
    );
    if (modalInstance) {
      modalInstance.hide();
    }

    idUsuarioSeleccionado = null;
  });
}
