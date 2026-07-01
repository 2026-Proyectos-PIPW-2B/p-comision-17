// --- CAMBIAR CONTRASEÑA (Directo en Pantalla) ---
document
  .getElementById("btnActualizarContrasena")
  .addEventListener("click", () => {
    const passActual = document.getElementById("contrasenaActual").value;
    const passNueva = document.getElementById("nuevaContrasena").value;
    const passConfirmar = document.getElementById("confirmarContrasena").value;

    // Comprobamos que ningún campo esté vacío
    if (!passActual || !passNueva || !passConfirmar) {
      alert("Por favor, completa todos los campos de contraseña.");
      return;
    }

    let usuarioLoggeado = JSON.parse(localStorage.getItem("UsuarioLoggeado"));

    // Obtener el usuario completo desde la lista de usuarios (que contiene la contraseña)
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioCompleto = usuarios.find((u) => u.id === usuarioLoggeado.id);

    if (!usuarioCompleto) {
      alert("Error: Usuario no encontrado en el sistema.");
      return;
    }

    // 1. Validar que la contraseña actual escrita coincida con la que tiene guardada el usuario
    if (passActual !== usuarioCompleto.password) {
      alert("La contraseña actual ingresada es incorrecta.");
      return;
    }

    // 2. Validar que la nueva clave no sea exactamente la misma que ya tiene
    if (passNueva === passActual) {
      alert("La nueva contraseña no puede ser igual a la contraseña actual.");
      return;
    }

    // 3. Validar que la re-escritura coincida milimétricamente con la nueva
    if (passNueva !== passConfirmar) {
      alert("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    // 4. Actualizar la contraseña en la base general de datos de usuarios
    editarUsuario(usuarioLoggeado.id, { password: passNueva });

    // 5. Limpiar por completo los inputs del formulario por seguridad
    document.getElementById("contrasenaActual").value = "";
    document.getElementById("nuevaContrasena").value = "";
    document.getElementById("confirmarContrasena").value = "";

    alert("¡Contraseña actualizada con éxito en el sistema!");
  });

// --- GUARDAR PERFIL (Nombre, Email y Foto) ---

// Cargar datos del perfil al abrir la página
document.addEventListener("DOMContentLoaded", () => {
  const usuarioLoggeado = JSON.parse(localStorage.getItem("UsuarioLoggeado"));
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioCompleto = usuarios.find((u) => u.id === usuarioLoggeado.id);

  if (usuarioCompleto) {
    document.getElementById("nombreUsuario").value = usuarioCompleto.usuario;
    document.getElementById("emailUsuario").value = usuarioCompleto.email;

    // Cargar foto si existe
    if (usuarioCompleto.foto) {
      document.getElementById("fotoPerfil").src = usuarioCompleto.foto;
    }
  }
});

// Vista previa de foto
const inputFotoPerfil = document.getElementById("inputFotoPerfil");
if (inputFotoPerfil) {
  inputFotoPerfil.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById("fotoPerfil").src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}

// Guardar cambios del perfil
const btnGuardarPerfil = document.getElementById("btnGuardarPerfil");
if (btnGuardarPerfil) {
  btnGuardarPerfil.addEventListener("click", () => {
    const usuarioLoggeado = JSON.parse(localStorage.getItem("UsuarioLoggeado"));
    const nuevoNombre = document.getElementById("nombreUsuario").value.trim();
    const nuevoEmail = document.getElementById("emailUsuario").value.trim();
    const inputFoto = document.getElementById("inputFotoPerfil");
    const imgFoto = document.getElementById("fotoPerfil");

    // Validar que al menos haya cambios
    if (!nuevoNombre && !nuevoEmail && !inputFoto.files[0]) {
      alert("Por favor, actualiza al menos un campo.");
      return;
    }

    // Preparar objeto de cambios
    const cambios = {};

    if (nuevoNombre) {
      cambios.usuario = nuevoNombre;
    }

    if (nuevoEmail) {
      cambios.email = nuevoEmail;
    }

    // Si hay foto seleccionada, convertirla a base64
    if (inputFoto.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        cambios.foto = event.target.result;
        // Guardar cambios después de leer la foto
        guardarCambiosPerfil(usuarioLoggeado, cambios);
      };
      reader.readAsDataURL(inputFoto.files[0]);
    } else {
      // Si no hay foto, guardar solo los otros cambios
      guardarCambiosPerfil(usuarioLoggeado, cambios);
    }
  });
}

function guardarCambiosPerfil(usuarioLoggeado, cambios) {
  // Actualizar en la lista general de usuarios
  editarUsuario(usuarioLoggeado.id, cambios);

  // Actualizar en UsuarioLoggeado
  const usuarioActualizado = { ...usuarioLoggeado, ...cambios };
  localStorage.setItem("UsuarioLoggeado", JSON.stringify(usuarioActualizado));

  // Limpiar input de archivo
  document.getElementById("inputFotoPerfil").value = "";

  alert("¡Cambios guardados exitosamente!");

  // Recargar la página para actualizar todos los cambios
  location.reload();
}

// --- CARGAR PERFIL EN NAVBAR ---
function cargarPerfilEnNavbar() {
  const usuarioLoggeado = JSON.parse(localStorage.getItem("UsuarioLoggeado"));
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioCompleto = usuarios.find((u) => u.id === usuarioLoggeado.id);

  if (usuarioCompleto) {
    // Mostrar nombre
    const nombreNav = document.getElementById("nombreUsuarioNav");
    if (nombreNav) {
      nombreNav.textContent = usuarioCompleto.usuario;
    }

    // Mostrar foto solo si existe
    const fotoNav = document.getElementById("fotoPerfilNav");
    if (fotoNav) {
      if (usuarioCompleto.foto) {
        fotoNav.src = usuarioCompleto.foto;
        fotoNav.style.display = "block";
      } else {
        fotoNav.style.display = "none";
      }

      // Click en foto para ir a ajustes
      fotoNav.addEventListener("click", () => {
        window.location.href = "ajustes.html";
      });
    }
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarPerfilEnNavbar);

// --- ELIMINAR FOTO DE PERFIL ---
const btnEliminarFoto = document.getElementById("btnEliminarFoto");
if (btnEliminarFoto) {
  btnEliminarFoto.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas eliminar tu foto de perfil?")) {
      const usuarioLoggeado = JSON.parse(
        localStorage.getItem("UsuarioLoggeado"),
      );

      // Actualizar en la lista general de usuarios
      editarUsuario(usuarioLoggeado.id, { foto: null });

      // Actualizar en UsuarioLoggeado
      usuarioLoggeado.foto = null;
      localStorage.setItem("UsuarioLoggeado", JSON.stringify(usuarioLoggeado));

      alert("Foto de perfil eliminada exitosamente");

      // Recargar la página para actualizar todos los cambios
      location.reload();
    }
  });
}

// --- ELIMINAR CUENTA ---
const btnConfirmarEliminarCuenta = document.getElementById(
  "btnConfirmarEliminarCuenta",
);
if (btnConfirmarEliminarCuenta) {
  btnConfirmarEliminarCuenta.addEventListener("click", () => {
    const usuarioLoggeado = JSON.parse(localStorage.getItem("UsuarioLoggeado"));
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Eliminar el usuario de la lista de usuarios
    const nuevosUsuarios = usuarios.filter((u) => u.id !== usuarioLoggeado.id);
    localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));

    // Eliminar la sesión del usuario
    localStorage.removeItem("UsuarioLoggeado");

    alert("Tu cuenta ha sido eliminada correctamente.");

    // Redirigir al login
    window.location.href = "login.html";
  });
}
