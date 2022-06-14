import { Pets } from "../models";
import { index } from "../lib/algolia";
import { cloudinary } from "../lib/cloudinary";

export class PetsController {
  constructor() {}

  async findAllPets() {
    try {
      const allPets = await Pets.findAll();
      return allPets;
    } catch (error) {
      return new Error("No pudimos encontrar todos los pets reportados");
    }
  }

  async findClose(lat, lng) {
    const { hits } = await index.search("", {
      aroundLatLng: [lat, lng].join(","),
      aroundRadius: 5000,
    });
    return hits;
  }

  async updateReportAlgolia(id, name, state, lat, lng, user_id, pictureURL) {
    const algoliaRes = await index.saveObject({
      objectID: id,
      name: name,
      state: state,
      _geoloc: {
        lat: lat,
        lng: lng,
      },
      user_id,
      pictureURL,
    });
    return algoliaRes;
  }

  bodyToIndex(body, id?) {
    if (!body.lat || !body.lng || !body.name || !body.state) {
      return new Error("Faltan parametros");
    }
    const rta: any = {};
    if (body.name) {
      rta.name = body.name;
    }
    if (body.state) {
      rta.state = body.state;
    }
    if (body.UserId) {
      rta.user_id = body.UserId;
    }
    if (body.lat && body.lng) {
      rta._geoloc = {
        lat: body.lat,
        lng: body.lng,
      };
    }
    if (id) {
      rta.objectID = id;
    }
    return rta;
  }

  async reportLostPet(updateData) {
    if (updateData.pictureURL) {
      const image = await cloudinary.uploader.upload(updateData.pictureURL, {
        resource_type: "image",
        discard_original_filename: true,
        width: 1000,
      });
      const dataComplete = {
        name: updateData.name,
        raza: updateData.raza,
        pictureURL: image.secure_url,
        lat: updateData.lat,
        lng: updateData.lng,
        state: updateData.state,
        user_id: updateData.UserId,
      };

      const res = await Pets.create(dataComplete);

      return res;
    } else {
      console.error("No hay imagen adjunta");
    }
  }
}
