import { ZodError } from "zod";
import { sendError } from "../utils/api-response.js";

export function errorHandler(err, req, res, next) {
  if (!err.status || err.status >= 500) {
    console.error(err);
  }

  if (err instanceof ZodError) {
    return sendError(res, {
      status: 400,
      message: "Data yang dikirim belum sesuai",
      error: err.issues,
    });
  }

  return sendError(res, {
    status: err.status || 500,
    message: err.message || "Internal server error",
    error: err.details || err.code || null,
  });
}
