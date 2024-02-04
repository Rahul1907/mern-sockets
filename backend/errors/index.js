const BadRequestError = require("./bad-request");
const CustomAPIError = require("./customError");
const UnauthenticatedError = require("./unauthenticated-error");
const NotFoundError = require("./not-found-error");
module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
};
