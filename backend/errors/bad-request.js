const CustomAPIError = require("./customError");
const { StatusCodes } = require("http-status-codes");
class BadRequest extends CustomAPIError {
  constructor(message = "Bad Request") {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequest;
