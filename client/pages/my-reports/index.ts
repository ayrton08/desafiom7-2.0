import { mainState } from "../../state";
import { config } from "../../config";
// const API_BASE_URL = config.apiUrl me tira undefided la variable de ambiente
const API_BASE_URL = "http://localhost:3000/api/v1";
class MyReports extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <comp-header></comp-header>
    <div class="content-reports">
      <span class="title-welcome">Mis Mascotas Reportadas</span>
      <div class="services-section-two"></div>
    </div>
    <template id="portfolio-template">
            <div class="pets-card">
                <img class="logo-section-two" style="width:100%;" />
                <span class="title"></span>
                <a class="informacion"></a>
            </div>
    </template>
    `;

    getDataPets().then((data) => {
      for (const c of data) {
        console.log(c);
        addPetCard(c);
      }
    });

    function addPetCard(params = {}) {
      const template = document.querySelector("#portfolio-template");
      const container = document.querySelector(".services-section-two");

      template["content"].querySelector(".logo-section-two").src =
        params["pictureURL"];
      template["content"].querySelector(".title").textContent = params["name"];
      template["content"].querySelector(".informacion").textContent = "Editar";

      const clone = document.importNode(template["content"], true);
      container.appendChild(clone);
    }

    async function getDataPets() {
      const token = localStorage.getItem("token");
      const response = await mainState.findMyReports(token);
      console.log("esta es la repuesta de las pets que son mias", response);
      return response;
    }
  }
}
customElements.define("my-reports-page", MyReports);
