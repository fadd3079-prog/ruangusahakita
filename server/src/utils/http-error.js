export function createHttpError(status, message, details = null) {
  const error = new Error(message);
  error.status = status;
  error.details = details;
  return error;
}
