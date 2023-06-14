class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = AuthenticationError;
    this.status = 401;
  }
}
class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.title = "Authentication Required";
    this.name = AuthorizationError;
    this.errors = { message: "Authentication required." };
    this.status = 403;
  }
}

class noResourceExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = noResourceExistsError;
    this.status = 404;
  }
}

module.exports = {
  AuthenticationError,
  AuthorizationError,
  noResourceExistsError,
};
