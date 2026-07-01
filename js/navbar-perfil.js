// --- CARGAR NOMBRE Y FOTO DEL USUARIO EN NAVBAR ---
function cargarPerfilEnNavbar() {
  const usuarioLoggeado = JSON.parse(localStorage.getItem("UsuarioLoggeado"));
  if (!usuarioLoggeado) return;

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
