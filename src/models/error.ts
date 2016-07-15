class BaseError extends Error {
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

class ParserError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}

export { ParserError }

