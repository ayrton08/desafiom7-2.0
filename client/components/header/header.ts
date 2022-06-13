import { mainState } from "../../state";
export function header() {
  class Header extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    render() {
      this.attachShadow({ mode: "open" });
      const div = document.createElement("header");
      div.className = "root";
      const stateLocal = JSON.parse(localStorage.getItem("token"));
      console.log("state local storage",stateLocal)
      if (!stateLocal) {
        div.innerHTML = `
        <div class="container-header">
        <div class="izquierda">
          <a href="./index.html">
              <span class="logo">🐶</span>
          </a>
        </div>
        <div class="derecha">
           <button class="abre-ventana">☰</button>
        </div>
        </div>
        <div class="menu-modal">
        <button class="modal-close">❌</button>
          <a class="goto-login">Sing in to you account</a>
          <a class="goto-register">Creat an account</a>
        </div>
      ${this.getStyles()}`;
        this.shadowRoot.appendChild(div);
        console.log("entre al primer if");
        const goToLogin = this.shadowRoot.querySelector(".goto-login");
        goToLogin.addEventListener("click", () => {
          location.pathname = "login";
        });

        const goToRegister = this.shadowRoot.querySelector(".goto-register");
        goToRegister.addEventListener("click", () => {
          location.pathname = "register";
        });

        const openMenu = this.shadowRoot.querySelector(".abre-ventana");
        const closeMenu = this.shadowRoot.querySelector(".modal-close");
        openMenu.addEventListener("click", () => {
          const container = this.shadowRoot.querySelector(".menu-modal");
          container["style"].display = "flex";
        });
        closeMenu.addEventListener("click", () => {
          const container = this.shadowRoot.querySelector(".menu-modal");
          container["style"].display = "none";
        });
        return;
      } else {
        console.log("entre al segundo if");

        div.innerHTML = `
        <div class="container-header">
        <div class="izquierda">
          <a class="button-home">
              <span class="logo">🐶</span>
          </a>
        </div>
        <div class="derecha">
           <button class="abre-ventana">☰</button>
        </div>

        </div>
        <div class="menu-modal">
        <button class="modal-close">❌</button>
          
          <span>Mis Datos</span>
          <span class="my-reports">Mis Mascotas Reportadas</span>
          <span class="do-report">Reportar Mascota</span>
          
          <div class="menu-footer">
              <div class="name-user"></div>
              <button class="close-session">Cerrar Seccion</button>
          </div>
        </div>
      ${this.getStyles()}`;
      }
      this.shadowRoot.appendChild(div);

      const nameUser = this.shadowRoot.querySelector(".name-user");
      // if (stateLocal.fullname) {
      //   nameUser.textContent = `${stateLocal.fullname}`;
      // }

      // const closeSession = this.shadowRoot.querySelector(".close-session");
      // closeSession.addEventListener("click", () => {
      //   mainState.logOut();
      // });

      const openMenu = this.shadowRoot.querySelector(".derecha");
      const closeMenu = this.shadowRoot.querySelector(".modal-close");
      openMenu.addEventListener("click", () => {
        const container = this.shadowRoot.querySelector(".menu-modal");
        container["style"].display = "flex";
      });
      closeMenu.addEventListener("click", () => {
        const container = this.shadowRoot.querySelector(".menu-modal");
        container["style"].display = "none";
      });

      const doReport = this.shadowRoot.querySelector(".do-report");
      doReport.addEventListener("click", () => {
        location.pathname = "do-report";
      });
      const myReports = this.shadowRoot.querySelector(".my-reports");
      myReports.addEventListener("click", () => {
        location.pathname = "my-reports";
      });
    }
    getStyles() {
      return `
                <style>
                .container-header {
                  display: flex;
                  padding: 20px;
                  text-align: center;
                  justify-content: space-between;
                  background-color: #D2B4DE;
                  font-size: 50px;

                }

                .menu-modal {
                  display: flex;
                  flex-direction: column;
                  justify-content: space-evenly;
                  text-align: center;
                  position: absolute;
                  top: 0px;
                  left: 0px;
                  right: 0px;
                  bottom: 0px;
                  background-color: #F5B7B1;
                  font-size: 40px;
                  font-weight: bold;
                  padding: 80px;
                  display: none;
                }

                .menu-items {
                  display: flex;
                  flex-direction: column;
                  gap: 60px;
                  padding-top:60px;
                }

                .menu-footer {
                  padding-top:150px;
                  font-size: 20px
                }

                .modal-close {
                  position: absolute;
                  top: 35px;
                  left: 300px;
                  right: 30px;
                  bottom: 690px;
                }

                
               </style>
                `;
    }
  }

  customElements.define("comp-header", Header);
}
