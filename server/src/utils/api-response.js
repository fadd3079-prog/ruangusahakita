export function sendSuccess(res, { status = 200, message = "Success", data = null } = {}) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

export function sendError(res, { status = 500, message = "Request failed", error = null } = {}) {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
}
