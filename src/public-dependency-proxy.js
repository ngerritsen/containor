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
   */
  with(...args) {
    this._dependency.addArguments(args);
  }

  /**
   * Puts raw arguments on dependency
   */
  raw(...args) {
    this._dependency.addArguments(args, true);
  }
}
