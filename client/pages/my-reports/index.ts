import { mainState } from "../../state";
import { config } from "../../config";
import { Router } from "@vaadin/router";
class MyReports extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  async render() {
    await mainState.myData();
    const state = mainState.getState();

    if (!state.myData.login) {
      return Router.go("/login");
    }
    this.innerHTML = `
    <comp-header></comp-header>
    <div class="content-reports">
      <span class="title-welcome">My Report Pets</span>
      <div class="services-section-two"></div>
      <div class="form-update"><div>
    </div>
    
    `;

    mainState.hiddeMap();

    getDataPets().then((data) => {
      for (const c of data) {
        addPetCard(c);
      }
    });

    function addPetCard(params = {}) {
      const state = mainState.getState();
      let status = "Encontrado";
      if (params["state"] === "true") {
        status = "Perdido";
      }
      const cardDiv = document.createElement("div");
      cardDiv.className = "pets-card";
      cardDiv.innerHTML = `
    
            <img class="logo-section-two" style="width: 100%;" src='${params["pictureURL"]}' />
            <span class="title-name">Nombre: <span class="title-reports">${params["name"]}</span></span>
            <span class="title-name">Raza: <span class="title-reports">${params["raza"]} </span></span>
            <span class="title-name">Estado: <span class="status">${status} 🐶 </span></span>
            <span class="title-name">Location: <span class="status">${params["location"]}</span></span>
            <a id='${params["id"]}' class="editar">Editar</a>
   `;

      cardDiv.addEventListener("click", async () => {
        const id = Number(`${params["id"]}`);
        state.reportUrl = params["pictureURL"];
        state.reportId = id;
        await mainState.findById(id);
        window.scroll({
          top: 100,
          left: 100,
          behavior: "smooth",
        });
        const formInfo = document.querySelector(".form-update");
        formInfo.innerHTML = `
          <button class="close-report">❌</button>
          <span class="name-pet-update">${params["name"]}</span>
          <img style="width: 100%;" src='${params["pictureURL"]}'></img>
          <form-report-pet class=""></form-report-pet>
    
  `;

        const buttonClose = document.querySelector(".close-report");
        buttonClose.addEventListener("click", () => {
          formInfo.innerHTML = "";
        });
      });

      const divNew = document.querySelector(".content-reports");
      divNew.appendChild(cardDiv);
    }

    async function getDataPets() {
      const token = localStorage.getItem("token");
      const response = await mainState.findMyReports(token);
      return response;
    }
  }
}
customElements.define("my-reports-page", MyReports);
