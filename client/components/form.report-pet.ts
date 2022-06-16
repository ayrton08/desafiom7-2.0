import { mainState } from "../state";
import Dropzone from "dropzone";
import { map } from "./mapa";

export function reportPet() {
  class ReportPet extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      div.className = "container-report";
      div.innerHTML = `
        <form class="form-report">
            <label>
              <h3 class="subtitle">Nombre</h3>
              <input type="text" name="name" class="input-name" placeholder="Your Name" />
            </label>
            <label>
              <h3 class="subtitle">Raza</h3>
              <input type="text" name="raza" class="raza" placeholder="Raza" />
            </label>
              <div class="profile-picture-container">
                <h3 class="subtitle">Arraste su foto aqui 📸</h3>
              </div>
              <span class="instructions-search">
                Por defecto se reportara la ubicación en la que se encuentra, si desea indicar otra ubicacion en el reporte puede hacerlo en el mapa abajo.
              </span>
              <button class="send-form">Reportar como Perdido</button>
              </form>
              <button class="button-cancelar">Cancelar</button>
          ${this.getStyles()}`;
      this.shadowRoot.appendChild(div);

      const body = document.querySelector("body");
      const searchMap = document.querySelector(".search-form");
      const mapa = document.querySelector(".mapboxgl-map");

      if (location.pathname.includes("do-report")) {
        body["style"].backgroundColor = "#CFD8DC";
        searchMap["style"].display = "inherit";
        mapa["style"].overflow = "inherit";
      }

      const token = localStorage.getItem("token");

      const form = this.shadowRoot.querySelector(".form-report");
      const profile = this.shadowRoot.querySelector(
        ".profile-picture-container"
      );
      let imageDataURL;

      const myDropzone = new Dropzone(profile, {
        url: "/falsa",
        autoProcessQueue: false,
        clickable: true,
      });
      myDropzone.on("addedfile", function (file) {
        // usando este evento pueden acceder al dataURL directamente
        imageDataURL = file;
      });
      const state = mainState.getState();
      navigator.geolocation.getCurrentPosition((position) => {
        state.myData.location.lat = position.coords.latitude;
        state.myData.location.lng = position.coords.longitude;
        mainState.setState(state);
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = e.target["name"].value;
        const raza = e.target["raza"].value;
        if (name === "" || raza === "") {
          return alert("Faltan datos de la mascota reportada");
        }
        const data = {
          name,
          raza,
          pictureURL: imageDataURL.dataURL,
          lat: state.myData.location.lat,
          lng: state.myData.location.lng,
          state: true,
        };
        const res = await mainState.doReport(data, token);
        return (location.pathname = "my-reports");
      });
      const cancel = this.shadowRoot.querySelector(".button-cancelar");
      cancel.addEventListener("click", () => {
        return (location.pathname = "home");
      });
    }
    getStyles() {
      return `
                <style>
                .container-report{
                  display: flex;
                  flex-direction: column;
                  border-radius: 5px;
                  text-align: center;
                  background-color: #CFD8DC;
                  align-items: center;
                  justify-content: center;
                  margin:40px 40px 0 40px;
  
                }

                .form-report {
                  display:flex;
                  flex-direction:column;
                  gap:30px;
                  padding:30px 30px 0 30px;
                  align-items: center;
                }

                button {
                  max-width:60%;
                }

                .profile-picture-container {
                  min-width:200px;
                  min-height: 150px;
                  background-color: #E5E8E8;
                  

                }

                
                
                .subtitle{
                  margin: 0px;
                  font-size: 20px;
                }
                .instructions-search {
                  font-size: 20px;
                }

                .button-cancelar{
                  margin:15px;
                  background-color: #E74C3C;
                  min-width:100px;
                  min-height: 40px;
                  border-radius: 5px;
                }

                .send-form{
                  background-color: #43A047;
                  min-width:100px;
                  min-height: 40px;
                  border-radius: 5px;

                }
               </style>
                `;
    }
  }
  map();

  customElements.define("form-report-pet", ReportPet);
}
