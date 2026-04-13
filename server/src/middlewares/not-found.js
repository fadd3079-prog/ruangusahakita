import { sendError } from "../utils/api-response.js";

export function notFoundHandler(req, res) {
  return sendError(res, {
    status: 404,
    message: "Route not found",
    error: `${req.method} ${req.originalUrl} is not available`,
  });
}
