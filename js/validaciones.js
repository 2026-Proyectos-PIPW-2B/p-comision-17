window.addEventListener("load", function () {
  const formUsuario = document.getElementById("formUsuario");
  if (!formUsuario) return;

  formUsuario.addEventListener("submit", function (event) {
    event.preventDefault();
    limpiarEstados();
    if (validarFormulario()) {
      guardarAdmin();
      renderAdmins();
      guardarCliente();
      alert("Usuario creado exitosamente");
      formUsuario.reset();
    }
  });
});

const tablaAdmin = document.getElementById('tablaAdmin');
tablaAdmin.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.classList.contains('bi-trash')) {
    // preparar modalBorrar (ej: mostrar nombre y guardar id en modal.dataset.id)
    document.getElementById('modalBorrar').dataset.id = id;
  }
  if (btn.classList.contains('bi-pencil')) {
    // cargar datos del admin en los inputs del modalEditar y guardar id
    const usuarios = JSON.parse(localStorage.getItem('Usuarios')) || [];
    const admin = usuarios.find(u => String(u.id) === String(id));
    if (!admin) return;
    document.getElementById('editarNombre').value = admin.usuario;
    document.getElementById('editarEmail').value = admin.email;
    document.getElementById('modalEditar').dataset.id = id;
  }
});

function limpiarEstados() {
  const inputs = document.querySelectorAll(".form-control, .form-select");

  for (const input of inputs) {
    input.classList.remove("is-invalid");
    input.classList.remove("is-valid");
  }
}

function validarFormulario() {
  const esNombreValido = validarNombre();
  const esContraseñaValida = validarContraseña();
  const esEmailValido = validarEmail();
  return esNombreValido && esContraseñaValida && esEmailValido;
}

function validarNombre() {
  const inputNombre = document.getElementById("inputNombre");
  const errorNombre = document.getElementById("errorNombre");

  if (validator.isEmpty(inputNombre.value.trim())) {
    mostrarError(inputNombre, errorNombre, "El nombre no puede estar vacío");
    return false;
  } else if (!validator.isLength(inputNombre.value.trim(), { min: 3 })) {
    mostrarError(
      inputNombre,
      errorNombre,
      "El nombre debe tener al menos 3 caracteres",
    );
    return false;
  } else {
    mostrarExito(inputNombre, errorNombre);
    return true;
  }
}

function validarContraseña() {
  const inputContraseña = document.getElementById("inputContraseña");
  const errorContraseña = document.getElementById("errorContraseña");
  if (!validator.isLength(inputContraseña.value, { min: 8 })) {
    mostrarError(
      inputContraseña,
      errorContraseña,
      "La contraseña debe tener al menos 8 caracteres",
    );
    return false;
  } else {
    mostrarExito(inputContraseña, errorContraseña);
    return true;
  }
}

function validarEmail() {
  const inputEmail = document.getElementById("inputEmail");
  const errorEmail = document.getElementById("errorEmail");
  if (!validator.isEmail(inputEmail.value.trim())) {
    mostrarError(inputEmail, errorEmail, "El email no es válido");
    return false;
  } else {
    mostrarExito(inputEmail, errorEmail);
    return true;
  }
}

function mostrarError(input, divError, mensaje) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");

  document.getElementById(divError.id).textContent = mensaje;
}

function mostrarExito(input, divError) {
  input.classList.add("is-valid");
  input.classList.remove("is-invalid");
}

function guardarAdmin() {
  let usuarios = JSON.parse(localStorage.getItem("Usuarios")) || [];

  const nombre = document.getElementById("inputNombre").value;
  const contraseña = document.getElementById("inputContraseña").value;
  const email = document.getElementById("inputEmail").value;

  const nuevoAdmin = {
    id: usuarios.length + 1,
    usuario: nombre,
    password: contraseña,
    email: email,
    rol: "admin",
    estado: "activo",
  };
  usuarios.push(nuevoAdmin);
  localStorage.setItem("Usuarios", JSON.stringify(usuarios));
}

function renderAdmins() {
  const tablaAdmin = document.getElementById("tablaAdmin");
  const usuarios = JSON.parse(localStorage.getItem("Usuarios")) || [];
  const admins = usuarios.filter((u) => u.rol === "admin");
  tablaAdmin.innerHTML = "";
  admins.forEach((admin) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
            <td>${admin.id}</td>
            <td>${admin.usuario}</td>
            <td>${admin.email}</td>
            <td class="text-center">
                <button
                    class="btn btn-outline-primary btn-sm me-2 bi bi-trash"
                    data-bs-toggle="modal"
                    data-bs-target="#modalBorrar"
                ></button>

                <button
                    class="btn btn-outline-primary btn-sm bi bi-pencil"
                    data-bs-toggle="modal"
                    data-bs-target="#modalEditar"
                ></button>
            </td>
        `;
    tablaAdmin.appendChild(fila);
  });
}

function guardarCliente() {
  let usuarios = JSON.parse(localStorage.getItem("Usuarios")) || [];

  const nombre = document.getElementById("inputNombre").value;
  const contraseña = document.getElementById("inputContraseña").value;
  const email = document.getElementById("inputEmail").value;

  const nuevoCliente = {
    id: usuarios.length + 1,
    usuario: nombre,
    password: contraseña,
    email: email,
    rol: "cliente",
    estado: "activo",
  };
  usuarios.push(nuevoCliente);
  localStorage.setItem("Usuarios", JSON.stringify(usuarios));
}
