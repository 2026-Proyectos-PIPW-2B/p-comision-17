function iniciarSesion() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioEncontrado = usuarios.find(
    (usuario) => usuario.usuario === username && usuario.password === password,
  );

  if (!usuarioEncontrado) {
    alert("Usuario o contraseña incorrectos");
    return;
  } else if (usuarioEncontrado.estado !== "activo") {
    alert("El usuario está deshabilitado");
    return;
  }

  const usuarioLoggeado = {
    id: usuarioEncontrado.id,
    usuario: usuarioEncontrado.usuario,
    email: usuarioEncontrado.email,
    rol: usuarioEncontrado.rol,
  };

  localStorage.setItem("UsuarioLoggeado", JSON.stringify(usuarioLoggeado));

  if (usuarioEncontrado.rol === "admin") {
    window.location.href = "admin.html";
  } else {
    // Por defecto redirigimos al índice para clientes u otros roles
    window.location.href = "index.html";
  }
}

const formLogin = document.getElementById("formLogin");
// Actualiza el campo "Tipo de usuario" mientras se escribe el usuario
const usernameInput = document.getElementById("username");
const tipoUsuarioInput = document.getElementById("tipoUsuario");

function actualizarTipoUsuario() {
  if (!usernameInput || !tipoUsuarioInput) return;
  const nombre = usernameInput.value.trim().toLowerCase();
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const encontrado = usuarios.find(
    (u) => u.usuario && u.usuario.toLowerCase() === nombre,
  );
  if (nombre === "") {
    tipoUsuarioInput.value = "";
  } else {
    tipoUsuarioInput.value = encontrado ? encontrado.rol : "No encontrado";
  }
}

if (usernameInput) {
  usernameInput.addEventListener("input", actualizarTipoUsuario);
  usernameInput.addEventListener("blur", actualizarTipoUsuario);
}

formLogin.addEventListener("submit", function (event) {
  event.preventDefault();
  iniciarSesion();
});
