const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

const sendError = (res, message, statusCode = 500, code = 'ERROR') => {
  res.status(statusCode).json({
    success: false,
    message,
    code,
  });
};

const formatResponse = (data) => {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
};

module.exports = {
  sendSuccess,
  sendError,
  formatResponse,
};
