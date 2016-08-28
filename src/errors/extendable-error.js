export default class ExtendableError extends Error {
  constructor(message = '') {
    super(message);

    Reflect.defineProperty(this, 'message', {
      value: message
    });

    Reflect.defineProperty(this, 'name', {
      value: this.constructor.name
    });

    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(this, this.constructor);
      return;
    }

    Reflect.defineProperty(this, 'stack', {
      value: new Error(message).stack
    });
  }
}
