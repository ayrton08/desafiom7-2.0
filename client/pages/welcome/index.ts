export function welcomePage(params) {
  const div = document.createElement("div");
  div.className = "contenedor";
  div.innerHTML = `
    <comp-header></comp-header>
    <div class="content">
      <span class="title-main">¡Bienvenido!</span>
      <span class="title-welcome">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación</span>
      <button class="location">Give Location</button>
      <div class="buttons-intro"></div>
    </div>
    `;
  const locationEl = div.querySelector(".location");
  locationEl.addEventListener("click", () => {
    location.pathname = "home";
  });
  const login = localStorage.getItem("token");
  if (!login) {
    const divButton = div.querySelector(".buttons-intro");
    divButton.innerHTML = `
      <button class="button-login" >Login</button>
      <button class="button-register" >Register</button>`;
    const loginButton = divButton.querySelector(".button-login");
    const registerButton = divButton.querySelector(".button-register");
    loginButton.addEventListener("click", () => {
      location.pathname = "login";
    });
    registerButton.addEventListener("click", () => {
      location.pathname = "register";
    });
  }
  return div;
}
