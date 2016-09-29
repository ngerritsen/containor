/**
 * @typedef  {Object}   PublicDependencyProxy
 * @property {Function} with
 * @property {Function} raw
 */

export default class PublicDependencyProxy {
  /**
   * @param {Dependency} dependency
   */
  constructor(dependency) {
    this._dependency = dependency;
  }
  /**
   * Puts arguments on dependency
   *
   * @returns {PublicDependencyProxy}
   */
  with(...args) {
    this._dependency.addArguments(args);
    return this;
  }

  /**
   * Puts raw arguments on dependency
   *
   * @returns {PublicDependencyProxy}
   */
  raw(...args) {
    this._dependency.addArguments(args, true);
    return this;
  }
}
