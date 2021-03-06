import { mainState } from "../state";
import Dropzone from "dropzone";
import { map } from "./mapa";
import { Router } from "@vaadin/router";

class ReportPet extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.attachShadow({ mode: "open" });
    const div = document.createElement("div");
    const state = mainState.getState();
    div.className = "container-report";
    div.innerHTML = `
        <form class="form-report">
            <label>
              <h3 class="subtitle">Name</h3>
              <input type="text" name="name" class="input-name" placeholder="Name" />
            </label>
            <label>
              <h3 class="subtitle">Race</h3>
              <input type="text" name="raza" class="raza" placeholder="Race" />
            </label>
              <div class="profile-picture-container">
                <h3 class="subtitle">Drag the photo here 📸</h3>
              </div>
              <span class="instructions-search">
              By default the location where you are will be reported, if you wish to indicate another location in the report you can do so on the map below.
              </span>
              <button class="send-form">Report as Lost</button>
        </form>
        <button class="button-cancelar">Cancel</button>
          ${this.getStyles()}`;
    this.shadowRoot.appendChild(div);

    const body = document.querySelector("body");
    const searchMap = document.querySelector(".search-form");
    const mapa = document.querySelector("#map");

    if (location.pathname === "do-report") {
      body["style"].backgroundColor = "#CFD8DC";
      searchMap["style"].display = "inherit";
      mapa["style"].display = "flex";
    }
    const token = localStorage.getItem("token");
    const idPet = state.reportId;
    const form = this.shadowRoot.querySelector(".form-report");
    const profile = this.shadowRoot.querySelector(".profile-picture-container");

    let imageDataURL;

    const myDropzone = new Dropzone(profile, {
      url: "/falsa",
      autoProcessQueue: false,
      clickable: true,
    });
    myDropzone.on("addedfile", function (file) {
      // usando este evento pueden acceder al dataURL directamente
      imageDataURL = file;
      console.log("file", file);
    });
    navigator.geolocation.getCurrentPosition((position) => {
      state.myData.location.lat = position.coords.latitude;
      state.myData.location.lng = position.coords.longitude;
      mainState.setState(state);
    });
    const buttonFind = this.shadowRoot.querySelector(".button-cancelar");
    buttonFind.addEventListener("click", (e) => {
      e.preventDefault();
      return Router.go("/home");
    });
    if (location.pathname === "/my-reports") {
      const buttonSave = this.shadowRoot.querySelector(".send-form");
      buttonSave.textContent = "Save 💾";
      buttonFind.textContent = "Report as found";
      buttonFind["style"].backgroundColor = "#5DADE2";
    }
    buttonFind.addEventListener("click", async (e) => {
      e.preventDefault();
      await mainState.updateReport({ state: false }, token, idPet);
      return;
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = e.target["name"].value;
      const raza = e.target["raza"].value;
      const data = {
        name,
        raza,
        pictureURL: imageDataURL.dataURL || state.reportUrl,
        lat: state.myData.location.lat,
        lng: state.myData.location.lng,
        state: true,
        location: state.locationReport,
      };
      console.log("formulario", data);

      if (location.pathname === "/do-report") {
        const cancel = this.shadowRoot.querySelector(".button-cancelar");
        cancel.addEventListener("click", () => {
          return Router.go("/home");
        });
        if (name === "" || raza === "") {
          return alert("Faltan datos de la mascota reportada");
        }
        await mainState.doReport(data, token);
        return Router.go("/my-reports");
      }
      if (location.pathname === "/my-reports") {
        await mainState.updateReport(data, token, idPet);
        div.innerHTML = `
          <div class="report-send">¡Report sent successfully! ✅</div>
          `;
        location.reload();
        return Router.go("/my-reports");
      }
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
  
                }

                .form-report {
                  display:flex;
                  flex-direction:column;
                  gap:30px;
                  padding:30px 30px 0 30px;
                  align-items: center;
                  max-width: 600px;
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
                  cursor: pointer;
                }

                .send-form{
                  background-color: #43A047;
                  min-width:100px;
                  min-height: 40px;
                  border-radius: 5px;
                  cursor: pointer;
                }
               </style>
                `;
  }
}
map();

customElements.define("form-report-pet", ReportPet);
