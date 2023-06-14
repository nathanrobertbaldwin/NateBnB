class noPermissionsError extends Error {
  constructor(message) {
    super(message);
    this.name = notAuthorizedError;
    this.statusCode = 404;
  }
}

class noResourceExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = noResourceExistsError;
    this.statusCode = 404;
  }
}

module.exports = { noPermissionsError, noResourceExistsError };
