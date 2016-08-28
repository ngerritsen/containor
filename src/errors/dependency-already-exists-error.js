import ExtendableError from './extendable-error';

export default class DependencyAlreadyExistsError extends ExtendableError {
  /**
   * @param {string} dependency
   */
  constructor(dependency) {
    super(`Trying to register dependency "${dependency}" which already exists.`);
  }
}
