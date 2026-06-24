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

  if (validator.isEmpty(inputContraseña.value.trim())) {
    mostrarError(
      inputContraseña,
      errorContraseña,
      "La contraseña es obligatoria",
    );
    return false;
  }

  if (!validator.isLength(inputContraseña.value, { min: 8 })) {
    mostrarError(
      inputContraseña,
      errorContraseña,
      "La contraseña debe tener al menos 8 caracteres",
    );
    return false;
  }

  mostrarExito(inputContraseña, errorContraseña);
  return true;
}

function validarEmail() {
  const inputEmail = document.getElementById("inputEmail");
  const errorEmail = document.getElementById("errorEmail");

  if (validator.isEmpty(inputEmail.value.trim())) {
    mostrarError(inputEmail, errorEmail, "El email es obligatorio");
    return false;
  }

  if (!validator.isEmail(inputEmail.value.trim())) {
    mostrarError(inputEmail, errorEmail, "El email no es válido");
    return false;
  }

  mostrarExito(inputEmail, errorEmail);
  return true;
}

function mostrarError(input, divError, mensaje) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");

  divError.textContent = mensaje;
}

function mostrarExito(input, divError) {
  input.classList.add("is-valid");
  input.classList.remove("is-invalid");

  divError.textContent = "";
}

