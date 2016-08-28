import ExtendableError from './extendable-error';

export default class DependencyNotFoundError extends ExtendableError {
  /**
   * @param {string} dependency
   */
  constructor(dependency) {
    super(`Dependency "${dependency}" was not found.`);
  }
}
