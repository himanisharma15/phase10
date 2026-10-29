export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFound = (req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
};

export const errorHandler = (error, req, res, next) => {
  const status = error.status || 500;
  if (error.code?.startsWith('AI_')) console.error('[api]', JSON.stringify({ path: req.path, method: req.method, status, code: error.code, message: error.message }));
  const response = { success: false, error: { code: error.code || 'INTERNAL_ERROR', message: status === 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message } };
  if (error.details) response.error.details = error.details;
  if (status === 500) console.error(error.message);
  res.status(status).json(response);
};
