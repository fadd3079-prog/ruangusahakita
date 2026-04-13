import {
  getCreatorBySlug,
  getServiceBySlug,
  listCreatorServices,
  listCreators,
} from "../services/discovery.service.js";
import { sendSuccess } from "../utils/api-response.js";

export async function listCreatorsController(req, res) {
  const data = await listCreators(req.query);

  return sendSuccess(res, {
    message: "Daftar kreator berhasil dimuat",
    data,
  });
}

export async function getCreatorController(req, res) {
  const data = await getCreatorBySlug(req.params.slug);

  return sendSuccess(res, {
    message: "Profil kreator berhasil dimuat",
    data,
  });
}

export async function listCreatorServicesController(req, res) {
  const data = await listCreatorServices(req.params.slug);

  return sendSuccess(res, {
    message: "Layanan kreator berhasil dimuat",
    data,
  });
}

export async function getServiceController(req, res) {
  const data = await getServiceBySlug(req.params.slug);

  return sendSuccess(res, {
    message: "Detail layanan berhasil dimuat",
    data,
  });
}
