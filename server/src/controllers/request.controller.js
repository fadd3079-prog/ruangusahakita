import {
  createRequest,
  getRequestDetail,
  listIncomingRequests,
  listRequests,
  updateRequestStatus,
} from "../services/request.service.js";
import { createRequestSchema, updateRequestStatusSchema } from "../validators/request.validators.js";
import { sendSuccess } from "../utils/api-response.js";

export async function createRequestController(req, res) {
  const payload = createRequestSchema.parse(req.body);
  const data = await createRequest(req.supabase, req.user.id, payload);

  return sendSuccess(res, {
    status: 201,
    message: "Brief berhasil dikirim",
    data,
  });
}

export async function listRequestsController(req, res) {
  const data = await listRequests(req.supabase, req.user.id);

  return sendSuccess(res, {
    message: "Daftar permintaan berhasil dimuat",
    data,
  });
}

export async function listIncomingRequestsController(req, res) {
  const data = await listIncomingRequests(req.supabase, req.user.id);

  return sendSuccess(res, {
    message: "Permintaan masuk berhasil dimuat",
    data,
  });
}

export async function getRequestController(req, res) {
  const data = await getRequestDetail(req.supabase, req.user.id, req.params.requestId);

  return sendSuccess(res, {
    message: "Detail permintaan berhasil dimuat",
    data,
  });
}

export async function updateRequestStatusController(req, res) {
  const payload = updateRequestStatusSchema.parse(req.body);
  const data = await updateRequestStatus(req.supabase, req.user.id, req.params.requestId, payload.status);

  return sendSuccess(res, {
    message: "Status permintaan berhasil diperbarui",
    data,
  });
}
