document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("UsuarioLoggeado")) || null;
  const containers = Array.from(
    document.querySelectorAll(
      "#action-buttons, .action-buttons, .header-actions",
    ),
  );

  function makeLogoutBtn() {
    const b = document.createElement("button");
    b.type = "button";
    b.id = "btnCerrarSesionTop";
    b.className = "btn btn-outline-primary";
    b.textContent = "Cerrar sesión";
    b.addEventListener("click", () => {
      localStorage.removeItem("UsuarioLoggeado");
      window.location.href = "index.html";
    });
    return b;
  }

  // Procesar contenedores de acciones (headers públicos)
  containers.forEach((container) => {
    const loginLink = container.querySelector('a[href="login.html"]');
    if (user) {
      if (loginLink) loginLink.replaceWith(makeLogoutBtn());
      else if (!container.querySelector("#btnCerrarSesionTop"))
        container.appendChild(makeLogoutBtn());
    } else {
      const existing = container.querySelector("#btnCerrarSesionTop");
      if (existing) existing.remove();
    }
  });

  // Si existe botón fijo en páginas admin/ajustes con id btn-cerrarSesion, enlazarlo
  const fixedBtn = document.getElementById("btn-cerrarSesion");
  if (fixedBtn) {
    fixedBtn.addEventListener("click", () => {
      localStorage.removeItem("UsuarioLoggeado");
      window.location.href = "index.html";
    });
  }
});
