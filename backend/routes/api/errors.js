class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = AuthenticationError;
    this.statusCode = 401;
  }
}
class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = AuthorizationError;
    this.statusCode = 403;
  }
}

class noResourceExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = noResourceExistsError;
    this.statusCode = 404;
  }
}

module.exports = {
  AuthenticationError,
  AuthorizationError,
  noResourceExistsError,
};
