document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("UsuarioLoggeado")) || null;
  const containers = Array.from(
    document.querySelectorAll(
      "#action-buttons, .action-buttons, .header-actions",
    ),
  );

  // --- CONTROL DEL TEMPORIZADOR DE INACTIVIDAD ---
  let inactivityTimeout = null; // Guardará la referencia para poder limpiarlo
  const INACTIVITY_TIME = 10 * 60 * 1000; // 10 minutos exactos

  function logoutPorInactividad() {
    if (localStorage.getItem("UsuarioLoggeado")) {
      localStorage.removeItem("UsuarioLoggeado");
      alert(
        "Tu sesión de Administrador ha expirado por inactividad. Por seguridad, debes iniciar sesión nuevamente.",
      );
      window.location.href = "index.html";
    }
  }

  function resetearTemporizador() {
    // CLAVE: Frenamos el temporizador anterior antes de iniciar el siguiente
    if (inactivityTimeout) {
      clearTimeout(inactivityTimeout);
    }

    // Solo activamos el temporizador si el usuario actual es administrador
    if (user && (user.rol === "admin" || user.role === "admin")) {
      inactivityTimeout = setTimeout(logoutPorInactividad, INACTIVITY_TIME);
    }
  }

  // Inicializar la escucha de eventos ÚNICAMENTE si es ADMIN
  if (user && (user.rol === "admin" || user.role === "admin")) {
    resetearTemporizador(); // Arranca el primer contador de 10 minutos al cargar la página

    // Eventos del navegador que se consideran interacción / actividad real
    const eventosInteraccion = [
      "mousemove",
      "click",
      "keypress",
      "scroll",
      "touchstart",
    ];

    eventosInteraccion.forEach((evento) => {
      window.addEventListener(evento, resetearTemporizador);
    });
  }

  // --- LÓGICA DEL DROPDOWN DINÁMICO ---
  function createAuthDropdown(userInfo) {
    const dropdownDiv = document.createElement("div");
    dropdownDiv.className = "dropdown d-inline-block";
    dropdownDiv.id = "authDropdownContainer";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className =
      "btn btn-outline-secondary dropdown-toggle d-inline-flex align-items-center";
    toggleBtn.id = "dropdownMenuAuth";
    toggleBtn.setAttribute("data-bs-toggle", "dropdown");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.style.color = "#dfa0aa";
    toggleBtn.style.borderColor = "#dfa0aa";

    if (userInfo.role === "admin" || userInfo.rol === "admin") {
      toggleBtn.innerHTML = `<i class="bi bi-person-gear me-2"></i> Admin: ${userInfo.usuario}`;
    } else {
      toggleBtn.textContent = `Hola, ${userInfo.usuario}`;
    }

    const dropdownMenu = document.createElement("ul");
    dropdownMenu.className = "dropdown-menu dropdown-menu-end text-center";
    dropdownMenu.setAttribute("aria-labelledby", "dropdownMenuAuth");

    if (userInfo.role === "admin" || userInfo.rol === "admin") {
      const adminLi = document.createElement("li");
      adminLi.innerHTML = `<a class="dropdown-item" href="admin.html">Panel de Administrador</a>`;
      dropdownMenu.appendChild(adminLi);

      const dividerLi = document.createElement("li");
      dividerLi.innerHTML = `<hr class="dropdown-divider">`;
      dropdownMenu.appendChild(dividerLi);
    }

    const logoutLi = document.createElement("li");
    const logoutLink = document.createElement("a");
    logoutLink.className = "dropdown-item text-danger fw-bold";
    logoutLink.href = "#";
    logoutLink.textContent = "Cerrar sesión";
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("UsuarioLoggeado");
      window.location.href = "index.html";
    });

    logoutLi.appendChild(logoutLink);
    dropdownMenu.appendChild(logoutLi);

    dropdownDiv.appendChild(toggleBtn);
    dropdownDiv.appendChild(dropdownMenu);

    return dropdownDiv;
  }

  // Procesar contenedores de acciones en la barra de navegación
  containers.forEach((container) => {
    const loginLink = container.querySelector('a[href="login.html"]');

    if (user) {
      if (loginLink) {
        loginLink.replaceWith(createAuthDropdown(user));
      } else if (!container.querySelector("#authDropdownContainer")) {
        container.appendChild(createAuthDropdown(user));
      }
    } else {
      const existingDropdown = container.querySelector(
        "#authDropdownContainer",
      );
      if (existingDropdown) {
        const originalLogin = document.createElement("a");
        originalLogin.href = "login.html";
        originalLogin.className = "btn btn-outline-secondary";
        originalLogin.style.color = "#dfa0aa";
        originalLogin.textContent = "Iniciar Sesión";
        existingDropdown.replaceWith(originalLogin);
      }
    }
  });

  const usuarioNombre = document.getElementById("usuario");
  if (usuarioNombre && user && user.usuario) {
    usuarioNombre.textContent = user.usuario;
  }

  const fixedBtn = document.getElementById("btn-cerrarSesion");
  if (fixedBtn) {
    fixedBtn.addEventListener("click", () => {
      localStorage.removeItem("UsuarioLoggeado");
      window.location.href = "index.html";
    });
  }
});
