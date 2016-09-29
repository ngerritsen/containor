export default class ExtendableError extends Error {
  constructor(message = '') {
    super(message);

    Object.defineProperty(this, 'message', {
      value: message
    });

    Object.defineProperty(this, 'name', {
      value: this.constructor.name
    });

    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(this, this.constructor);
      return;
    }

    Object.defineProperty(this, 'stack', {
      value: new Error(message).stack
    });
  }
}
